<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserDeleteRequest;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);
        
        return Inertia::render('Users/Index', [
            'filters' => Request::all('search', 'role', 'trashed'),
            'users' => new UserCollection(
                User::orderByName()
                    ->filter(Request::only('search', 'role', 'trashed'))
                    ->paginate()
                    ->appends(Request::all())
            ),
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);
        
        return Inertia::render('Users/Create', [
            'roles' => Role::all(),
        ]);
    }

    public function store(UserStoreRequest $request)
    {
        $this->authorize('create', User::class);
        
        $user = User::create($request->validated());
        
        // Assign role if provided
        if ($request->filled('role')) {
            $role = Role::findById($request->input('role'));
            $user->assignRole($role);
        }

        return Redirect::route('users')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);
        
        return Inertia::render('Users/Edit', [
            'user' => new UserResource($user->load('roles')),
            'roles' => Role::all(),
        ]);
    }

    public function update(User $user, UserUpdateRequest $request)
    {
        $this->authorize('update', $user);
        
        $user->update(
            $request->validated()
        );

        // Sync role if provided
        if ($request->filled('role')) {
            $role = Role::findById($request->input('role'));
            $user->syncRoles($role);
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
