<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Project;
use App\Http\Resources\UserResource;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Request;

class UserRepository
{
    public function getPaginatedUsers(array $filters = [])
    {
        return UserResource::collection(
            User::orderByName()
                ->filter($filters)
                ->paginate()
                ->appends(Request::all())
        );
    }

    public function getAvailableRoles()
    {
        return \Spatie\Permission\Models\Role::all(['name', 'label']);
    }

    public function getCreateData(): array
    {
        return [
            'roles' => Role::all(),
            'supervisors' => User::role('sales_supervisor')->orderByName()->get(),
            'projects' => Project::orderBy('name')->get(),
        ];
    }

    public function getEditData(User $user): array
    {
        return [
            'user' => $user->load(['roles', 'supervisor', 'projects']),
            'roles' => Role::all(),
            'supervisors' => User::role('sales_supervisor')->orderByName()->get(),
            'projects' => Project::orderBy('name')->get(),
        ];
    }

    public function attachProjectsWithRole(User $user, array $projectIds, string $role): void
    {
        $attachData = [];
        foreach ($projectIds as $projectId) {
            $attachData[$projectId] = [
                'role_in_project' => $role,
                'assigned_by' => auth()->id(),
                'assigned_at' => now(),
                'is_active' => true,
            ];
        }
        $user->projects()->attach($attachData);
    }

    public function syncProjectsWithRole(User $user, array $projectIds, string $role): void
    {
        // Get current project IDs for this specific role
        $current = $user->projects()
            ->wherePivot('role_in_project', $role)
            ->wherePivot('is_active', true)
            ->pluck('project_id')
            ->toArray();

        // Find projects to detach (only for this role)
        $toDetach = array_diff($current, $projectIds);
        if (!empty($toDetach)) {
            // Detach only projects with this specific role
            foreach ($toDetach as $projectId) {
                $user->projects()
                    ->wherePivot('project_id', $projectId)
                    ->wherePivot('role_in_project', $role)
                    ->detach($projectId);
            }
        }

        // Find projects to attach
        $toAttach = array_diff($projectIds, $current);
        if (!empty($toAttach)) {
            $this->attachProjectsWithRole($user, $toAttach, $role);
        }
    }
}
