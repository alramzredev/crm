<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationCancelled;
use App\Models\UnitStatus;

class UpdateUnitStatusAfterCancellation
{
    public function handle(ReservationCancelled $event)
    {
        // Set unit status to Available (by code)
        $reservation = $event->reservation;
        if ($reservation->unit) {
            $availableStatus = UnitStatus::where('code', 'available')->first();
            if ($availableStatus) {
                $reservation->unit->update(['status_id' => $availableStatus->id]);
            }
        }
    }
}
