<?php

namespace App\Http\Controllers;

use App\Models\StagingProject;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use App\Repositories\StagingProjectRepository;
use App\Services\StagingProjectValidator;

class StagingProjectController extends Controller
{
    protected $repo;
    protected $validator;

    public function __construct()
    {
        $this->repo = new StagingProjectRepository();
        $this->validator = new StagingProjectValidator();
    }

    public function index()
    {
        $this->authorize('viewAny', StagingProject::class);

        return Inertia::render('StagingProjects/Index', [
            'stagingProjects' => $this->repo->getPaginatedRowsAll(Request::only('search', 'status', 'batch_id')),
            'filters' => Request::all('search', 'status', 'batch_id'),
        ]);
    }

    public function show($batchId)
    {
        $this->authorize('view', StagingProject::class);

        $batch = $this->repo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        return Inertia::render('StagingProjects/Show', [
            'batch' => $batch,
            'stagingProjects' => $this->repo->getPaginatedRows($batchId, Request::only('search', 'status')),
        ]);
    }

    public function update($rowId)
    {
        $stagingProject = StagingProject::findOrFail($rowId);
        
        $this->authorize('update', $stagingProject);

        $validated = Request::validate([
            'project_code' => ['nullable', 'string', 'max:100'],
            'name' => ['nullable', 'string', 'max:255'],
            'owner_name' => ['nullable', 'string', 'max:255'],
            'city_name' => ['nullable', 'string', 'max:150'],
            'neighborhood' => ['nullable', 'string', 'max:255'],
            'project_type_name' => ['nullable', 'string', 'max:150'],
            'status_name' => ['nullable', 'string', 'max:100'],
            'reservation_period_days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ]);

        $stagingProject->update($validated);

        // Revalidate after update
        $errors = $this->validator->validate($stagingProject);
        $stagingProject->update([
            'import_status' => count($errors) > 0 ? 'error' : 'valid',
            'error_message' => count($errors) > 0 ? implode('; ', $errors) : null,
        ]);

        return Redirect::back()->with('success', 'Row updated and revalidated.');
    }

    public function revalidate($rowId)
    {
        $stagingProject = StagingProject::findOrFail($rowId);
         
        $this->authorize('revalidate', $stagingProject);

        $errors = $this->validator->validate($stagingProject);

        $stagingProject->update([
            'import_status' => count($errors) > 0 ? 'error' : 'valid',
            'error_message' => count($errors) > 0 ? implode('; ', $errors) : null,
        ]);

        return Redirect::back()->with('success', 'Row revalidated.');
    }

    public function importRow($rowId)
    {
        $stagingProject = StagingProject::findOrFail($rowId);
        
        $this->authorize('importRow', $stagingProject);

        if ($stagingProject->import_status !== 'valid') {
            return Redirect::back()->with('error', 'Only valid rows can be imported.');
        }

        try {
            $this->repo->importRow($stagingProject);
            $stagingProject->update(['import_status' => 'imported']);

            return Redirect::back()->with('success', 'Row imported successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Import failed: ' . $e->getMessage());
        }
    }

    public function retry($batchId)
    {
        $this->authorize('update', StagingProject::class);

        $failedRows = StagingProject::where('import_batch_id', $batchId)
            ->where('import_status', 'error')
            ->get();

        foreach ($failedRows as $row) {
            $errors = $this->validator->validate($row);
            $row->update([
                'import_status' => count($errors) > 0 ? 'error' : 'valid',
                'error_message' => count($errors) > 0 ? implode('; ', $errors) : null,
            ]);
        }

        return Redirect::back()->with('success', 'Failed rows revalidated.');
    }

    public function destroy($batchId)
    {
        $this->authorize('delete', StagingProject::class);

        StagingProject::where('import_batch_id', $batchId)->delete();

        return Redirect::route('staging-projects')->with('success', 'Batch deleted.');
    }
}
