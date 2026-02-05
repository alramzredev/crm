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
use App\Repositories\ProjectRepository;

class ProjectsController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new ProjectRepository();
    }

    /**
     * Display paginated projects based on user visibility rules
     * 
     * ✅ Super Admin → All projects
     * ✅ Project Manager → Only assigned projects
     * ✅ Sales Supervisor → Only assigned projects
     * ✅ Sales Employee → Only assigned projects
     */
    public function index()
    {
        $this->authorize('viewAny', Project::class);

        return Inertia::render('Projects/Index', [
            'filters' => Request::all('search', 'trashed'),
            'projects' => $this->repo->getPaginatedProjects(
                Auth::user(),
                Request::only('search', 'trashed')
            ),
        ]);
    }

    /**
     * Show create project form
     */
    public function create()
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Projects/Create', $this->repo->getCreateData());
    }

    /**
     * Store new project
     */
    public function store(ProjectStoreRequest $request)
    {
        $this->authorize('create', Project::class);

        Project::create($request->validated());

        return Redirect::route('projects')->with('success', 'Project created.');
    }

    /**
     * Show edit form for project
     * Check if user has access before allowing edit
     */
    public function edit(Project $project)
    {
        $this->authorize('update', $project);

        // Additional check: Can user access this project?
        if (!$this->repo->canAccessProject(Auth::user(), $project)) {
            return Redirect::back()->with('error', 'You do not have access to this project.');
        }

        return Inertia::render('Projects/Edit', $this->repo->getEditData($project));
    }

    /**
     * Update project
     */
    public function update(Project $project, ProjectUpdateRequest $request)
    {
        $this->authorize('update', $project);

        // Additional check: Can user access this project?
        if (!$this->repo->canAccessProject(Auth::user(), $project)) {
            return Redirect::back()->with('error', 'You do not have access to this project.');
        }

        $project->update($request->validated());

        return Redirect::back()->with('success', 'Project updated.');
    }

    /**
     * Soft delete project
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        // Additional check: Can user access this project?
        if (!$this->repo->canAccessProject(Auth::user(), $project)) {
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

        if (!$this->repo->canAccessProject(Auth::user(), $project)) {
            return Redirect::back()->with('error', 'You do not have access to this project.');
        }

        return Inertia::render('Projects/Show', $this->repo->getShowResource($project));
    }
}
