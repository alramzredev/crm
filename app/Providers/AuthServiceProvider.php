<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Project;
use App\Models\Property;
use App\Models\Unit;
use App\Models\Lead;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Owner;
use App\Policies\ProjectPolicy;
use App\Policies\PropertyPolicy;
use App\Policies\UnitPolicy;
use App\Policies\LeadPolicy;
use App\Policies\ReservationPolicy;
use App\Policies\UserPolicy;
use App\Policies\OwnerPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Project::class => ProjectPolicy::class,
        Property::class => PropertyPolicy::class,
        Unit::class => UnitPolicy::class,
        Lead::class => LeadPolicy::class,
        Reservation::class => ReservationPolicy::class,
        User::class => UserPolicy::class,
        Owner::class => OwnerPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
