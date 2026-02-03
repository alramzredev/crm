<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Unit;
use App\Models\Project;
use App\Models\Property;
use App\Http\Requests\ReservationStoreRequest;
use App\Repositories\ReservationRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    protected ReservationRepository $repo;

    public function __construct()
    {
        $this->repo = new ReservationRepository();
    }

    public function create(Request $request)
    {
        $leadId = (int) $request->query('lead_id');

        return Inertia::render('Reservations/CreateReservation', $this->repo->getCreateData($leadId));
    }

    public function store(ReservationStoreRequest $request)
    {
        $validated = $request->validated();

        $leadData = $request->validate([
            'first_name' => ['required', 'string', 'max:25'],
            'last_name' => ['required', 'string', 'max:25'],
            'email' => ['nullable', 'email', 'max:50'],
            'phone' => ['nullable', 'string', 'max:50'],
            'national_id' => ['nullable', 'string', 'max:255'],
        ]);

        $this->repo->createReservation($validated, $leadData, $request);

        return redirect()->route('leads')->with('success', 'Reservation created successfully.');
    }
}
