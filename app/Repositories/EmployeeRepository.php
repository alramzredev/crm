<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Project;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Request;

class EmployeeRepository
{
    /**
     * Get paginated employees supervised by the given supervisor
     */
    public function getPaginatedEmployees(User $supervisor)
    {
        return $supervisor->salesEmployees()
            ->withCount('projects')
            ->orderByName()
            ->paginate()
            ->appends(Request::all());
    }

    /**
     * Get employee details with their project assignments
     */
    public function getEmployeeDetails(User $employee, User $supervisor)
    {
        return $employee->load([
            'projects' => function ($q) {
                $q->where('project_user.role_in_project', 'sales_employee')
                  ->where('project_user.is_active', true);
            }
        ]);
    }

    /**
     * Get projects available for the supervisor to assign
     */
    public function getAvailableProjects(User $supervisor)
    {
        return Project::whereHas('users', function ($q) use ($supervisor) {
            $q->where('project_user.user_id', $supervisor->id)
              ->where('project_user.role_in_project', 'sales_supervisor')
              ->where('project_user.is_active', true);
        })
        ->orderBy('name')
        ->get();
    }

    /**
     * Check if an employee is supervised by the given supervisor
     */
    public function isEmployeeSupervisedBy(User $employee, User $supervisor): bool
    {
        return $supervisor->salesEmployees()
            ->where('sales_teams.employee_id', $employee->id)
            ->exists();
    }

    /**
     * Check if a project is supervised by the given supervisor
     */
    public function isProjectSupervisedBy(int $projectId, User $supervisor): bool
    {
        return $supervisor->salesManagedProjects()
            ->where('projects.id', $projectId)
            ->exists();
    }

    /**
     * Assign an employee to a project
     */
    public function assignEmployeeToProject(User $employee, int $projectId): void
    {
        $employee->projects()->syncWithoutDetaching([
            $projectId => [
                'role_in_project' => 'sales_employee',
                'assigned_by' => auth()->id(),
                'assigned_at' => now(),
                'is_active' => true,
            ]
        ]);
    }

    /**
     * Remove an employee from a project
     */
    public function removeEmployeeFromProject(User $employee, int $projectId): void
    {
        $employee->projects()
            ->wherePivot('project_id', $projectId)
            ->wherePivot('role_in_project', 'sales_employee')
            ->detach($projectId);
    }
}
