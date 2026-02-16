<?php

namespace App\Repositories;

use App\Models\Reservation;
use App\Models\ReservationDiscountRequest;
use Illuminate\Support\Facades\Auth;

class ReservationDiscountRequestRepository
{
    public function createForReservation(Reservation $reservation, array $data)
    {
        $user = Auth::user();
        $originalPrice = $reservation->base_price ?? $reservation->total_price;
        $requestedPrice = $data['requested_price'];

        $discountAmount = $originalPrice - $requestedPrice;
        $discountPercentage = $originalPrice > 0 ? round(($discountAmount / $originalPrice) * 100, 2) : 0;

        return ReservationDiscountRequest::create([
            'reservation_id' => $reservation->id,
            'requested_by' => $user->id,
            'original_price' => $originalPrice,
            'requested_price' => $requestedPrice,
            'discount_amount' => $discountAmount,
            'discount_percentage' => $discountPercentage,
            'reason' => $data['reason'],
            'status' => 'pending',
        ]);
    }

    public function updateRequest(ReservationDiscountRequest $discountRequest, array $data)
    {
        $reservation = $discountRequest->reservation;
        $approvedPrice = $data['requested_price'];
        $originalPrice = $reservation->base_price ?? $reservation->total_price;

        $discountAmount = $originalPrice - $approvedPrice;
        $discountPercentage = $originalPrice > 0 ? round(($discountAmount / $originalPrice) * 100, 2) : 0;

        $discountRequest->update([
            'requested_price' => $approvedPrice,
            'discount_amount' => $discountAmount,
            'discount_percentage' => $discountPercentage,
            'reason' => $data['reason'],
            'status' => 'pending',
            'reviewed_by' => null,
            'reviewed_at' => null,
            'rejection_reason' => null,
        ]);

        // Optionally update reservation's approved_discount_amount/percentage
        $reservation->approved_discount_amount = $discountAmount;
        $reservation->approved_discount_percentage = $discountPercentage;
        $reservation->save();

        return $discountRequest;
    }

    public function approve(ReservationDiscountRequest $discountRequest)
    {
        $reservation = $discountRequest->reservation;
        $approvedPrice = $discountRequest->requested_price;

        // Set base_price if not already set
        if (is_null($reservation->base_price)) {
            $reservation->base_price = $reservation->total_price;
        }

        $reservation->total_price = $approvedPrice;
        $reservation->approved_discount_amount = $discountRequest->discount_amount;
        $reservation->approved_discount_percentage = $discountRequest->discount_percentage;
        $reservation->remaining_amount = max(0, $approvedPrice - $reservation->down_payment);
        $reservation->save();

        $discountRequest->update([
            'status' => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return $discountRequest;
    }

    public function reject(ReservationDiscountRequest $discountRequest, string $reason)
    {
        $discountRequest->update([
            'status' => 'rejected',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);

        return $discountRequest;
    }
}
