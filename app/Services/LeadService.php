<?php

namespace App\Services;

use App\Repositories\LeadRepository;
use App\Models\Lead;
use App\Models\User;
use App\Models\LeadAssignment;
use App\Models\LeadSource;
use App\Models\Project;
use App\Models\LeadStatus;
use App\Http\Resources\LeadResource;

class LeadService
{
    protected $repo;

    public function __construct(LeadRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getPaginatedLeads(User $user, array $filters = [])
    {
         $query = $this->repo->query(['project', 'leadSource', 'activeAssignment', 'status']);

         if ($user->hasRole('sales_employee')) {
            $query->whereHas('activeAssignment', function ($q) use ($user) {
                $q->where('employee_id', $user->id);
            });
        } else if ($user->hasRole('sales_supervisor')) {
            $query->whereHas('project', function ($q) use ($user) {
                $q->whereIn('id', $user->activeProjects()->pluck('projects.id'));
            });
        }

         $query->orderByName()->filter($filters);

         if (!empty($filters['trashed'])) {
            if ($filters['trashed'] === 'with') {
                $query->withTrashed();
            } elseif ($filters['trashed'] === 'only') {
                $query->onlyTrashed();
            }
        }

        return LeadResource::collection(
            $query->paginate()->appends(request()->all())
        );
    }

    public function getCreateData(User $user): array
    {
         $projectsQuery = Project::orderBy('name');
        if (!$user->hasRole('super_admin')) {
            $projectsQuery->whereHas('users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->where('project_user.is_active', true);
            });
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
        // Logic moved from repo to here
        return [
            'lead' => $lead->load(['activeAssignment', 'status']),
            'leadSources' => LeadSource::orderBy('name')->get(),
            'leadStatuses' => LeadStatus::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
            'brokers' => User::role('sales_employee')->orderByName()->get(),
        ];
    }

    public function create(array $data)
    {
        $employeeId = $data['employee_id'] ?? null;
        unset($data['employee_id']);

        $lead = Lead::create($data);

        if ($employeeId) {
            LeadAssignment::create([
                'lead_id' => $lead->id,
                'employee_id' => $employeeId,
                'assigned_by' => auth()->id(),
                'assigned_at' => now(),
                'is_active' => true,
            ]);
        }

        return $lead;
    }

    public function update(Lead $lead, array $data)
    {
        $employeeId = $data['employee_id'] ?? null;
        unset($data['employee_id']);

        $lead->update($data);

        $current = $lead->activeAssignment()->first();
        if ($current && (int) $current->employee_id !== (int) $employeeId) {
            $current->update([
                'is_active' => false,
                'unassigned_at' => now(),
            ]);
        }
        if ($employeeId && (!$current || (int) $current->employee_id !== (int) $employeeId)) {
            LeadAssignment::create([
                'lead_id' => $lead->id,
                'employee_id' => $employeeId,
                'assigned_by' => auth()->id(),
                'assigned_at' => now(),
                'is_active' => true,
            ]);
        }
        if (!$employeeId && $current) {
            $current->update([
                'is_active' => false,
                'unassigned_at' => now(),
            ]);
        }

        return $lead;
    }

    public function delete(Lead $lead)
    {
        return $lead->delete();
    }

    public function restore(Lead $lead)
    {
        return $lead->restore();
    }
}
