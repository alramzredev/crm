<?php

namespace App\Imports;

use App\Models\StagingProject;
use App\Models\ImportBatch;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ProjectImport implements ToCollection, WithHeadingRow
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
            'import_type' => 'projects',
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
            StagingProject::create([
                'import_batch_id' => $this->batchId,
                'row_number' => $row['row_number'] ?? ($index + 1),
                'import_status' => 'pending',
                'error_message' => null,
                'project_code' => $row['project_code'] ?? null,
                'uuid' => $row['uuid'] ?? null,
                'name' => $row['name'] ?? null,
                'reservation_period_days' => $row['reservation_period_days'] ?? null,
                'reservation_duration_days' => $row['reservation_duration_days'] ?? null,
                'owner_name' => $row['owner_name'] ?? null,
                'city_name' => $row['city_name'] ?? null,
                'neighborhood' => $row['neighborhood'] ?? null,
                'location' => $row['location'] ?? null,
                'project_type_name' => $row['project_type_name'] ?? null,
                'status_name' => $row['status_name'] ?? null,
                'status_reason' => $row['status_reason'] ?? null,
                'land_area' => $row['land_area'] ?? null,
                'built_up_area' => $row['built_up_area'] ?? null,
                'selling_space' => $row['selling_space'] ?? null,
                'sellable_area_factor' => $row['sellable_area_factor'] ?? null,
                'floor_area_ratio' => $row['floor_area_ratio'] ?? null,
                'no_of_floors' => $row['no_of_floors'] ?? null,
                'number_of_units' => $row['number_of_units'] ?? null,
                'budget' => $row['budget'] ?? null,
                'warranty' => $row['warranty'] ?? null,
                'created_by' => $this->actor,
                'updated_by' => $this->actor,
            ]);
        }

        $this->batch->markAsCompleted();
    }
}
