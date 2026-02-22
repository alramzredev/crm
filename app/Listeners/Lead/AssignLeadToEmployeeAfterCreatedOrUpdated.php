<?php

namespace App\Listeners\Lead;

use App\Events\Lead\LeadCreated;
use App\Events\Lead\LeadUpdated;

class AssignLeadToEmployeeAfterCreatedOrUpdated
{
    public function handle($event)
    {
        // Example: assign lead to employee if needed
        // $event->lead->assignToEmployee($event->user);
    }
}
