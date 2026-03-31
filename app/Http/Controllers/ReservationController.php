<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Lead;
use App\Models\Customer;
use App\Models\ReservationCancelReason;
use App\Models\DocumentType;
use App\Repositories\ReservationRepository;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ReservationStoreRequest;
use App\Http\Requests\ReservationUpdateRequest;
use App\Http\Requests\ReservationApprovalRequest;
use App\Services\ReservationApprovalService;
use App\Services\ReservationService;
use App\Events\Reservation\ReservationConfirmed;
use App\Models\ContractType;
use App\Http\Resources\ContractResource;

class ReservationController extends Controller
{
    protected $repo;
    protected $service;

    public function __construct(ReservationRepository $repo, ReservationService $service)
    {
        $this->repo = $repo;
        $this->service = $service;
    }

    public function index()
    {
        $this->authorize('viewAny', Reservation::class);

        return Inertia::render('Reservations/Index', [
            'reservations' => $this->service->getPaginatedReservations(Auth::user(), Request::only('search', 'status')),
            'filters' => Request::all('search', 'status'),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Reservation::class);
        $leadId = (int) Request::get('lead_id');
        return Inertia::render('Reservations/CreateReservation', $this->service->getCreateData($leadId, Auth::user()));
    }

    public function store(ReservationStoreRequest $request)
    {
        $this->authorize('create', Reservation::class);

        $validated = $request->validated();
        $leadData = $request->only('first_name', 'last_name', 'email', 'phone', 'national_id');

        // Move customer/lead logic to service
        $reservation = $this->service->storeReservation($validated, $leadData, $request);

        // Update unit status to Reserved (status_id = 2)
        if ($reservation->unit) {
            $reservation->unit->changeStatus('reserved');
        }

        // Redirect to reservation show page after creation
        return Redirect::route('reservations.show', $reservation->id)
            ->with('success', 'Reservation created.');
    }

    public function show(Reservation $reservation)
    {
        $this->authorize('view', $reservation);

        $showData = $this->service->getShowPageData($reservation);

        return Inertia::render('Reservations/Show', $showData);
    }

    public function edit(Reservation $reservation)
    {
        $this->authorize('update', $reservation);

        return Inertia::render('Reservations/Edit', [
            'reservation' => $this->service->getEditData($reservation),
            'paymentMethods' => \App\Models\PaymentMethod::where('is_active', 1)->get(),
            'paymentPlans' => \App\Models\PaymentPlan::where('is_active', 1)->get(),
        ]);
    }

    public function update(Reservation $reservation, ReservationUpdateRequest $request)
    {
        $this->authorize('update', $reservation);

        $this->service->updateReservation($reservation, $request->validated());

        return Redirect::route('reservations.show', $reservation->id)->with('success', 'Reservation updated.');
    }

    public function approveReservation(Reservation $reservation, ReservationApprovalRequest $request)
    {
        $this->authorize('approve', $reservation);

        $service = new ReservationApprovalService();
        $validated = $request->validated();

        try {
            $service->confirmReservation($reservation, $validated['notes'] ?? null);

            // Fire ReservationConfirmed event
 
            return Redirect::back()->with('success', 'Reservation approved successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function rejectReservation(Reservation $reservation, ReservationApprovalRequest $request)
    {
        $this->authorize('approve', $reservation);

        $service = new ReservationApprovalService();
        $validated = $request->validated();

        try {
            $service->rejectReservation(
                $reservation,
                $validated['cancel_reason_id'],
                $validated['notes'] ?? null
            );

            // Update unit status back to Available (status_id = 1)
            if ($reservation->unit) {
                $reservation->unit->changeStatus('available');
            }

            return Redirect::back()->with('success', 'Reservation rejected successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }
}
