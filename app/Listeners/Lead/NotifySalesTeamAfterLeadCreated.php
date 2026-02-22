<?php

namespace App\Listeners\Lead;

use App\Events\Lead\LeadCreated;

class NotifySalesTeamAfterLeadCreated
{
    public function handle(LeadCreated $event)
    {
        // Example: send notification to sales team
        // Notification::send(User::role('sales_employee')->get(), new LeadCreatedNotification($event->lead));
    }
}
