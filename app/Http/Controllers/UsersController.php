<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserDeleteRequest;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\UserRepository;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new UserRepository();
    }

    public function index()
    {
        $this->authorize('viewAny', User::class);
        
        return Inertia::render('Users/Index', [
            'filters' => Request::all('search', 'role', 'trashed'),
            'users' => new UserCollection(
                $this->repo->getPaginatedUsers(Request::only('search', 'role', 'trashed'))
            ),
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);
        
        return Inertia::render('Users/Create', $this->repo->getCreateData());
    }

    public function store(UserStoreRequest $request)
    {
        $this->authorize('create', User::class);
        
        $user = User::create($request->validated());
        
        if ($request->filled('role')) {
            $role = Role::findById($request->input('role'));
            $user->assignRole($role);
            
            if ($role->name === 'sales_employee' && $request->filled('supervisor_ids')) {
                $user->supervisor()->attach($request->input('supervisor_ids'));
            }
            
            if ($role->name === 'sales_supervisor' && $request->filled('project_ids')) {
                $this->repo->attachProjectsWithRole($user, $request->input('project_ids'), 'sales_supervisor');
            }
        }

        return Redirect::route('users')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);
        
        $data = $this->repo->getEditData($user);
        
        return Inertia::render('Users/Edit', [
            'user' => new UserResource($data['user']),
            'roles' => $data['roles'],
            'supervisors' => $data['supervisors'],
            'projects' => $data['projects'],
        ]);
    }

    public function update(User $user, UserUpdateRequest $request)
    {
        $this->authorize('update', $user);
        
        $user->update($request->validated());

        if ($request->filled('role')) {
            $role = Role::findById($request->input('role'));
            $user->syncRoles($role);
            
            if ($role->name === 'sales_employee') {
                $user->supervisor()->sync($request->input('supervisor_ids') ?? []);
                $user->projects()->detach();
            } 
            else if ($role->name === 'sales_supervisor') {
                $user->supervisor()->detach();
                $this->repo->syncProjectsWithRole($user, $request->input('project_ids') ?? [], 'sales_supervisor');
            } 
            else {
                $user->supervisor()->detach();
                $user->projects()->detach();
            }
        }

        return Redirect::back()->with('success', 'User updated.');
    }

    public function destroy(User $user, UserDeleteRequest $request)
    {
        $this->authorize('delete', $user);
        
        $user->delete();

        return Redirect::back()->with('success', 'User deleted.');
    }

    public function restore(User $user)
    {
        $this->authorize('restore', $user);
        
        $user->restore();

        return Redirect::back()->with('success', 'User restored.');
    }
}
