<?php

namespace App\Http\Controllers;

use App\Models\StagingProject;
use App\Repositories\StagingProjectRepository;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;

class ImportBatchController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new StagingProjectRepository();
    }

    public function index()
    {
        $this->authorize('viewAny', StagingProject::class);

        return Inertia::render('ImportBatches/Index', [
            'batches' => $this->repo->getPaginatedBatches(Request::only('search', 'status')),
        ]);
    }

    public function show($batchId)
    {
        $this->authorize('viewAny', StagingProject::class);

        $batch = $this->repo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        return Inertia::render('ImportBatches/Show', [
            'batch' => $batch,
            'stagingProjects' => $this->repo->getPaginatedRows($batchId, Request::only('search', 'status')),
        ]);
    }

    public function retry($batchId)
    {
        $this->authorize('update', StagingProject::class);

        $failedRows = StagingProject::where('import_batch_id', $batchId)
            ->where('import_status', 'error')
            ->get();

        foreach ($failedRows as $row) {
            $row->update(['import_status' => 'valid', 'error_message' => null]);
        }

        return Redirect::back()->with('success', 'Failed rows reset for revalidation.');
    }

    public function destroy($batchId)
    {
        $this->authorize('delete', StagingProject::class);

        StagingProject::where('import_batch_id', $batchId)->delete();

        return Redirect::route('import-batches')->with('success', 'Batch deleted.');
    }
}
