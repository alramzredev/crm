<?php

namespace App\Listeners\Discount;

use App\Events\Discount\DiscountRequested;
use App\Notifications\Discount\DiscountRequestedNotification;
use Illuminate\Support\Facades\Notification;

class SendDiscountRequestedNotification
{
    public function handle(DiscountRequested $event)
    {
        $discountRequest = $event->discountRequest;
        $employee = $discountRequest->requester;
        $supervisor = $employee?->supervisor;

        if ($supervisor) {
            Notification::send($supervisor, new DiscountRequestedNotification($discountRequest));
        }
    }
}
