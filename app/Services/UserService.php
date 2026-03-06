<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Models\User;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use Spatie\Permission\Models\Role;
use App\Http\Resources\UserResource;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAll(array $filters = [])
    {
        // Use UserResource for paginated results
        $paginator = $this->userRepository->query()
            ->orderByName()
            ->filter($filters)
            ->paginate()
            ->appends(request()->all());

        return UserResource::collection($paginator);
    }


    public function getAvailableRoles()
    {
        return $this->userRepository->getAvailableRoles();
    }

    public function getCreateData(): array
    {
        return $this->userRepository->getCreateData();
    }

    public function getEditData(User $user): array
    {
        $userLoaded = $this->userRepository->find($user->id, ['roles', 'supervisor', 'projects']);
        return [
            'user' => $userLoaded,
            'roles' => $this->userRepository->getAvailableRoles(),
            'supervisors' => $this->userRepository->query()->role('sales_supervisor')->orderByName()->get(),
            'projects' => \App\Models\Project::orderBy('name')->get(),
        ];
    }

    public function create(UserStoreRequest $request)
    {
        $user = User::create($request->validated());

        if ($request->filled('role')) {
            $role = Role::findById($request->input('role'));
            $user->assignRole($role);

            // Sales Employee: Assign supervisors
            if ($role->name === 'sales_employee' && $request->filled('supervisor_ids')) {
                $user->supervisor()->attach($request->input('supervisor_ids'));
            }

            // Sales Supervisor: Assign projects
            if ($role->name === 'sales_supervisor' && $request->filled('project_ids')) {
                $this->userRepository->attachProjectsWithRole($user, $request->input('project_ids'), 'sales_supervisor');
            }

            // Project Admin: Assign projects
            if ($role->name === 'project_admin' && $request->filled('project_ids')) {
                $this->userRepository->attachProjectsWithRole($user, $request->input('project_ids'), 'project_admin');
            }
        }

        return $user;
    }

    public function update(User $user, UserUpdateRequest $request)
    {
        $user->update($request->validated());

        if ($request->filled('role')) {
            $role = Role::findById($request->input('role'));
            $user->syncRoles($role);

            if ($role->name === 'sales_employee') {
                $user->supervisor()->sync($request->input('supervisor_ids') ?? []);
                // Remove only sales_employee project assignments
                $user->projects()->wherePivot('role_in_project', 'sales_employee')->detach();
            }
            else if ($role->name === 'sales_supervisor') {
                $user->supervisor()->detach();
                $this->userRepository->syncProjectsWithRole($user, $request->input('project_ids') ?? [], 'sales_supervisor');
            }
            else if ($role->name === 'project_admin') {
                $user->supervisor()->detach();
                $this->userRepository->syncProjectsWithRole($user, $request->input('project_ids') ?? [], 'project_admin');
            }
            else {
                // Only detach if changing to a role that doesn't use projects
                $user->supervisor()->detach();
                $user->projects()->detach();
            }
        }

        return $user;
    }

    public function delete(User $user)
    {
        return $user->delete();
    }
}
