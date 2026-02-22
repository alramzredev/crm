<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Customer;

class CustomerPolicy
{
    public function viewAny(User $user)
    {
        return $user->can('customers.view');
    }

    public function view(User $user, Customer $customer)
    {
        return $user->can('customers.view');
    }

    public function create(User $user)
    {
        return $user->can('customers.create');
    }

    public function update(User $user, Customer $customer)
    {
        return $user->can('customers.edit');
    }

    public function delete(User $user, Customer $customer)
    {
        return $user->can('customers.delete');
    }

    public function restore(User $user, Customer $customer)
    {
        return $user->can('customers.restore');
    }
}
