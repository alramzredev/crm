<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationExpired;
use App\Notifications\Reservation\ReservationExpiredNotification;
use Illuminate\Support\Facades\Notification;

class ExpireReservationAfterExpiry
{
    public function handle(ReservationExpired $event)
    {
        $reservation = $event->reservation;
        // Set reservation status to expired and unit status to available
        $reservation->update(['status' => 'expired']);
        if ($reservation->unit) {
            $reservation->unit->update(['status_id' => 1]);
        }

        // Send reservation expired notification
        $employee = $reservation->createdBy;
        if ($employee) {
            Notification::send($employee, new ReservationExpiredNotification($reservation));
        }
    }
}
