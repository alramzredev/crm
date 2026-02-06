<?php

namespace App\Repositories;

use App\Models\Lead;
use App\Models\User;
use App\Models\LeadSource;
use App\Models\Project;
use App\Models\LeadStatus;
use Illuminate\Support\Facades\Request;

class LeadRepository
{
    /**
     * Get paginated leads based on user's project access and assignments
     *
     * Step 1: Check if user is a sales_employee
     *   - If yes, only show leads from projects they are assigned to
     *   - AND only show leads that are assigned to them
     *
     * Step 2: If user is not a sales_employee (supervisor/manager)
     *   - Show all leads or leads from their managed projects
     */
    public function getPaginatedLeads(User $user, array $filters = [])
    {
        $query = Lead::with('project');

        // Role-based filtering
        if ($user->hasRole('sales_employee')) {
            $query->whereHas('activeAssignment', function ($q) use ($user) {
                $q->where('employee_id', $user->id);
            });
        } else if ($user->hasRole('sales_supervisor')) {
            $query->whereHas('project', function ($q) use ($user) {
                $q->whereIn('id', $user->activeProjects()->pluck('projects.id'));
            });
        }

        // Search and status filtering
        return $query
            ->when(Request::get('search'), fn ($q, $search) =>
                $q->where(function ($q2) use ($search) {
                    $q2->where('first_name', 'like', "%{$search}%")
                       ->orWhere('last_name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%");
                })
            )
            ->when(Request::get('status'), fn ($q, $status) =>
                $q->where('status_id', $status)
            )
            ->when(Request::get('trashed'), fn ($q, $trashed) =>
                $trashed === 'with' ? $q->withTrashed() : ($trashed === 'only' ? $q->onlyTrashed() : $q)
            )
            ->orderByName()
            ->paginate()
            ->appends(Request::all());
    }

    public function getCreateData(): array
    {
        return [
            'leadSources' => LeadSource::orderBy('name')->get(),
            'leadStatuses' => LeadStatus::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
            'brokers' => User::role('sales_employee')->orderByName()->get(),
        ];
    }

    public function getEditData(Lead $lead): array
    {
        return [
            'lead' => $lead->load(['activeAssignment', 'status']),
            'leadSources' => LeadSource::orderBy('name')->get(),
            'leadStatuses' => LeadStatus::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
            'brokers' => User::role('sales_employee')->orderByName()->get(),
        ];
    }
}
