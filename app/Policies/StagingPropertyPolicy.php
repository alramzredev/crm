<?php

namespace App\Policies;

use App\Models\StagingProperty;
use App\Models\User;

class StagingPropertyPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('staging-properties.view');
    }

    public function view(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasPermissionTo('staging-properties.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('staging-properties.create');
    }

    public function revalidate(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasPermissionTo('staging-properties.revalidate');
    }

    public function importRow(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasPermissionTo('staging-properties.create');
    }

    public function update(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasPermissionTo('staging-properties.update');
    }

    public function delete(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasRole('super_admin') && $user->hasPermissionTo('staging-properties.delete');
    }
}
