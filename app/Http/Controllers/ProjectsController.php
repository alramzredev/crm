<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Http\Resources\ProjectCollection;
use App\Http\Resources\ProjectResource;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Models\Owner;
use App\Models\City;
use App\Models\ProjectType;
use App\Models\ProjectOwnership;
use App\Models\ProjectStatus;
use App\Models\Country;

class ProjectsController extends Controller
{
    public function index()
    {
        return Inertia::render('Projects/Index', [
            'filters' => Request::all('search', 'trashed'),
            'projects' => new ProjectCollection(
                Project::with('owner', 'city', 'projectType', 'ownership', 'status')
                    ->orderBy('name')
                    ->filter(Request::only('search', 'trashed'))
                    ->paginate()
                    ->appends(Request::all())
            ),
        ]);
    }

    public function create()
    {
        $owners = Owner::orderBy('name')->get();
        $cities = City::orderBy('name')->get();
        $projectTypes = ProjectType::orderBy('name')->get();
        $projectOwnerships = ProjectOwnership::orderBy('name')->get();
        $projectStatuses = ProjectStatus::orderBy('name')->get();
        $countries = Country::orderBy('name')->get();

        return Inertia::render('Projects/Create', [
            'owners' => $owners,
            'cities' => $cities,
            'projectTypes' => $projectTypes,
            'projectOwnerships' => $projectOwnerships,
            'projectStatuses' => $projectStatuses,
            'countries' => $countries,
        ]);
    }

    public function store(ProjectStoreRequest $request)
    {
        Project::create($request->validated());

        return Redirect::route('projects')->with('success', 'Project created.');
    }

    public function edit(Project $project)
    {
        $owners = Owner::orderBy('name')->get();
        $cities = City::orderBy('name')->get();
        $projectTypes = ProjectType::orderBy('name')->get();
        $projectOwnerships = ProjectOwnership::orderBy('name')->get();
        $projectStatuses = ProjectStatus::orderBy('name')->get();
        $countries = Country::orderBy('name')->get();

        return Inertia::render('Projects/Edit', [
            'project' => $project->load('owner', 'city', 'projectType', 'ownership', 'status'),
            'owners' => $owners,
            'cities' => $cities,
            'projectTypes' => $projectTypes,
            'projectOwnerships' => $projectOwnerships,
            'projectStatuses' => $projectStatuses,
            'countries' => $countries,
        ]);
    }

    public function update(Project $project, ProjectUpdateRequest $request)
    {
        $project->update($request->validated());

        return Redirect::back()->with('success', 'Project updated.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return Redirect::back()->with('success', 'Project deleted.');
    }

    public function restore(Project $project)
    {
        $project->restore();

        return Redirect::back()->with('success', 'Project restored.');
    }

    public function show(Project $project)
    {
        return Inertia::render('Projects/Show', [
            'project' => $project->load('owner', 'city', 'projectType', 'ownership', 'status'),
        ]);
    }
}
