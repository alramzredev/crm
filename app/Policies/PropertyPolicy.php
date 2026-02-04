<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('properties.view');
    }

    public function view(User $user, Property $property)
    {
        return $user->hasPermissionTo('properties.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('properties.create');
    }

    public function update(User $user, Property $property)
    {
        return $user->hasPermissionTo('properties.edit');
    }

    public function delete(User $user, Property $property)
    {
        return $user->hasPermissionTo('properties.delete');
    }

    public function restore(User $user, Property $property)
    {
        return $user->hasPermissionTo('properties.restore');
    }

    public function forceDelete(User $user, Property $property)
    {
        return $user->hasPermissionTo('properties.delete');
    }
}
