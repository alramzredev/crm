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
            $reservation->unit->update(['status_id' => 2]);
        }

        // Send notification to user/customer (example, adjust as needed)
        if ($reservation->user) {
            // You should have a ReservationConfirmedNotification class
            Notification::send($reservation->user, new ReservationConfirmedNotification($reservation));
        }
    }
}
