<?php

namespace App\Policies;

use App\Models\Owner;
use App\Models\User;

class OwnerPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('owners.view');
    }

    public function view(User $user, Owner $owner)
    {
        return $user->hasPermissionTo('owners.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('owners.create');
    }

    public function update(User $user, Owner $owner)
    {
        return $user->hasPermissionTo('owners.edit');
    }

    public function delete(User $user, Owner $owner)
    {
        return $user->hasPermissionTo('owners.delete');
    }

    public function restore(User $user, Owner $owner)
    {
        return $user->hasPermissionTo('owners.restore');
    }

    public function forceDelete(User $user, Owner $owner)
    {
        return $user->hasPermissionTo('owners.delete');
    }
}
