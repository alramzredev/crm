<?php

namespace App\Policies;

use App\Models\StagingProject;
use App\Models\User;

class StagingProjectPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('projects.import');
    }

    public function view(User $user, StagingProject $stagingProject)
    {
        return $user->hasPermissionTo('projects.import');
    }

    public function revalidate(User $user, StagingProject $stagingProject)
    {
        return $user->hasPermissionTo('projects.import');
    }

    public function importRow(User $user, StagingProject $stagingProject)
    {
        return $user->hasPermissionTo('projects.import');
    }

    public function update(User $user, StagingProject $stagingProject)
    {
        return $user->hasPermissionTo('projects.import');
    }

    public function delete(User $user, StagingProject $stagingProject)
    {
        return $user->hasRole('super_admin') && $user->hasPermissionTo('projects.import');
    }
}
