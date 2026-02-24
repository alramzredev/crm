<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationConfirmed;
use App\Notifications\Reservation\ReservationConfirmedNotification;
use Illuminate\Support\Facades\Notification;

class UpdateUnitStatusAfterConfirmation
{
    public function handle(ReservationConfirmed $event)
    {
        $reservation = $event->reservation;
        if ($reservation->unit) {
            $reservation->unit->changeStatus('reserved');
        }

        // Send notification to user/customer (example, adjust as needed)
        if ($reservation->user) {
             Notification::send($reservation->user, new ReservationConfirmedNotification($reservation));
        }
    }
}
