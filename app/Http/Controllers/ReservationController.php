<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Lead;
use App\Models\Customer;
use App\Models\Project;
use App\Models\Property;
use App\Models\Unit;
use App\Repositories\ReservationRepository;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ReservationStoreRequest;
use App\Http\Requests\ReservationUpdateRequest;
 
class ReservationController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new ReservationRepository();
    }

    public function index()
    {
        $this->authorize('viewAny', Reservation::class);

        return Inertia::render('Reservations/Index', [
            'reservations' => $this->repo->getPaginatedReservations(Request::only('search', 'status')),
            'filters' => Request::all('search', 'status'),
        ]);
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
        
        $lead = Lead::findOrFail($validated['lead_id']);
        $lead->update($leadData);

        // Create or update customer with lead data
        $customer = Customer::firstOrCreate(
            ['lead_id' => $lead->id],
            [
                'first_name' => $lead->first_name,
                'last_name' => $lead->last_name,
                'email' => $lead->email,
                'phone' => $lead->phone,
            ]
        );

        // Update customer if needed
        if ($customer->wasRecentlyCreated === false) {
            $customer->update([
                'first_name' => $lead->first_name,
                'last_name' => $lead->last_name,
                'email' => $lead->email,
                'phone' => $lead->phone,
            ]);
        }

        $validated['customer_id'] = $customer?->id;
        
        $this->repo->createReservation($validated, $leadData, $request);

        return Redirect::route('reservations')->with('success', 'Reservation created.');
    }

    public function show(Reservation $reservation)
    {
        $this->authorize('view', $reservation);

        return Inertia::render('Reservations/Show', [
            'reservation' => $this->repo->getShowData($reservation),
        ]);
    }

    public function edit(Reservation $reservation)
    {
        $this->authorize('update', $reservation);

        return Inertia::render('Reservations/Edit', [
            'reservation' => $this->repo->getEditData($reservation),
        ]);
    }

    public function update(Reservation $reservation, ReservationUpdateRequest $request)
    {
        $this->authorize('update', $reservation);

        $reservation->update($request->validated());

        return Redirect::back()->with('success', 'Reservation updated.');
    }
}
