<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Project;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Request;

class EmployeeRepository
{
    /**
     * Get paginated employees supervised by a sales supervisor
     */
    public function getPaginatedEmployees(User $supervisor)
    {
        $query = User::role('sales_employee')
            ->whereHas('supervisor', function ($q) use ($supervisor) {
                $q->where('supervisor_id', $supervisor->id);
            });

        if (Request::has('search')) {
            $search = Request::get('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->orderByName()
            ->paginate(25)
            ->appends(Request::all());
    }

    /**
     * Get detailed employee information with projects
     */
    public function getEmployeeDetails(User $employee, User $supervisor)
    {
        $employee->load(['supervisor', 'projects']);
        
        // Get only projects this supervisor manages
        $assignedProjects = $employee->projects()
            ->whereHas('users', function ($q) use ($supervisor) {
                $q->where('user_id', $supervisor->id)
                  ->wherePivot('role_in_project', 'sales_supervisor')
                  ->wherePivot('is_active', true);
            })
            ->get();

        $employee->assigned_projects = $assignedProjects;

        return new UserResource($employee);
    }

    /**
     * Get projects available to assign (only those supervised by the supervisor)
     */
    public function getAvailableProjects(User $supervisor)
    {
        return Project::whereHas('users', function ($q) use ($supervisor) {
            $q->where('user_id', $supervisor->id)
              ->wherePivot('role_in_project', 'sales_supervisor')
              ->wherePivot('is_active', true);
        })
        ->orderBy('name')
        ->get();
    }

    /**
     * Check if an employee is supervised by a supervisor
     */
    public function isEmployeeSupervisedBy(User $employee, User $supervisor): bool
    {
        return $employee->supervisor()
            ->where('supervisor_id', $supervisor->id)
            ->exists();
    }

    /**
     * Check if a project is supervised by a supervisor
     */
    public function isProjectSupervisedBy($projectId, User $supervisor): bool
    {
        return Project::where('id', $projectId)
            ->whereHas('users', function ($q) use ($supervisor) {
                $q->where('user_id', $supervisor->id)
                  ->wherePivot('role_in_project', 'sales_supervisor')
                  ->wherePivot('is_active', true);
            })
            ->exists();
    }

    /**
     * Assign employee to a project
     */
    public function assignEmployeeToProject(User $employee, $projectId): void
    {
        // Check if already assigned
        if ($employee->projects()->where('project_id', $projectId)->exists()) {
            return;
        }

        $employee->projects()->attach($projectId, [
            'role_in_project' => 'sales_employee',
            'assigned_by' => auth()->id(),
            'assigned_at' => now(),
            'is_active' => true,
        ]);
    }

    /**
     * Remove employee from a project
     */
    public function removeEmployeeFromProject(User $employee, $projectId): void
    {
        // Only detach the specific project with sales_employee role
        $employee->projects()
            ->wherePivot('project_id', $projectId)
            ->wherePivot('role_in_project', 'sales_employee')
            ->detach($projectId);
    }
}
