<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Country;

class CountryPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('countries.view');
    }

    public function view(User $user, Country $country)
    {
        return $user->hasPermissionTo('countries.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('countries.create');
    }

    public function update(User $user, Country $country)
    {
        return $user->hasPermissionTo('countries.edit');
    }

    public function delete(User $user, Country $country)
    {
        return $user->hasPermissionTo('countries.delete');
    }

    public function restore(User $user, Country $country)
    {
        return $user->hasPermissionTo('countries.restore');
    }

    public function forceDelete(User $user, Country $country)
    {
        return $user->hasPermissionTo('countries.delete');
    }
}
