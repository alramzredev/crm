<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Lead;
use App\Models\Project;
use App\Models\Property;
use App\Models\Unit;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ReservationStoreRequest;

class ReservationController extends Controller
{
    public function create()
    {
        $this->authorize('create', Reservation::class);
        
        $lead = Lead::find(Request::get('lead_id'));

        return Inertia::render('Reservations/CreateReservation', [
            'lead' => $lead,
            'projects' => Project::orderBy('name')->get(),
            'properties' => Property::orderBy('property_code')->get(),
            'units' => Unit::orderBy('unit_code')->get(),
        ]);
    }

    public function store(ReservationStoreRequest $request)
    {
        $this->authorize('create', Reservation::class);
        
        Reservation::create($request->validated());

        return Redirect::route('leads')->with('success', 'Reservation created.');
    }
}
