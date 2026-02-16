<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\ReservationDiscountRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Repositories\ReservationDiscountRequestRepository;

class ReservationDiscountRequestController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new ReservationDiscountRequestRepository();
    }

    public function store(Request $request, Reservation $reservation)
    {
        $this->authorize('requestDiscount', $reservation);

        $request->validate([
            'requested_price' => 'required|numeric|min:0',
            'reason' => 'required|string|max:500',
        ]);

        $requestedPrice = $request->input('requested_price');
        $originalPrice = $reservation->base_price ?? $reservation->total_price;

        if ($requestedPrice > $originalPrice) {
            return Redirect::back()->with('error', 'Requested price cannot exceed the original price.');
        }

        $this->repo->createForReservation($reservation, $request->only(['requested_price', 'reason']));

        return Redirect::back()->with('success', 'Discount request submitted.');
    }

    public function approve(ReservationDiscountRequest $discountRequest)
    {
        $this->authorize('approve', $discountRequest);

        $reservation = $discountRequest->reservation;
        $approvedPrice = $discountRequest->requested_price;
        $originalPrice = $reservation->base_price ?? $reservation->total_price;

        if (!is_numeric($approvedPrice) || $approvedPrice < 0) {
            return Redirect::back()->with('error', 'Approved price must be a valid positive number.');
        }
        if ($approvedPrice > $originalPrice) {
            return Redirect::back()->with('error', 'Approved price cannot exceed the original price.');
        }
        if ($reservation->down_payment > $approvedPrice) {
            return Redirect::back()->with('error', 'Down payment exceeds the approved discounted price. Please adjust the down payment before approving.');
        }

        $this->repo->approve($discountRequest);

        return Redirect::back()->with('success', 'Discount request approved.');
    }

    public function reject(Request $request, ReservationDiscountRequest $discountRequest)
    {
        $this->authorize('approve', $discountRequest);

        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $this->repo->reject($discountRequest, $request->input('rejection_reason'));

        return Redirect::back()->with('success', 'Discount request rejected.');
    }

    public function update(Request $request, ReservationDiscountRequest $discountRequest)
    {
        $this->authorize('update', $discountRequest);

        $request->validate([
            'requested_price' => 'required|numeric|min:0',
            'reason' => 'required|string|max:500',
        ]);

        $reservation = $discountRequest->reservation;
        $approvedPrice = $request->input('requested_price');
        $originalPrice = $reservation->base_price ?? $reservation->total_price;

        if (!is_numeric($approvedPrice) || $approvedPrice < 0) {
            return Redirect::back()->with('error', 'Approved price must be a valid positive number.');
        }
        if ($approvedPrice > $originalPrice) {
            return Redirect::back()->with('error', 'Approved price cannot exceed the original price.');
        }
        if ($reservation->down_payment > $approvedPrice) {
            return Redirect::back()->with('error', 'Down payment exceeds the approved discounted price. Please adjust the down payment before updating.');
        }

        $this->repo->updateRequest($discountRequest, $request->only(['requested_price', 'reason']));

        return Redirect::back()->with('success', 'Discount request updated.');
    }
}
