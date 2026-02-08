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
        $query = Lead::with('project')->filterByUserRole($user);

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
            ->orderBy('created_at', 'desc')
            ->paginate()
            ->appends(Request::all());
    }

    public function getCreateData(User $user)
    {
         
        $projectsQuery = Project::orderBy('name');
        
        // Filter projects by user role if not super admin
        if (!$user->hasRole('super_admin')) {
            $projectsQuery->filterByUserRole($user);
        }

        return [
            'leadSources' => LeadSource::orderBy('name')->get(),
            'leadStatuses' => LeadStatus::orderBy('name')->get(),
            'projects' => $projectsQuery->get(),
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
