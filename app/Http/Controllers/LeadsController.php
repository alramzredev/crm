<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadSource;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Repositories\LeadRepository;
use App\Http\Requests\LeadRequest;
use App\Models\LeadAssignment;
use App\Models\LeadStatus;

class LeadsController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new LeadRepository();
    }

    public function index()
    {
        $this->authorize('viewAny', Lead::class);

        $leads = $this->repo->getPaginatedLeads(auth()->user(), Request::only('search', 'trashed'));

        return Inertia::render('Leads/Index', [
            'filters' => Request::all('search', 'trashed'),
            'leads' => $leads,
            'leadStatuses' => LeadStatus::orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Lead::class);

        return Inertia::render('Leads/Create', $this->repo->getCreateData());
    }

    public function store(LeadRequest $request)
    {
        $this->authorize('create', Lead::class);

        $data = $request->validated();
        $employeeId = $data['employee_id'] ?? null;
        unset($data['employee_id']);

        $lead = Lead::create($data);

        if ($employeeId) {
            LeadAssignment::create([
                'lead_id' => $lead->id,
                'employee_id' => $employeeId,
                'assigned_by' => auth()->id(),
                'assigned_at' => now(),
                'is_active' => true,
            ]);
        }

        return Redirect::route('leads')->with('success', 'Lead created.');
    }

    public function edit(Lead $lead)
    {
        $this->authorize('update', $lead);

        return Inertia::render('Leads/Edit', $this->repo->getEditData($lead));
    }

    public function update(Lead $lead, LeadRequest $request)
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
            LeadAssignment::create([
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

        return Redirect::back()->with('success', 'Lead updated.');
    }

    public function destroy(Lead $lead)
    {
        $this->authorize('delete', $lead);

        $lead->delete();

        return Redirect::back()->with('success', 'Lead deleted.');
    }

    public function restore(Lead $lead)
    {
        $this->authorize('restore', $lead);

        $lead->restore();

        return Redirect::back()->with('success', 'Lead restored.');
    }
}
