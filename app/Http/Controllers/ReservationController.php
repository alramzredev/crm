<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Lead;
use App\Models\Customer;
  use App\Models\ReservationCancelReason;
use App\Repositories\ReservationRepository;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ReservationStoreRequest;
use App\Http\Requests\ReservationUpdateRequest;
use App\Http\Requests\ReservationApprovalRequest;
use App\Services\ReservationApprovalService;

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
            'reservations' => $this->repo->getPaginatedReservations(Auth::user(), Request::only('search', 'status')),
            'filters' => Request::all('search', 'status'),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Reservation::class);
        $leadId = (int) Request::get('lead_id');
        return Inertia::render('Reservations/CreateReservation', $this->repo->getCreateData($leadId, Auth::user()));
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


        
        $reservation = $this->repo->createReservation($validated, $leadData, $request);



        // Update unit status to Reserved (status_id = 2)
        if ($reservation->unit) {
            $reservation->unit->update(['status_id' => 2]);
        }

        return Redirect::route('reservations.edit', $reservation->id)
            ->with('success', 'Reservation created.');
 
        // return Redirect::route('reservations')->with('success', 'Reservation created.');
    }

    public function show(Reservation $reservation)
    {
        $this->authorize('view', $reservation);

        $approvalService = new ReservationApprovalService();
        $canApprove = $approvalService->canApproveReservation($reservation);

        // Fetch discount requests for this reservation
        $discountRequests = $reservation->discountRequests()->with('requester')->orderByDesc('created_at')->get();

        return Inertia::render('Reservations/Show', [
            'reservation' => $this->repo->getShowData($reservation),
            'cancelReasons' => ReservationCancelReason::active()->ordered()->get(),
            'canApprove' => $canApprove,
            'discountRequests' => $discountRequests,
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

    public function approveReservation(Reservation $reservation, ReservationApprovalRequest $request)
    {
        $this->authorize('approve', $reservation);

        $service = new ReservationApprovalService();
        $validated = $request->validated();

        try {
            $service->confirmReservation($reservation, $validated['notes'] ?? null);
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
                $reservation->unit->update(['status_id' => 1]);
            }

            return Redirect::back()->with('success', 'Reservation rejected successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }
}
