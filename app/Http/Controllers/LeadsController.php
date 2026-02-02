<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadSource;
use App\Models\Project;
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
        $leads = $this->repo->getPaginatedLeads(Request::only('search', 'trashed'));

        return Inertia::render('Leads/Index', [
            'filters' => Request::all('search', 'trashed'),
            'leads' => $leads,
        ]);
    }

    public function create()
    {
        return Inertia::render('Leads/Create', [
            'leadSources' => LeadSource::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
        ]);
    }

    public function store(LeadRequest $request)
    {
        Lead::create($request->validated());

        return Redirect::route('leads')->with('success', 'Lead created.');
    }

    public function edit(Lead $lead)
    {
        return Inertia::render('Leads/Edit', [
            'lead' => $lead,
            'leadSources' => LeadSource::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
        ]);
    }

    public function update(Lead $lead, LeadRequest $request)
    {
        $lead->update($request->validated());

        return Redirect::back()->with('success', 'Lead updated.');
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();

        return Redirect::back()->with('success', 'Lead deleted.');
    }

    public function restore(Lead $lead)
    {
        $lead->restore();

        return Redirect::back()->with('success', 'Lead restored.');
    }
}
