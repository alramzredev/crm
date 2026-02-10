<?php

namespace App\Imports;

use App\Models\StagingProperty;
use App\Models\ImportBatch;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PropertyImport implements ToCollection, WithHeadingRow
{
    protected $batch;

    public function __construct(
        protected string $batchId,
        protected string $fileName,
        protected string $actor
    ) {
        // Create import batch record
        $this->batch = ImportBatch::create([
            'batch_uuid' => $this->batchId,
            'import_type' => 'properties',
            'file_name' => $this->fileName,
            'status' => 'pending',
            'created_by' => auth()->id(),
        ]);
    }

    public function collection(Collection $rows)
    {
        $this->batch->update(['total_rows' => $rows->count()]);
        $this->batch->markAsProcessing();

        foreach ($rows as $index => $row) {
            if (empty($row['property_code'])) {
                continue;
            }

            StagingProperty::create([
                'import_batch_id' => $this->batchId,
                'row_number' => $index + 2,
                'import_status' => 'pending',
                'error_message' => null,
                'property_code' => $row['property_code'] ?? null,
                'property_no' => $row['property_no'] ?? null,
                'project_code' => $row['project_code'] ?? null,
                'owner_name' => $row['owner_name'] ?? null,
                'property_type_name' => $row['property_type_name'] ?? null,
                'property_class_name' => $row['property_class_name'] ?? null,
                'status_name' => $row['status_name'] ?? null,
                'city_name' => $row['city_name'] ?? null,
                'neighborhood_name' => $row['neighborhood_name'] ?? null,
                'diagram_number' => $row['diagram_number'] ?? null,
                'instrument_no' => $row['instrument_no'] ?? null,
                'license_no' => $row['license_no'] ?? null,
                'lot_no' => $row['lot_no'] ?? null,
                'total_square_meter' => $row['total_square_meter'] ?? null,
                'total_units' => $row['total_units'] ?? null,
                'count_available' => $row['count_available'] ?? null,
                'notes' => $row['notes'] ?? null,
            ]);
        }

        $this->batch->markAsCompleted();
    }
}
