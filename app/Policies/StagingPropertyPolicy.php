<?php

namespace App\Policies;

use App\Models\StagingProperty;
use App\Models\User;

class StagingPropertyPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('properties.import');
    }

    public function view(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasPermissionTo('properties.import');
    }

    public function revalidate(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasPermissionTo('properties.import');
    }

    public function importRow(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasPermissionTo('properties.import');
    }

    public function update(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasPermissionTo('properties.import');
    }

    public function delete(User $user, StagingProperty $stagingProperty)
    {
        return $user->hasRole('super_admin') && $user->hasPermissionTo('properties.import');
    }
}
