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
        
        $leads = $this->repo->getPaginatedLeads(Request::only('search', 'trashed'));

        return Inertia::render('Leads/Index', [
            'filters' => Request::all('search', 'trashed'),
            'leads' => $leads,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Lead::class);
        
        return Inertia::render('Leads/Create', [
            'leadSources' => LeadSource::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
            'brokers' => User::role('sales_employee')->orderByName()->get(),
        ]);
    }

    public function store(LeadRequest $request)
    {
        $this->authorize('create', Lead::class);
        
        Lead::create($request->validated());

        return Redirect::route('leads')->with('success', 'Lead created.');
    }

    public function edit(Lead $lead)
    {
        $this->authorize('update', $lead);
        
        return Inertia::render('Leads/Edit', [
            'lead' => $lead,
            'leadSources' => LeadSource::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
            'brokers' => User::role('sales_employee')->orderByName()->get(),
        ]);
    }

    public function update(Lead $lead, LeadRequest $request)
    {
        $this->authorize('update', $lead);
        
        $lead->update($request->validated());

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
