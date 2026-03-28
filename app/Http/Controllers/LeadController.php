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
use App\Http\Requests\LeadRequest;
use App\Http\Resources\LeadStatusResource;

class LeadController extends Controller
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
            'leadStatuses' => LeadStatusResource::collection(LeadStatus::all()),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Lead::class);

        $data = $this->service->getCreateData(auth()->user());
        return \Inertia\Inertia::render('Leads/Create', $data);
    }

    public function store(LeadRequest $request)
    {
        $this->authorize('create', Lead::class);

        $data = $request->validated();
        
        $lead = \App\Models\Lead::create($data);

        return Redirect::route('leads.show', $lead)->with('success', 'Lead created.');
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

    public function update(Lead $lead, LeadRequest $request)
    {
        $this->authorize('update', $lead);

        $data = $request->validated();

        $lead->update($data);

        return Redirect::route('leads.show', $lead)->with('success', 'Lead updated.');
    }

    public function destroy(Lead $lead)
    {
        $this->authorize('delete', $lead);

        $lead->delete();

        return redirect()->back()->with('success', 'Lead deleted.');
    }

    public function restore(Lead $lead)
    {
        $this->authorize('restore', $lead);

        $lead->restore();

        return redirect()->back()->with('success', 'Lead restored.');
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
            'lead' => new \App\Http\Resources\LeadResource($lead),
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
