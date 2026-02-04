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
        $current = $user->projects()
            ->where('role_in_project', $role)
            ->where('is_active', true)
            ->pluck('project_id')
            ->toArray();

        $toDetach = array_diff($current, $projectIds);
        if (!empty($toDetach)) {
            $user->projects()->wherePivot('role_in_project', $role)->detach($toDetach);
        }

        $toAttach = array_diff($projectIds, $current);
        if (!empty($toAttach)) {
            $this->attachProjectsWithRole($user, $toAttach, $role);
        }
    }
}
