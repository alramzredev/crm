<?php

namespace App\Listeners\Discount;

use App\Events\Discount\DiscountApproved;
use App\Notifications\Discount\DiscountApprovedNotification;
use Illuminate\Support\Facades\Notification;

class SendDiscountApprovedNotification
{
    public function handle(DiscountApproved $event)
    {
        $discountRequest = $event->discountRequest;
        $employee = $discountRequest->requester;

        if ($employee) {
            Notification::send($employee, new DiscountApprovedNotification($discountRequest));
        }
    }
}
