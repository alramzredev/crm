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
        if(!$user->hasPermissionTo('projects.edit')) {
            return false;
        }
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

        return false;
    }

    public function delete(User $user, Project $project)
    {
        if(!$user->hasPermissionTo('projects.delete')) {
            return false;
        }

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

         return false;


    }

    public function restore(User $user, Project $project)
    {
        return $user->hasPermissionTo('projects.restore');
    }

    public function forceDelete(User $user, Project $project)
    {
        return $user->hasPermissionTo('projects.delete');
    }

    public function import(User $user)
    {
        return $user->hasPermissionTo('projects.import');
    }
}
