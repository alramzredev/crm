<?php

namespace App\Imports;

use App\Models\Property;
use App\Models\StagingProperty;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;

class PropertyImport implements ToCollection, WithHeadingRow
{
    protected $batchId;
    protected $fileName;
    protected $userEmail;

    public function __construct($batchId, $fileName, $userEmail)
    {
        $this->batchId = $batchId;
        $this->fileName = $fileName;
        $this->userEmail = $userEmail;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            if (empty($row['property_code'])) {
                continue;
            }

            // Prepare validated data from row
            $data = [
                'property_code' => $row['property_code'] ?? null,
                'property_no' => $row['property_no'] ?? null,
                'project_id' => $row['project_id'] ?? null,
                'project_name' => $row['project_name'] ?? null,
                'owner_id' => $row['owner_id'] ?? null,
                'owner_name' => $row['owner_name'] ?? null,
                'city_id' => $row['city_id'] ?? null,
                'city_name' => $row['city_name'] ?? null,
                'municipality_id' => $row['municipality_id'] ?? null,
                'municipality_name' => $row['municipality_name'] ?? null,
                'neighborhood_id' => $row['neighborhood_id'] ?? null,
                'neighborhood_name' => $row['neighborhood_name'] ?? null,
                'status_id' => $row['status_id'] ?? null,
                'status_name' => $row['status_name'] ?? null,
                'property_type_id' => $row['property_type_id'] ?? null,
                'property_type_name' => $row['property_type_name'] ?? null,
                'property_class_id' => $row['property_class_id'] ?? null,
                'property_class_name' => $row['property_class_name'] ?? null,
                'diagram_number' => $row['diagram_number'] ?? null,
                'instrument_no' => $row['instrument_no'] ?? null,
                'license_no' => $row['license_no'] ?? null,
                'lot_no' => $row['lot_no'] ?? null,
                'total_square_meter' => $row['total_square_meter'] ?? null,
                'total_units' => $row['total_units'] ?? null,
                'count_available' => $row['count_available'] ?? null,
                'notes' => $row['notes'] ?? null,
            ];

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
    }
}
