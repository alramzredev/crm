<?php

namespace App\Listeners\Reservation;

use App\Events\Reservation\ReservationConfirmed;
use App\Models\Contract;
use App\Notifications\Reservation\ReservationConfirmedNotification;
use Illuminate\Support\Facades\Notification;

class CreateContractAfterConfirmation
{
    public function handle(ReservationConfirmed $event)
    {
        $reservation = $event->reservation;
        // Only create contract if not already exists
        if (!$reservation->contract) {
            Contract::create([
                'customer_id' => $reservation->customer_id,
                'reservation_id' => $reservation->id,
                'project_id' => $reservation->unit?->project_id,
                'unit_id' => $reservation->unit_id,
                'contract_date' => now(),
                'total_price' => $reservation->total_price,
                'currency' => $reservation->currency,
                'status' => 'active',
                'created_by' => $event->user->id,
            ]);
        }

        // Send reservation confirmation notifications
        $employee = $reservation->createdBy;
        $supervisor = $employee?->supervisor;

        if ($employee) {
            Notification::send($employee, new ReservationConfirmedNotification($reservation));
        }
        if ($supervisor) {
            Notification::send($supervisor, new ReservationConfirmedNotification($reservation));
        }
    }
}
