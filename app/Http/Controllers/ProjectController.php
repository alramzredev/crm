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

    /**
     * Display paginated projects based on user visibility rules
     * 
     * ✅ Super Admin → All projects
     * ✅ Project Admin → Only assigned projects
     * ✅ Sales Supervisor → Only assigned projects
     * ✅ Sales Employee → Only assigned projects
     */
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

    /**
     * Show create project form
     */
    public function create()
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Projects/Create', $this->service->getCreateData());
    }

    /**
     * Store new project
     */
    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $data = $request->all();
        $project = new Project();
        $project->fill($data);
        if ($request->has('name')) {
            $project->setTranslations('name', $request->input('name'));
        }
        if ($request->has('location')) {
            $project->setTranslations('location', $request->input('location'));
        }
        $project->save();

        return Redirect::route('projects')->with('success', 'Project created.');
    }

    /**
     * Show edit form for project
     * Check if user has access before allowing edit
     */
    public function edit(Project $project)
    {
        $this->authorize('update', $project);

        if (!$this->service->canAccessProject(Auth::user(), $project)) {
            return Redirect::back()->with('error', 'You do not have access to this project.');
        }

        return Inertia::render('Projects/Edit', $this->service->getEditData($project));
    }

    /**
     * Update project
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);
 
        if (!$this->service->canAccessProject(Auth::user(), $project)) {
            return Redirect::back()->with('error', 'You do not have access to this project.');
        }

        $data = $request->all();
        $project->fill($data);
        if ($request->has('name')) {
            $project->setTranslations('name', $request->input('name'));
        }
        if ($request->has('location')) {
            $project->setTranslations('location', $request->input('location'));
        }
        $project->save();

        return Redirect::back()->with('success', 'Project updated.');
    }

    /**
     * Soft delete project
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        if (!$this->service->canAccessProject(Auth::user(), $project)) {
            return Redirect::back()->with('error', 'You do not have access to this project.');
        }

        $project->delete();

        return Redirect::back()->with('success', 'Project deleted.');
    }

    /**
     * Restore soft deleted project
     */
    public function restore(Project $project)
    {
        $this->authorize('restore', $project);

        $project->restore();

        return Redirect::back()->with('success', 'Project restored.');
    }

    /**
     * Display project detail
     * Check if user has access before showing
     */
    public function show(Project $project)
    {
        $this->authorize('view', $project);

        if (!$this->service->canAccessProject(Auth::user(), $project)) {
            return Redirect::back()->with('error', 'You do not have access to this project.');
        }

        return Inertia::render('Projects/Show', $this->service->getShowResource($project));
    }
}
