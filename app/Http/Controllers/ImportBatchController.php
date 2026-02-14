<?php

namespace App\Http\Controllers;

use App\Models\ImportBatch;
use App\Repositories\ImportBatchRepository;
use App\Services\BulkValidationService;
use App\Services\BulkImportService;
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

    /**
     * Validate all rows in the batch
     */
    public function bulkValidate($batchId)
    {
        $batch = $this->batchRepo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        $this->authorize('retry', $batch);

        $stagingModel = $this->batchRepo->getStagingModel($batch->import_type);
        $validator = $this->getValidatorInstance($batch->import_type);
        
        $validationService = new BulkValidationService($stagingModel, $validator);
        $stats = $validationService->validateBatch($batchId);

        return Redirect::back()->with('success', "Validation complete: {$stats['valid']} valid, {$stats['errors']} errors.");
    }

    /**
     * Import all valid rows in the batch
     */
    public function bulkImport($batchId)
    {
        $batch = $this->batchRepo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        $this->authorize('retry', $batch);

        $stagingModel = $this->batchRepo->getStagingModel($batch->import_type);
        $repo = $this->batchRepo->getRepositoryInstance($batch->import_type);
        
        $importService = new BulkImportService($stagingModel, $repo);
        $stats = $importService->importBatchInChunks($batchId);

        if ($stats['failed'] > 0) {
            return Redirect::back()->with('warning', 
                "Import complete: {$stats['imported']} imported, {$stats['failed']} failed.");
        }

        return Redirect::back()->with('success', "Import complete: {$stats['imported']} rows imported successfully.");
    }

    /**
     * Bulk validation for selected rows
     */
    public function bulkValidateRows($batchId)
    {
        $batch = $this->batchRepo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        $this->authorize('retry', $batch);

        $rowIds = Request::validate(['row_ids' => 'required|array|min:1'])['row_ids'];

        $stagingModel = $this->batchRepo->getStagingModel($batch->import_type);
        $validator = $this->getValidatorInstance($batch->import_type);
        
        $validationService = new BulkValidationService($stagingModel, $validator);
        $stats = $validationService->validateRows($rowIds);

        return Redirect::back()->with('success', "Validation complete: {$stats['valid']} valid, {$stats['errors']} errors.");
    }

    /**
     * Bulk import for selected rows
     */
    public function bulkImportRows($batchId)
    {
        $batch = $this->batchRepo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        $this->authorize('retry', $batch);

        $rowIds = Request::validate(['row_ids' => 'required|array|min:1'])['row_ids'];

        $stagingModel = $this->batchRepo->getStagingModel($batch->import_type);
        $repo = $this->batchRepo->getRepositoryInstance($batch->import_type);
        
        $importService = new BulkImportService($stagingModel, $repo);
        $stats = $importService->importRows($rowIds);

        if ($stats['failed'] > 0) {
            return Redirect::back()->with('warning', 
                "Import complete: {$stats['imported']} imported, {$stats['failed']} failed.");
        }

        return Redirect::back()->with('success', "{$stats['imported']} rows imported successfully.");
    }

    /**
     * Retry failed imports
     */
    public function retryFailedImports($batchId)
    {
        $batch = $this->batchRepo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        $this->authorize('retry', $batch);

        $stagingModel = $this->batchRepo->getStagingModel($batch->import_type);
        $repo = $this->batchRepo->getRepositoryInstance($batch->import_type);
        
        $importService = new BulkImportService($stagingModel, $repo);
        $stats = $importService->retryFailedImports($batchId);

        if ($stats['failed'] > 0) {
            return Redirect::back()->with('warning', 
                "Retry complete: {$stats['imported']} imported, {$stats['failed']} failed.");
        }

        return Redirect::back()->with('success', "{$stats['imported']} rows imported successfully.");
    }

    /**
     * Clear validation errors for selected rows
     */
    public function clearErrors($batchId)
    {
        $batch = $this->batchRepo->getBatchInfo($batchId);
        if (!$batch) {
            abort(404);
        }

        $this->authorize('retry', $batch);

        $rowIds = Request::validate(['row_ids' => 'required|array|min:1'])['row_ids'];

        $stagingModel = $this->batchRepo->getStagingModel($batch->import_type);
        $validator = $this->getValidatorInstance($batch->import_type);
        
        $validationService = new BulkValidationService($stagingModel, $validator);
        $cleared = $validationService->clearErrors($rowIds);

        return Redirect::back()->with('success', "{$cleared} rows cleared and marked as valid.");
    }

    /**
     * Get validator instance based on import type
     */
    protected function getValidatorInstance($importType)
    {
        return match($importType) {
            'units' => new \App\Services\StagingUnitValidator(),
            'properties' => new \App\Services\StagingPropertyValidator(),
            'projects' => new \App\Services\StagingProjectValidator(),
            default => throw new \Exception("Invalid import type: {$importType}"),
        };
    }
}
