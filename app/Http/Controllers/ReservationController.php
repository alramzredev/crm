<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Lead;
use App\Models\Project;
use App\Models\Property;
use App\Models\Unit;
use App\Repositories\ReservationRepository;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ReservationStoreRequest;

class ReservationController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new ReservationRepository();
    }

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

        $validated = $request->validated();
        
        $leadData = $request->only('first_name', 'last_name', 'email', 'phone', 'national_id');
        
        $this->repo->createReservation($validated, $leadData, $request);

        return Redirect::route('leads')->with('success', 'Reservation created.');
    }
}
