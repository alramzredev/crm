<?php

namespace App\Policies;

use App\Models\Unit;
use App\Models\User;

class UnitPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('units.view');
    }

    public function view(User $user, Unit $unit)
    {
        return $user->hasPermissionTo('units.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('units.create');
    }

    public function update(User $user, Unit $unit)
    {
        return $user->hasPermissionTo('units.edit');
    }

    public function delete(User $user, Unit $unit)
    {
        return $user->hasPermissionTo('units.delete');
    }

    public function restore(User $user, Unit $unit)
    {
        return $user->hasPermissionTo('units.restore');
    }

    public function forceDelete(User $user, Unit $unit)
    {
        return $user->hasPermissionTo('units.delete');
    }
}
