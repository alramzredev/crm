<?php

namespace App\Repositories;

use App\Models\Lead;
use App\Models\User;
use App\Models\LeadSource;
use App\Models\Project;
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

        // Sales employees: Only see leads assigned to them from their allowed projects
        if ($user->hasRole('sales_employee')) {
             $query->whereHas('activeAssignment', function ($q) use ($user) {
                // Condition: Lead must be assigned to this employee
                $q->where('employee_id', $user->id);
            });
        }
        // Sales supervisors: See leads from their assigned projects
        else if ($user->hasRole('sales_supervisor')) {
            $query->whereHas('project', function ($q) use ($user) {
                $q->whereIn('id', $user->activeProjects()->pluck('projects.id'));
            });
        }
        // Project managers and above: See all leads
        // (no additional filter needed)

        return $query
            ->orderByName()
            ->filter($filters)
            ->paginate()
            ->appends(Request::all());
    }

    public function getCreateData(): array
    {
        return [
            'leadSources' => LeadSource::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
            'brokers' => User::role('sales_employee')->orderByName()->get(),
        ];
    }

    public function getEditData(Lead $lead): array
    {
        return [
            'lead' => $lead->load('activeAssignment'),
            'leadSources' => LeadSource::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
            'brokers' => User::role('sales_employee')->orderByName()->get(),
        ];
    }
}
