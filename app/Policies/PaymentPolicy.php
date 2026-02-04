<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function create(User $user)
    {
        return $user->hasPermissionTo('payments.create');
    }

    public function update(User $user, Payment $payment)
    {
        return $user->hasPermissionTo('payments.edit');
    }

    public function delete(User $user, Payment $payment)
    {
        return $user->hasPermissionTo('payments.delete');
    }
}
