<?php

namespace App\Policies;

use App\Models\Contract;
use App\Models\User;

class ContractPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('contracts.view');
    }

    public function view(User $user, Contract $contract)
    {
        return $user->hasPermissionTo('contracts.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('contracts.create');
    }

    public function update(User $user, Contract $contract)
    {
        return $user->hasPermissionTo('contracts.edit');
    }

    public function delete(User $user, Contract $contract)
    {
        return $user->hasPermissionTo('contracts.delete');
    }
}
