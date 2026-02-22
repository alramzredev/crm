<?php

namespace App\Events\Discount;

use App\Models\ReservationDiscountRequest;
use App\Models\User;

class DiscountRequested
{
    public function __construct(
        public ReservationDiscountRequest $discountRequest,
        public User $user
    ) {}
}
