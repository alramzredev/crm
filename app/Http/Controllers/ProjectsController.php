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
use App\Repositories\ProjectRepository;

class ProjectsController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new ProjectRepository();
    }

    public function index()
    {
        return Inertia::render('Projects/Index', [
            'filters' => Request::all('search', 'trashed'),
            'projects' => new ProjectCollection(
                $this->repo->getPaginatedProjects(Request::only('search', 'trashed'))
            ),
        ]);
    }

    public function create()
    {
        return Inertia::render('Projects/Create', $this->repo->getCreateData());
    }

    public function store(ProjectStoreRequest $request)
    {
        Project::create($request->validated());

        return Redirect::route('projects')->with('success', 'Project created.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Projects/Edit', $this->repo->getEditData($project));
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
            'project' => $this->repo->getShowResource($project),
        ]);
    }
}
