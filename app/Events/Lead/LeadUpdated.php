<?php

namespace App\Events\Lead;

use App\Models\Lead;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadUpdated
{
    use Dispatchable, SerializesModels;

    public $lead;
    public $user;

    public function __construct(Lead $lead, $user)
    {
        $this->lead = $lead;
        $this->user = $user;
    }
}
