<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\ReservationDiscountRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ReservationDiscountRequestController extends Controller
{


    public function store(Request $request, Reservation $reservation)
    {
        $this->authorize('requestDiscount', $reservation);

        $request->validate([
            'requested_price' => 'required|numeric|min:0',
            'reason' => 'required|string|max:500',
        ]);

        $user = Auth::user();
        $originalPrice = $reservation->total_price;
        $requestedPrice = $request->input('requested_price');
        $discountAmount = $originalPrice - $requestedPrice;
        $discountPercentage = $originalPrice > 0 ? round(($discountAmount / $originalPrice) * 100, 2) : 0;

        ReservationDiscountRequest::create([
            'reservation_id' => $reservation->id,
            'requested_by' => $user->id,
            'original_price' => $originalPrice,
            'requested_price' => $requestedPrice,
            'discount_amount' => $discountAmount,
            'discount_percentage' => $discountPercentage,
            'reason' => $request->input('reason'),
            'status' => 'pending',
        ]);

        return Redirect::back()->with('success', 'Discount request submitted.');
    }

    

    public function approve(ReservationDiscountRequest $discountRequest)
    {
        $this->authorize('approve', $discountRequest);

        $discountRequest->update([
            'status' => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return Redirect::back()->with('success', 'Discount request approved.');
    }

    public function reject(Request $request, ReservationDiscountRequest $discountRequest)
    {
        $this->authorize('approve', $discountRequest);

        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $discountRequest->update([
            'status' => 'rejected',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'rejection_reason' => $request->input('rejection_reason'),
        ]);

        return Redirect::back()->with('success', 'Discount request rejected.');
    }
}
