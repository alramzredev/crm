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
use App\Http\Resources\LeadStatusResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\DB;

class LeadService
{
    protected $repo;

    public function __construct(LeadRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getPaginatedLeads(User $user, array $filters = [])
    {
         $query = $this->repo->query(['project', 'leadSource', 'activeAssignment', 'status'])
             ->forUser($user);

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
        $projectsQuery = Project::orderBy('name')->forUser($user);

        return [
            'leadSources' => LeadSource::orderBy('name')->get(),
            'leadStatuses' => LeadStatusResource::collection(LeadStatus::orderBy('name')->get()),
            'projects' => $projectsQuery->get(),
            'employees' => $projectsQuery->first()
                ? $this->getUsersByProjectAndRoles($projectsQuery->first()->id)
                : collect(),
            'brokers' => User::role('sales_employee')->orderByName()->get(),
        ];
    }

    public function getEditData(Lead $lead): array
    {
        // Use forUser to restrict projects for the current user
  
        return [
            'lead' =>  new LeadResource($lead->load(['activeAssignment', 'status', 'project',  'leadSource'])),
            'leadSources' => LeadSource::orderBy('name')->get(),
            'leadStatuses' => LeadStatusResource::collection(LeadStatus::orderBy('name')->get()),
            'brokers' => UserResource::collection(User::role('sales_employee')->orderByName()->get()),
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

   public function assignEmployee(Lead $lead, $employeeId)
{
   DB::transaction(function () use ($lead, $employeeId) {

    $current = $lead->activeAssignment()->lockForUpdate()->first();
 
    if ($current && $current->employee_id == $employeeId) {
        return;
    }

    if ($current) {
        $current->update([
            'is_active' => false,
            'unassigned_at' => now(),
        ]);
    }

    if (!$employeeId) {
        return;
    }

    $lead->assignments()->create([
        'employee_id' => $employeeId,
        'assigned_by' => auth()->id(),
        'assigned_at' => now(),
        'is_active' => true,
    ]);

});
}

    public function unassignEmployee(Lead $lead)
    {
        $current = $lead->activeAssignment()->first();
        if ($current) {
            $current->update([
                'is_active' => false,
                'unassigned_at' => now(),
            ]);
        }
    }

    public function getUsersByProjectAndRoles($projectId , $roles = ['sales_employee'])
    {
        return User::byProjectAndRoles($projectId, $roles)
            ->orderBy('first_name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')) ?: $user->name,
                    'email' => $user->email,
                ];
            });
    }
}
