<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserDeleteRequest;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    protected $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('Users/Index', [
            'filters' => Request::all('search', 'role', 'trashed'),
            'users' => $this->service->getAll(Request::only('search', 'role', 'trashed')),
            'availableRoles' => $this->service->getAvailableRoles(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        return Inertia::render('Users/Create', $this->service->getCreateData());
    }

    public function store(UserStoreRequest $request)
    {
        $this->authorize('create', User::class);

        $this->service->create($request);
        return Redirect::route('users')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);

        $data = $this->service->getEditData($user);

        return Inertia::render('Users/Edit', [
            'user' => $data['user'],
            'roles' => $data['roles'],
            'supervisors' => $data['supervisors'],
            'projects' => $data['projects'],
        ]);
    }

    public function update(User $user, UserUpdateRequest $request)
    {
        $this->authorize('update', $user);

        $this->service->update($user, $request);
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
