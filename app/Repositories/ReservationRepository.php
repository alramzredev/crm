<?php

namespace App\Repositories;

use App\Models\Lead;
use App\Models\Unit;
use App\Models\Project;
use App\Models\Property;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationRepository
{
    public function getCreateData(int $leadId): array
    {
        $lead = Lead::findOrFail($leadId);
        $projects = Project::orderBy('name')->get();
        $properties = Property::with('project')->orderBy('property_code')->get();
        $units = Unit::with(['property', 'status'])->where('status_id', 1)->get();

        return compact('lead', 'projects', 'properties', 'units');
    }

    public function createReservation(array $validated, array $leadData, Request $request): Reservation
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

        $reservation = new Reservation();
        $reservation->lead_id = $validated['lead_id'];
        $reservation->unit_id = $validated['unit_id'];
        $reservation->status = $validated['status'] ?? 'draft';
        $reservation->payment_method = $validated['payment_method'] ?? null;
        $reservation->payment_plan = $validated['payment_plan'] ?? null;
        $reservation->total_price = $validated['total_price'] ?? null;
        $reservation->down_payment = $validated['down_payment'] ?? null;
        $reservation->remaining_amount = $validated['remaining_amount'] ?? null;
        $reservation->currency = $validated['currency'] ?? 'SAR';
        $reservation->terms_accepted = $validated['terms_accepted'];
        $reservation->privacy_accepted = $validated['privacy_accepted'];
        $reservation->notes = $validated['notes'] ?? null;
        $reservation->created_by = auth()->id();
        $reservation->updated_by = auth()->id();
        $reservation->save();

        return $reservation;
    }
}
