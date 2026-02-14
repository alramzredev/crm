<?php

namespace App\Services;

use App\Models\Reservation;
use App\Enums\ReservationStatus;
use Illuminate\Support\Facades\Auth;

class ReservationApprovalService
{
    /**
     * Confirm a pending reservation
     */
    public function confirmReservation(Reservation $reservation, ?string $notes = null): Reservation
    {
        if ($reservation->status !== ReservationStatus::ACTIVE) {
            throw new \Exception('Only active reservations can be confirmed.');
        }

        $reservation->update([
            'status' => ReservationStatus::CONFIRMED,
            'notes' => $notes ?? $reservation->notes,
            'updated_by' => Auth::id(),
        ]);

        return $reservation;
    }

    /**
     * Reject/cancel a pending reservation
     */
    public function rejectReservation(Reservation $reservation, int $cancelReasonId, ?string $notes = null): Reservation
    {
        if ($reservation->status !== ReservationStatus::ACTIVE) {
            throw new \Exception('Only active reservations can be rejected.');
        }

        $reservation->update([
            'status' => ReservationStatus::CANCELLED,
            'cancel_reason_id' => $cancelReasonId,
            'notes' => $notes ?? $reservation->notes,
            'updated_by' => Auth::id(),
        ]);

        return $reservation;
    }

    /**
     * Check if reservation can be approved by user
     */
    public function canApproveReservation(Reservation $reservation): bool
    {
        $user = Auth::user();
        
        // Super admin can always approve
        if ($user->hasRole('super_admin') || $user->hasRole('superadmin')) {
            return true;
        }

        // Sales supervisor can approve reservations created by their team members
        if ($user->hasRole('sales_supervisor')) {
            $creator = $reservation->creator;
            return $creator && $user->id === $creator->supervisor_id;
        }

        return false;
    }
}
