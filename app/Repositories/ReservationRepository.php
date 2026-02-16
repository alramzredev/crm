<?php

namespace App\Repositories;

use App\Models\Lead;
use App\Models\Unit;
use App\Models\Project;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Customer;
use App\Models\User;
use App\Http\Resources\ReservationResource;
use App\Http\Requests\ReservationStoreRequest;
use Illuminate\Support\Facades\Request;

class ReservationRepository
{
    public function getCreateData(int $leadId, User $user): array
    {
        $lead = Lead::findOrFail($leadId);

        // $projectsQuery = Project::orderBy('name');

        // if (!$user->hasRole('super_admin')) {
        //     $projectsQuery->whereHas('users', function ($q) use ($user) {
        //         $q->where('project_user.user_id', $user->id)
        //           ->where('project_user.is_active', true);
        //     });
        // }

        // $projects = $projectsQuery->get();

        // $projectIds = $projects->pluck('id');

        // $properties = Property::with('project')
        //     ->whereIn('project_id', $projectIds)
        //     ->orderBy('property_code')
        //     ->get();

        // $units = Unit::with(['property', 'status'])
        //     ->whereIn('project_id', $projectIds)
        //     ->where('status_id', 1)
        //     ->orderBy('unit_code')
        //     ->get();


        // $projects = [];
        // $properties = [];
        // $units = [];

        return compact('lead');
    }

    public function createReservation(array $validated, array $leadData, ReservationStoreRequest $request): Reservation
    {
        $lead = Lead::findOrFail($validated['lead_id']);
        $lead->update($leadData);

        $total = $validated['total_price'] ?? null;
        $down = $validated['down_payment'] ?? null;

        if (empty($validated['remaining_amount']) && $total !== null && $down !== null) {
            $validated['remaining_amount'] = max(0, (float) $total - (float) $down);
        }

        if ($request->hasFile('national_address_file')) {
            $validated['national_address_file'] = $request->file('national_address_file')
                ->store('reservations/national-address', 'public');
        }

        if ($request->hasFile('national_id_file')) {
            $validated['national_id_file'] = $request->file('national_id_file')
                ->store('reservations/national-id', 'public');
        }

        // Get unit and its project to calculate expiration
        $unit = Unit::with('property.project')->findOrFail($validated['unit_id']);
        $project = $unit->property?->project;
        $reservationPeriodDays = $project?->reservation_period_days ?? 30;

        $reservation = new Reservation();
        $reservation->lead_id = $validated['lead_id'];
        $reservation->unit_id = $validated['unit_id'];
        $reservation->customer_id = $validated['customer_id'];
        $reservation->status = $validated['status'] ?? 'draft';
        $reservation->started_at = now();
        $reservation->expires_at = now()->addDays($reservationPeriodDays);
        $reservation->payment_method = $validated['payment_method'] ?? null;
        $reservation->payment_plan = $validated['payment_plan'] ?? null;
        $reservation->base_price = $validated['total_price'] ?? null;
        $reservation->total_price = $validated['total_price'] ?? null;
        $reservation->down_payment = $validated['down_payment'] ?? null;
        $reservation->remaining_amount = $validated['remaining_amount'] ?? null;
        $reservation->currency = $validated['currency'] ?? 'SAR';
        $reservation->terms_accepted = $validated['terms_accepted'] ?? false;
        $reservation->privacy_accepted = $validated['privacy_accepted'] ?? false;
        $reservation->notes = $validated['notes'] ?? null;
        $reservation->created_by = auth()->id();
        $reservation->updated_by = auth()->id();
        $reservation->save();

        return $reservation;
    }

    public function getPaginatedReservations(User $user, array $filters = [])
    {
        return ReservationResource::collection(
            Reservation::with(['lead', 'unit', 'customer'])
                ->filterByUserRole($user)
                ->when(Request::get('search'), fn ($q, $search) =>
                    $q->where(function ($q2) use ($search) {
                        $q2->where('reservation_code', 'like', "%{$search}%")
                           ->orWhereHas('lead', function ($q3) use ($search) {
                               $q3->where('first_name', 'like', "%{$search}%")
                                  ->orWhere('last_name', 'like', "%{$search}%");
                           });
                    })
                )
                ->when(Request::get('status'), fn ($q, $status) =>
                    $q->where('status', $status)
                )
                ->when(Request::get('trashed'), fn ($q, $trashed) =>
                    $trashed === 'with' ? $q->withTrashed() : ($trashed === 'only' ? $q->onlyTrashed() : $q)
                )
                ->orderByDesc('created_at')
                ->paginate()
                ->appends(Request::all())
        );
    }

    public function getShowData(Reservation $reservation): ReservationResource
    {
        return new ReservationResource(
            $reservation->load(['lead', 'unit', 'customer', 'payments.receipts', 'cancelReason'])
        );
    }

    public function getEditData(Reservation $reservation): ReservationResource
    {
        return new ReservationResource(
            $reservation->load(['lead', 'unit', 'customer', 'payments.receipts', 'cancelReason'])
        );
    }
}
