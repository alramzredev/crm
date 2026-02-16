<?php

namespace App\Services;

use App\Models\User;
use App\Models\Project;
use App\Models\Owner;
use App\Models\City;
use App\Models\ProjectType;
use App\Models\ProjectStatus;
use App\Models\Municipality;
use App\Models\Neighborhood;
use App\Repositories\ProjectRepository;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\PropertyResource;
use Illuminate\Support\Facades\Request;

class ProjectService
{
    protected $repo;

    public function __construct(ProjectRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Get paginated projects based on user role and filters, wrapped as resources.
     */
    public function getPaginatedProjects(User $user, array $filters = [])
    {
        $query = $this->repo->query(['owner', 'city', 'status']);

        // Role-based visibility logic
        if ($user->hasRole('super_admin')) {
            // No restrictions
        } else if ($user->hasRole('project_admin')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->where('project_user.role_in_project', 'project_admin')
                  ->where('project_user.is_active', true);
            });
        } else if ($user->hasRole('sales_supervisor')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->where('project_user.role_in_project', 'sales_supervisor')
                  ->where('project_user.is_active', true);
            });
        } else if ($user->hasRole('sales_employee')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->where('project_user.role_in_project', 'sales_employee')
                  ->where('project_user.is_active', true);
            });
        } else {
            $query->whereRaw('1 = 0');
        }

        // Filtering and resource wrapping
        return ProjectResource::collection(
            $query
                ->when(Request::get('search'), fn ($q, $search) =>
                    $q->where(function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%")
                           ->orWhere('project_code', 'like', "%{$search}%");
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
                ->appends(Request::all())
        );
    }

    /**
     * Aggregate data for project creation form.
     */
    public function getCreateData(): array
    {
        return [
            'owners' => Owner::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'municipalities' => Municipality::orderBy('name')->get(),
            'neighborhoods' => Neighborhood::orderBy('name')->get(),
            'projectTypes' => ProjectType::orderBy('name')->get(),
            'projectStatuses' => ProjectStatus::orderBy('name')->get(),
        ];
    }

    /**
     * Aggregate data for project edit form.
     */
    public function getEditData(Project $project): array
    {
        return [
            'project' => new ProjectResource(
                $project->load([
                    'owner',
                    'city',
                    'municipality',
                    'projectType',
                    'status',
                    'users'
                ])
            ),
            'owners' => Owner::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'municipalities' => Municipality::orderBy('name')->get(),
            'neighborhoods' => Neighborhood::orderBy('name')->get(),
            'projectTypes' => ProjectType::orderBy('name')->get(),
            'projectStatuses' => ProjectStatus::orderBy('name')->get(),
        ];
    }

    /**
     * Get project resource with paginated properties.
     */
    public function getShowResource(Project $project)
    {
        $project->load([
            'owner.ownerType',
            'city',
            'municipality',
            'projectType',
            'status',
            'users',
        ]);

        $properties = $this->repo->getProjectProperties($project);

        return [
            'project' => new ProjectResource($project),
            'properties' => PropertyResource::collection($properties),
        ];
    }

    /**
     * Check if user can access project.
     */
    public function canAccessProject(User $user, Project $project): bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }
        if ($user->hasRole('project_admin')) {
            return $project->users()
                ->where('project_user.user_id', $user->id)
                ->where('project_user.role_in_project', 'project_admin')
                ->where('project_user.is_active', true)
                ->exists();
        }
        if ($user->hasRole('sales_supervisor')) {
            return $project->users()
                ->where('project_user.user_id', $user->id)
                ->where('project_user.role_in_project', 'sales_supervisor')
                ->where('project_user.is_active', true)
                ->exists();
        }
        if ($user->hasRole('sales_employee')) {
            return $project->users()
                ->where('project_user.user_id', $user->id)
                ->where('project_user.role_in_project', 'sales_employee')
                ->where('project_user.is_active', true)
                ->exists();
        }
        return false;
    }
}
