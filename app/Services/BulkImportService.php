<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Exception;

class BulkImportService
{
    protected $stagingModel;
    protected $repository;

    public function __construct($stagingModel, $repository)
    {
        $this->stagingModel = $stagingModel;
        $this->repository = $repository;
    }

    /**
     * Import all valid rows from a batch
     */
    public function importBatch(string $batchId): array
    {
        $rows = $this->stagingModel::where('import_batch_id', $batchId)
            ->where('import_status', 'valid')
            ->get();

        $stats = [
            'total' => $rows->count(),
            'imported' => 0,
            'failed' => 0,
            'skipped' => 0,
            'errors' => [],
        ];

        foreach ($rows as $row) {
            try {
                $this->repository->importRow($row);
                $row->update(['import_status' => 'imported']);
                $stats['imported']++;
            } catch (Exception $e) {
                $stats['failed']++;
                $stats['errors'][] = [
                    'row_id' => $row->id,
                    'row_number' => $row->row_number,
                    'error' => $e->getMessage(),
                ];
                $row->update([
                    'import_status' => 'error',
                    'error_message' => 'Import failed: ' . $e->getMessage(),
                ]);
            }
        }

        return $stats;
    }

    /**
     * Import specific rows by IDs
     */
    public function importRows(array $rowIds): array
    {
        $rows = $this->stagingModel::whereIn('id', $rowIds)
            ->where('import_status', 'valid')
            ->get();

        $stats = [
            'total' => $rows->count(),
            'imported' => 0,
            'failed' => 0,
            'skipped' => 0,
            'errors' => [],
        ];

        foreach ($rows as $row) {
            try {
                $this->repository->importRow($row);
                $row->update(['import_status' => 'imported']);
                $stats['imported']++;
            } catch (Exception $e) {
                $stats['failed']++;
                $stats['errors'][] = [
                    'row_id' => $row->id,
                    'row_number' => $row->row_number,
                    'error' => $e->getMessage(),
                ];
                $row->update([
                    'import_status' => 'error',
                    'error_message' => 'Import failed: ' . $e->getMessage(),
                ]);
            }
        }

        return $stats;
    }

    /**
     * Import batch in chunks to prevent memory issues
     */
    public function importBatchInChunks(string $batchId, int $chunkSize = 50): array
    {
        $stats = [
            'total' => 0,
            'imported' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        $this->stagingModel::where('import_batch_id', $batchId)
            ->where('import_status', 'valid')
            ->chunk($chunkSize, function ($rows) use (&$stats) {
                foreach ($rows as $row) {
                    try {
                        $this->repository->importRow($row);
                        $row->update(['import_status' => 'imported']);
                        $stats['imported']++;
                    } catch (Exception $e) {
                        $stats['failed']++;
                        $stats['errors'][] = [
                            'row_id' => $row->id,
                            'row_number' => $row->row_number,
                            'error' => $e->getMessage(),
                        ];
                        $row->update([
                            'import_status' => 'error',
                            'error_message' => 'Import failed: ' . $e->getMessage(),
                        ]);
                    }
                    $stats['total']++;
                }
            });

        return $stats;
    }

    /**
     * Get import statistics for a batch
     */
    public function getImportStatistics(string $batchId): array
    {
        $rows = $this->stagingModel::where('import_batch_id', $batchId)->get();
        
        return [
            'total_rows' => $rows->count(),
            'imported_rows' => $rows->where('import_status', 'imported')->count(),
            'valid_rows' => $rows->where('import_status', 'valid')->count(),
            'error_rows' => $rows->where('import_status', 'error')->count(),
            'success_rate' => $rows->count() > 0 
                ? round(($rows->where('import_status', 'imported')->count() / $rows->count()) * 100, 2) 
                : 0,
        ];
    }

    /**
     * Retry failed imports
     */
    public function retryFailedImports(string $batchId): array
    {
        $rows = $this->stagingModel::where('import_batch_id', $batchId)
            ->where('import_status', 'error')
            ->get();

        $stats = [
            'total' => $rows->count(),
            'imported' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        foreach ($rows as $row) {
            try {
                $this->repository->importRow($row);
                $row->update(['import_status' => 'imported']);
                $stats['imported']++;
            } catch (Exception $e) {
                $stats['failed']++;
                $stats['errors'][] = [
                    'row_id' => $row->id,
                    'row_number' => $row->row_number,
                    'error' => $e->getMessage(),
                ];
                $row->update([
                    'error_message' => 'Retry failed: ' . $e->getMessage(),
                ]);
            }
        }

        return $stats;
    }
}
