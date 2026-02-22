<?php

namespace App\Services;

use App\Models\Reservation;
use App\Enums\ReservationStatus;
use Illuminate\Support\Facades\Auth;
use App\Events\Reservation\ReservationConfirmed;
use App\Events\Reservation\ReservationCancelled;

class ReservationApprovalService
{
    /**
     * Confirm a pending reservation
     */
    public function confirmReservation(Reservation $reservation, $notes = null): Reservation
    {
        if ($reservation->status !== ReservationStatus::ACTIVE) {
            throw new \Exception('Only active reservations can be confirmed.');
        }

        // Validate required customer documents
        $customer = $reservation->customer;
        if ($customer) {
            $missingDocs = $customer->documents()
                ->whereHas('documentType', function ($q) {
                    $q->where('is_required', 1);
                })
                ->where(function ($q) {
                    $q->whereNull('file_path')->orWhere('status', '!=', 'approved');
                })
                ->count();

            if ($missingDocs > 0) {
                throw new \Exception('All required customer documents must be uploaded and approved before confirming the reservation.');
            }
        }

        $reservation->update([
            'status' => ReservationStatus::CONFIRMED,
            'notes' => $notes ?? $reservation->notes,
            'updated_by' => Auth::id(),
        ]);

        event(new ReservationConfirmed($reservation, Auth::user()));

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

        event(new ReservationCancelled($reservation, Auth::user()));

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
