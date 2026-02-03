<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Unit;
use App\Models\Project;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function create(Request $request)
    {
        $leadId = $request->query('lead_id');
        $lead = Lead::findOrFail($leadId);
        $projects = Project::orderBy('name')->get();
        $properties = Property::with('project')->orderBy('property_code')->get();
        $units = Unit::with(['property', 'status'])->where('status_id', 1)->get();

        return Inertia::render('Reservations/CreateReservation', [
            'lead' => $lead,
            'projects' => $projects,
            'properties' => $properties,
            'units' => $units,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'national_id' => 'nullable|string',
            'national_address_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'national_id_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'unit_id' => 'required|exists:units,id',
            'payment_method' => 'required|string',
            'down_payment' => 'required|numeric|min:0',
            'payment_plan' => 'required|string',
            'terms_accepted' => 'required|accepted',
            'privacy_accepted' => 'required|accepted',
        ]);

        // Handle file uploads
        if ($request->hasFile('national_address_file')) {
            $validated['national_address_file'] = $request->file('national_address_file')
                ->store('reservations/national-address', 'public');
        }

        if ($request->hasFile('national_id_file')) {
            $validated['national_id_file'] = $request->file('national_id_file')
                ->store('reservations/national-id', 'public');
        }

        // Create reservation logic here
        // For now, just redirect back with success message
        return redirect()->route('leads')->with('success', 'Reservation created successfully.');
    }
}
