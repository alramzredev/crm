<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('projects.view');
    }

    public function view(User $user, Project $project)
    {
        return $user->hasPermissionTo('projects.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('projects.create');
    }

    public function update(User $user, Project $project)
    {
        return $user->hasPermissionTo('projects.edit');
    }

    public function delete(User $user, Project $project)
    {
        return $user->hasPermissionTo('projects.delete');
    }

    public function restore(User $user, Project $project)
    {
        return $user->hasPermissionTo('projects.restore');
    }

    public function forceDelete(User $user, Project $project)
    {
        return $user->hasPermissionTo('projects.delete');
    }
}
