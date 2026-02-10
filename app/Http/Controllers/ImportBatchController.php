<?php

namespace App\Http\Controllers;

use App\Models\ImportBatch;
use App\Repositories\ImportBatchRepository;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;

class ImportBatchController extends Controller
{
    protected $batchRepo;

    public function __construct()
    {
        $this->batchRepo = new ImportBatchRepository();
    }

    public function index()
    {
        $this->authorize('viewAny', ImportBatch::class);

        return Inertia::render('ImportBatches/Index', [
            'batches' => $this->batchRepo->getPaginatedBatches(Request::only('search', 'status')),
        ]);
    }

    public function show($batchId)
    {
        $batch = $this->batchRepo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        $this->authorize('view', $batch);

        $dynamicRepo = $this->batchRepo->getRepositoryInstance($batch->import_type);

        return Inertia::render('ImportBatches/Show', [
            'batch' => $batch,
            'stagingRows' => $dynamicRepo->getPaginatedRows($batchId, Request::only('search', 'status')),
        ]);
    }

    public function retry($batchId)
    {
        $batch = $this->batchRepo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        $this->authorize('retry', $batch);

        $stagingModel = $this->batchRepo->getStagingModel($batch->import_type);
        $failedRows = $stagingModel::where('import_batch_id', $batchId)
            ->where('import_status', 'error')
            ->get();

        foreach ($failedRows as $row) {
            $row->update(['import_status' => 'valid', 'error_message' => null]);
        }

        return Redirect::back()->with('success', 'Failed rows reset for revalidation.');
    }

    public function destroy($batchId)
    {
        $batch = $this->batchRepo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        $this->authorize('delete', $batch);

        $stagingModel = $this->batchRepo->getStagingModel($batch->import_type);
        $stagingModel::where('import_batch_id', $batchId)->delete();
        $batch->delete();

        return Redirect::route('import-batches')->with('success', 'Batch deleted.');
    }
}
