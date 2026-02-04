<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\User;
use App\Models\Owner;
use App\Models\City;
use App\Models\ProjectType;
use App\Models\ProjectOwnership;
use App\Models\ProjectStatus;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Request;

class ProjectRepository
{
    /**
     * Get paginated projects based on user role and project assignments
     *
     * ✅ VISIBILITY RULES:
     * 1️⃣ Super Admin → Sees ALL projects
     * 2️⃣ Project Manager → Sees projects where assigned as project_manager
     * 3️⃣ Sales Supervisor → Sees projects where assigned as sales_supervisor
     * 4️⃣ Sales Employee → Sees projects where assigned as sales_employee
     */
    public function getPaginatedProjects(User $user, array $filters = [])
    {
        $query = Project::with(['owner', 'city', 'status']);

        // Super Admin: No restrictions
        if ($user->hasRole('super_admin')) {
            // Sees all projects
        }
        // Project Manager: Only assigned projects with project_manager role
        else if ($user->hasRole('project_manager')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->where('project_user.role_in_project', 'project_manager')
                  ->where('project_user.is_active', true);
            });
        }
        // Sales Supervisor: Only assigned projects with sales_supervisor role
        else if ($user->hasRole('sales_supervisor')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->where('project_user.role_in_project', 'sales_supervisor')
                  ->where('project_user.is_active', true);
            });
        }
        // Sales Employee: Only assigned projects with sales_employee role
        else if ($user->hasRole('sales_employee')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->where('project_user.role_in_project', 'sales_employee')
                  ->where('project_user.is_active', true);
            });
        }
        // Unknown role: No access
        else {
            $query->whereRaw('1 = 0'); // No results
        }

        return ProjectResource::collection(
            $query
                ->orderBy('name')
                ->filter($filters)
                ->paginate()
                ->appends(Request::all())
        );
    }

    /**
     * Get data for project creation form
     */
    public function getCreateData(): array
    {
        return [
            'owners' => Owner::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'projectTypes' => ProjectType::orderBy('name')->get(),
            'projectOwnerships' => ProjectOwnership::orderBy('name')->get(),
            'projectStatuses' => ProjectStatus::orderBy('name')->get(),
        ];
    }

    /**
     * Get data for project edit form
     */
    public function getEditData(Project $project): array
    {
        return [
            'project' => new ProjectResource(
                $project->load([
                    'owner',
                    'city',
                    'projectType',
                    'ownership',
                    'status',
                    'users'
                ])
            ),
            'owners' => Owner::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'projectTypes' => ProjectType::orderBy('name')->get(),
            'projectOwnerships' => ProjectOwnership::orderBy('name')->get(),
            'projectStatuses' => ProjectStatus::orderBy('name')->get(),
        ];
    }

    /**
     * Get project resource with all relations loaded
     */
    public function getShowResource(Project $project)
    {
        return new ProjectResource(
            $project->load([
                'owner',
                'city',
                'projectType',
                'ownership',
                'status',
                'properties.units',
                'users'
            ])
        );
    }

    /**
     * Check if user can access project
     */
    public function canAccessProject(User $user, Project $project): bool
    {
        // Super Admin: Full access
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Project Manager: Must be assigned as project_manager
        if ($user->hasRole('project_manager')) {
            return $project->users()
                ->where('project_user.user_id', $user->id)
                ->where('project_user.role_in_project', 'project_manager')
                ->where('project_user.is_active', true)
                ->exists();
        }

        // Sales Supervisor: Must be assigned as sales_supervisor
        if ($user->hasRole('sales_supervisor')) {
            return $project->users()
                ->where('project_user.user_id', $user->id)
                ->where('project_user.role_in_project', 'sales_supervisor')
                ->where('project_user.is_active', true)
                ->exists();
        }

        // Sales Employee: Must be assigned as sales_employee
        if ($user->hasRole('sales_employee')) {
            return $project->users()
                ->where('project_user.user_id', $user->id)
                ->where('project_user.role_in_project', 'sales_employee')
                ->where('project_user.is_active', true)
                ->exists();
        }

        // No access for unknown roles
        return false;
    }
}
