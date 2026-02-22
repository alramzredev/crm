<?php

namespace App\Events\Reservation;

use App\Models\Reservation;
use App\Models\User;

class ReservationExpired
{
    public function __construct(
        public Reservation $reservation,
        public ?User $user = null
    ) {}
}
