<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\EmployeeRepository;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;

class EmployeeController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new EmployeeRepository();
    }

    /**
     * List employees supervised by the current user
     */
    public function index()
    {
        $user = Auth::user();
 
        // Only sales supervisors can access this
        if (!$user->hasRole('sales_supervisor')) {
            return Redirect::back()->with('error', 'Unauthorized access.');
        }

        return Inertia::render('Employees/Index', [
            'employees' => $this->repo->getPaginatedEmployees($user),
            'filters' => Request::all('search'),
        ]);
    }

    /**
     * Show employee details and project assignments
     */
    public function show(User $employee)
    {
        $supervisor = Auth::user();

        // Only sales supervisors can access this
        if (!$supervisor->hasRole('sales_supervisor')) {
            return Redirect::back()->with('error', 'Unauthorized access.');
        }

        // Verify the employee is supervised by this supervisor
        if (!$this->repo->isEmployeeSupervisedBy($employee, $supervisor)) {
            return Redirect::back()->with('error', 'You do not supervise this employee.');
        }

        return Inertia::render('Employees/Show', [
            'employee' => $this->repo->getEmployeeDetails($employee, $supervisor),
            'availableProjects' => $this->repo->getAvailableProjects($supervisor),
        ]);
    }

    /**
     * Assign employee to projects
     */
    public function assignProject(User $employee)
    {
        $this->authorize('assignProjects', $employee);

        $supervisor = Auth::user();

        $validated = Request::validate([
            'project_ids' => 'required|array',
            'project_ids.*' => 'exists:projects,id',
        ]);

        // Verify all projects are supervised by this supervisor
        foreach ($validated['project_ids'] as $projectId) {
            if (!$this->repo->isProjectSupervisedBy($projectId, $supervisor)) {
                return Redirect::back()->with('error', 'You do not manage one of these projects.');
            }
        }

        // Assign employee to projects
        foreach ($validated['project_ids'] as $projectId) {
            $this->repo->assignEmployeeToProject($employee, $projectId);
        }

        $count = count($validated['project_ids']);
        return Redirect::back()->with('success', "Employee assigned to {$count} project(s).");
    }

    /**
     * Remove employee from a project
     */
    public function removeProject(User $employee)
    {
        $validated = Request::validate([
            'project_id' => 'required|integer|exists:projects,id',
        ]);
        $this->authorize('removeFromProject', $employee);

        $supervisor = Auth::user();

        // Verify the project is supervised by this supervisor
        if (!$this->repo->isProjectSupervisedBy($validated['project_id'], $supervisor)) {
            return Redirect::back()->with('error', 'You do not manage this project.');
        }

        // Remove employee from project
        $this->repo->removeEmployeeFromProject($employee, $validated['project_id']);

        return Redirect::back()->with('success', 'Employee removed from project.');
    }
}
