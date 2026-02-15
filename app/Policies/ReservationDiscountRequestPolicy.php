<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ReservationDiscountRequest;

class ReservationDiscountRequestPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasRole('super_admin') || $user->hasRole('sales_supervisor');
    }

    public function view(User $user, ReservationDiscountRequest $request)
    {
        return $user->id === $request->requested_by
            || $user->hasRole('super_admin')
            || $user->hasRole('sales_supervisor');
    }

    public function approve(User $user, ReservationDiscountRequest $request)
    {
        // Super admin can approve any
        if ($user->hasRole('super_admin') || $user->hasRole('superadmin')) {
            return true;
        }
        // Sales supervisor can approve requests for reservations created by their team
        if ($user->hasRole('sales_supervisor')) {
            $creator = $request->reservation->creator;
            return $creator && $user->id === $creator->supervisor()->first()->id;
        }
        return false;
    }
}
