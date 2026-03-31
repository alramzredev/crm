<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Services\ProjectService;
use App\Models\ProjectStatus;
use Illuminate\Http\Request;
use App\Http\Resources\ProjectStatusResource;

class ProjectController extends Controller
{
    protected $service;

    public function __construct(ProjectService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Project::class);

        return Inertia::render('Projects/Index', [
            'filters' => $request->all('search', 'trashed', 'status'),
            'projects' => $this->service->getPaginatedProjects(
                Auth::user(),
                $request->only('search', 'trashed', 'status')
            ),
            'projectStatuses' => ProjectStatusResource::collection(ProjectStatus::orderBy('name')->get()),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Projects/Create', $this->service->getCreateData());
    }

    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $project = $this->service->storeProject($request->all());

        return Redirect::route('projects')->with('success', 'Project created.');
    }

    public function edit(Project $project)
    {
        $this->authorize('update', $project);
        return Inertia::render('Projects/Edit', $this->service->getEditData($project));
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $this->service->updateProject($project, $request->all());

        return Redirect::route('projects.show', $project->id)->with('success', 'Project updated.');
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $this->service->deleteProject($project);

        return Redirect::back()->with('success', 'Project deleted.');
    }

    public function restore(Project $project)
    {
        $this->authorize('restore', $project);

        $this->service->restoreProject($project);

        return Redirect::back()->with('success', 'Project restored.');
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);
        return Inertia::render('Projects/Show', $this->service->getShowResource($project));
    }
}
