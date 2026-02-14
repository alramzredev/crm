<?php

namespace App\Services;

use App\Models\StagingUnit;
use App\Models\StagingProperty;
use App\Models\StagingProject;

class BulkValidationService
{
    protected $stagingModel;
    protected $validator;

    public function __construct($stagingModel, $validator)
    {
        $this->stagingModel = $stagingModel;
        $this->validator = $validator;
    }

    /**
     * Validate all rows in a batch (skips already imported rows)
     */
    public function validateBatch(string $batchId): array
    {
        $rows = $this->stagingModel::where('import_batch_id', $batchId)
            ->where('import_status', '!=', 'imported')
            ->get();
        
        $stats = [
            'total' => $rows->count(),
            'validated' => 0,
            'errors' => 0,
            'valid' => 0,
            'skipped' => 0,
        ];

        foreach ($rows as $row) {
            $errors = $this->validator->validate($row);
            
            $row->update([
                'import_status' => count($errors) > 0 ? 'error' : 'valid',
                'error_message' => count($errors) > 0 ? implode('; ', $errors) : null,
            ]);

            $stats['validated']++;
            if (count($errors) > 0) {
                $stats['errors']++;
            } else {
                $stats['valid']++;
            }
        }

        return $stats;
    }

    /**
     * Validate specific rows by IDs
     */
    public function validateRows(array $rowIds): array
    {
        $rows = $this->stagingModel::whereIn('id', $rowIds)->get();
        
        $stats = [
            'total' => $rows->count(),
            'validated' => 0,
            'errors' => 0,
            'valid' => 0,
        ];

        foreach ($rows as $row) {
            $errors = $this->validator->validate($row);
            
            $row->update([
                'import_status' => count($errors) > 0 ? 'error' : 'valid',
                'error_message' => count($errors) > 0 ? implode('; ', $errors) : null,
            ]);

            $stats['validated']++;
            if (count($errors) > 0) {
                $stats['errors']++;
            } else {
                $stats['valid']++;
            }
        }

        return $stats;
    }

    /**
     * Clear validation errors for rows
     */
    public function clearErrors(array $rowIds): int
    {
        return $this->stagingModel::whereIn('id', $rowIds)
            ->where('import_status', 'error')
            ->update([
                'import_status' => 'valid',
                'error_message' => null,
            ]);
    }

    /**
     * Get validation summary for a batch
     */
    public function getValidationSummary(string $batchId): array
    {
        $rows = $this->stagingModel::where('import_batch_id', $batchId)->get();
        
        return [
            'total_rows' => $rows->count(),
            'valid_rows' => $rows->where('import_status', 'valid')->count(),
            'error_rows' => $rows->where('import_status', 'error')->count(),
            'imported_rows' => $rows->where('import_status', 'imported')->count(),
            'pending_rows' => $rows->whereNotIn('import_status', ['error', 'valid', 'imported'])->count(),
        ];
    }
}
