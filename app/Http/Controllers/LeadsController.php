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
use Illuminate\Http\Request as IlluminateRequest;

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

        $data = $this->service->getCreateData(auth()->user());
        return \Inertia\Inertia::render('Leads/Create', $data);
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

        $data = $this->service->getEditData($lead);
        // Add users for the lead's project (if any)
        $projectId = $lead->project_id;
        $data['employees'] = $projectId
            ? $this->service->getUsersByProjectAndRoles($projectId)
            : collect();

        return \Inertia\Inertia::render('Leads/Edit', $data);
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

    // Rename this endpoint for AJAX
    public function usersByProject(IlluminateRequest $request)
    {
        $projectId = $request->input('project_id');
        if (!$projectId) {
            return response()->json([]);
        }
        $users = $this->service->getUsersByProjectAndRoles($projectId);
        return response()->json($users);
    }

    public function show(Lead $lead)
    {
        $this->authorize('view', $lead);

        $lead->load(['activeAssignment.employee', 'project', 'leadSource', 'status']);
        $employees = $lead->project_id
            ? $this->service->getUsersByProjectAndRoles($lead->project_id)
            : collect();

        // Pass canAssign to frontend
        $canAssign = auth()->user()->can('assign', $lead);

        return Inertia::render('Leads/Show', [
            'lead' => $lead,
            'employees' => $employees,
            'canAssign' => $canAssign,
        ]);
    }

    public function assignEmployee(Lead $lead, IlluminateRequest $request)
    {
        $this->authorize('assign', $lead);

        $request->validate([
            'employee_id' => 'required|integer|exists:users,id',
        ]);

        $employeeId = $request->input('employee_id');
        $this->service->assignEmployee($lead, $employeeId);

        return Redirect::back()->with('success', 'Lead assigned.');
    }

    public function unassignEmployee(Lead $lead)
    {
        $this->authorize('assign', $lead);

        $this->service->unassignEmployee($lead);

        return Redirect::back()->with('success', 'Lead unassigned.');
    }
}
