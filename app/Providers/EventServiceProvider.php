<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\Reservation\ReservationConfirmed;
use App\Events\Reservation\ReservationCancelled;
use App\Listeners\Reservation\UpdateUnitStatusAfterConfirmation;
use App\Listeners\Reservation\UpdateUnitStatusAfterCancellation;
use App\Events\Lead\LeadCreated;
use App\Events\Lead\LeadUpdated;
use App\Events\Lead\LeadDeleted;
use App\Listeners\Lead\NotifySalesTeamAfterLeadCreated;
use App\Listeners\Lead\AssignLeadToEmployeeAfterCreatedOrUpdated;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        ReservationConfirmed::class => [
            UpdateUnitStatusAfterConfirmation::class,
        ],
        ReservationCancelled::class => [
            UpdateUnitStatusAfterCancellation::class,
        ],
        LeadCreated::class => [
            NotifySalesTeamAfterLeadCreated::class,
            AssignLeadToEmployeeAfterCreatedOrUpdated::class,
        ],
        LeadUpdated::class => [
            AssignLeadToEmployeeAfterCreatedOrUpdated::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
