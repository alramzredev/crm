<?php

namespace App\Events\Lead;

use App\Models\Lead;
use App\Models\User;

class LeadConvertedToReservation
{
    public function __construct(
        public Lead $lead,
        public User $user
    ) {}
}
