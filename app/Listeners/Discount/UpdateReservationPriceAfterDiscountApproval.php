<?php

namespace App\Listeners\Discount;

use App\Events\Discount\DiscountApproved;
use App\Notifications\Discount\DiscountApprovedNotification;
use Illuminate\Support\Facades\Notification;

class UpdateReservationPriceAfterDiscountApproval
{
    public function handle(DiscountApproved $event)
    {
        $discountRequest = $event->discountRequest;
        $reservation = $discountRequest->reservation;

        $reservation->update([
            'approved_discount_amount' => $discountRequest->discount_amount,
            'approved_discount_percentage' => $discountRequest->discount_percentage,
            'total_price' => $discountRequest->requested_price,
        ]);

        // Send discount approved notification
        $employee = $discountRequest->requester;
        if ($employee) {
            Notification::send($employee, new DiscountApprovedNotification($discountRequest));
        }
    }
}
