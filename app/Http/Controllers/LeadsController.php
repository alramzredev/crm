<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadSource;
use App\Models\LeadStatus;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Services\LeadService;

class LeadsController extends Controller
{
    protected $service;

    public function __construct(LeadService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $this->authorize('viewAny', Lead::class);

        $leads = $this->service->getPaginatedLeads(auth()->user(), Request::only('status', 'search', 'trashed'));

        return \Inertia\Inertia::render('Leads/Index', [
            'filters' => Request::all('status','search', 'trashed'),
            'leads' => $leads,
            'leadStatuses' => LeadStatus::orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Lead::class);

        return \Inertia\Inertia::render('Leads/Create', $this->service->getCreateData(auth()->user()));
    }

    public function store(\App\Http\Requests\LeadRequest $request)
    {
        $this->authorize('create', Lead::class);

        $data = $request->validated();
        $employeeId = $data['employee_id'] ?? null;
        unset($data['employee_id']);

        $lead = \App\Models\Lead::create($data);

        if ($employeeId) {
            \App\Models\LeadAssignment::create([
                'lead_id' => $lead->id,
                'employee_id' => $employeeId,
                'assigned_by' => auth()->id(),
                'assigned_at' => now(),
                'is_active' => true,
            ]);
        }

        return \Illuminate\Support\Facades\Redirect::route('leads')->with('success', 'Lead created.');
    }

    public function edit(Lead $lead)
    {
        $this->authorize('update', $lead);

        return \Inertia\Inertia::render('Leads/Edit', $this->service->getEditData($lead));
    }

    public function update(Lead $lead, \App\Http\Requests\LeadRequest $request)
    {
        $this->authorize('update', $lead);

        $data = $request->validated();
        $employeeId = $data['employee_id'] ?? null;
        unset($data['employee_id']);

        $lead->update($data);

        $current = $lead->activeAssignment()->first();
        if ($current && (int) $current->employee_id !== (int) $employeeId) {
            $current->update([
                'is_active' => false,
                'unassigned_at' => now(),
            ]);
        }
        if ($employeeId && (!$current || (int) $current->employee_id !== (int) $employeeId)) {
            \App\Models\LeadAssignment::create([
                'lead_id' => $lead->id,
                'employee_id' => $employeeId,
                'assigned_by' => auth()->id(),
                'assigned_at' => now(),
                'is_active' => true,
            ]);
        }
        if (!$employeeId && $current) {
            $current->update([
                'is_active' => false,
                'unassigned_at' => now(),
            ]);
        }

        return \Illuminate\Support\Facades\Redirect::back()->with('success', 'Lead updated.');
    }

    public function destroy(Lead $lead)
    {
        $this->authorize('delete', $lead);

        $lead->delete();

        return \Illuminate\Support\Facades\Redirect::back()->with('success', 'Lead deleted.');
    }

    public function restore(Lead $lead)
    {
        $this->authorize('restore', $lead);

        $lead->restore();

        return \Illuminate\Support\Facades\Redirect::back()->with('success', 'Lead restored.');
    }
}
