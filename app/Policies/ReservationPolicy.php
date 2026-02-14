<?php

namespace App\Policies;

use App\Models\Reservation;
use App\Models\User;

class ReservationPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('reservations.view');
    }

    public function view(User $user, Reservation $reservation)
    {
        return $user->hasPermissionTo('reservations.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('reservations.create');
    }

    public function update(User $user, Reservation $reservation)
    {
        return $user->hasPermissionTo('reservations.edit');
    }

    public function delete(User $user, Reservation $reservation)
    {
        return $user->hasPermissionTo('reservations.delete');
    }

    public function restore(User $user, Reservation $reservation)
    {
        return $user->hasPermissionTo('reservations.restore');
    }

    public function forceDelete(User $user, Reservation $reservation)
    {
        return $user->hasPermissionTo('reservations.delete');
    }

    public function approve(User $user, Reservation $reservation)
    {
        // Super admin can always approve
        if ($user->hasRole('super_admin') || $user->hasRole('superadmin')) {
            return true;
        }

        // Sales supervisor can approve reservations from their team
        if ($user->hasRole('sales_supervisor')) {
            $creator = $reservation->creator;
            return $creator && $user->id === $creator->supervisor_id;
        }

        return false;
    }
}
