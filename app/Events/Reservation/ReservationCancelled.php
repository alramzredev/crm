<?php

namespace App\Events\Reservation;

use App\Models\Reservation;
use App\Models\User;

class ReservationCancelled
{
    public function __construct(
        public Reservation $reservation,
        public User $user
    ) {}
}
