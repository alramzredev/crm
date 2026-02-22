<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationCancelled;

class UpdateUnitStatusAfterCancellation
{
    public function handle(ReservationCancelled $event)
    {
        // Set unit status to Available (status_id = 1)
        $reservation = $event->reservation;
        if ($reservation->unit) {
            $reservation->unit->update(['status_id' => 1]);
        }
    }
}
