<?php

namespace App\Imports;

use App\Models\Unit;
use App\Models\StagingUnit;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;

class UnitImport implements ToCollection, WithHeadingRow
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
        foreach ($rows as $row) {
            if (empty($row['unit_code'])) {
                continue;
            }

            // Prepare validated data from row
            $data = [
                'unit_code' => $row['unit_code'] ?? null,
                'unit_external_id' => $row['unit_external_id'] ?? null,
                'project_id' => $row['project_id'] ?? null,
                'project_name' => $row['project_name'] ?? null,
                'property_id' => $row['property_id'] ?? null,
                'property_code' => $row['property_code'] ?? null,
                'property_type_id' => $row['property_type_id'] ?? null,
                'property_type' => $row['property_type'] ?? null,
                'status_id' => $row['status_id'] ?? null,
                'status_name' => $row['status_name'] ?? null,
                'neighborhood_id' => $row['neighborhood_id'] ?? null,
                'neighborhood_name' => $row['neighborhood_name'] ?? null,
                'status_reason' => $row['status_reason'] ?? null,
                'floor' => $row['floor'] ?? null,
                'area' => $row['area'] ?? null,
                'building_surface_area' => $row['building_surface_area'] ?? null,
                'housh_area' => $row['housh_area'] ?? null,
                'rooms' => $row['rooms'] ?? null,
                'wc_number' => $row['wc_number'] ?? null,
                'price' => $row['price'] ?? null,
                'price_base' => $row['price_base'] ?? null,
                'currency' => $row['currency'] ?? 'SAR',
                'exchange_rate' => $row['exchange_rate'] ?? null,
                'model' => $row['model'] ?? null,
                'purpose' => $row['purpose'] ?? null,
                'unit_type' => $row['unit_type'] ?? null,
                'owner' => $row['owner'] ?? null,
                'instrument_no' => $row['instrument_no'] ?? null,
                'instrument_hijri_date' => $row['instrument_hijri_date'] ?? null,
                'instrument_no_after_sales' => $row['instrument_no_after_sales'] ?? null,
                'unit_description_en' => $row['unit_description_en'] ?? null,
                'national_address' => $row['national_address'] ?? null,
                'water_meter_no' => $row['water_meter_no'] ?? null,
                // Boolean features
                'has_balcony' => $this->toBool($row['has_balcony'] ?? null),
                'has_basement' => $this->toBool($row['has_basement'] ?? null),
                'has_basement_parking' => $this->toBool($row['has_basement_parking'] ?? null),
                'has_big_housh' => $this->toBool($row['has_big_housh'] ?? null),
                'has_small_housh' => $this->toBool($row['has_small_housh'] ?? null),
                'has_housh' => $this->toBool($row['has_housh'] ?? null),
                'has_big_roof' => $this->toBool($row['has_big_roof'] ?? null),
                'has_small_roof' => $this->toBool($row['has_small_roof'] ?? null),
                'has_roof' => $this->toBool($row['has_roof'] ?? null),
                'has_rooftop' => $this->toBool($row['has_rooftop'] ?? null),
                'has_pool' => $this->toBool($row['has_pool'] ?? null),
                'has_pool_view' => $this->toBool($row['has_pool_view'] ?? null),
                'has_tennis_view' => $this->toBool($row['has_tennis_view'] ?? null),
                'has_golf_view' => $this->toBool($row['has_golf_view'] ?? null),
                'has_caffe_view' => $this->toBool($row['has_caffe_view'] ?? null),
                'has_waterfall' => $this->toBool($row['has_waterfall'] ?? null),
                'has_elevator' => $this->toBool($row['has_elevator'] ?? null),
                'has_private_entrance' => $this->toBool($row['has_private_entrance'] ?? null),
                'has_two_interfaces' => $this->toBool($row['has_two_interfaces'] ?? null),
                'has_security_system' => $this->toBool($row['has_security_system'] ?? null),
                'has_internet' => $this->toBool($row['has_internet'] ?? null),
                'has_kitchen' => $this->toBool($row['has_kitchen'] ?? null),
                'has_laundry_room' => $this->toBool($row['has_laundry_room'] ?? null),
                'has_internal_store' => $this->toBool($row['has_internal_store'] ?? null),
                'has_warehouse' => $this->toBool($row['has_warehouse'] ?? null),
                'has_living_room' => $this->toBool($row['has_living_room'] ?? null),
                'has_family_lounge' => $this->toBool($row['has_family_lounge'] ?? null),
                'has_big_lounge' => $this->toBool($row['has_big_lounge'] ?? null),
                'has_food_area' => $this->toBool($row['has_food_area'] ?? null),
                'has_council' => $this->toBool($row['has_council'] ?? null),
                'has_diwaniyah' => $this->toBool($row['has_diwaniyah'] ?? null),
                'has_diwan1' => $this->toBool($row['has_diwan1'] ?? null),
                'has_mens_council' => $this->toBool($row['has_mens_council'] ?? null),
                'has_womens_council' => $this->toBool($row['has_womens_council'] ?? null),
                'has_family_council' => $this->toBool($row['has_family_council'] ?? null),
                'has_maids_room' => $this->toBool($row['has_maids_room'] ?? null),
                'has_drivers_room' => $this->toBool($row['has_drivers_room'] ?? null),
                'has_terrace' => $this->toBool($row['has_terrace'] ?? null),
                'has_outdoor' => $this->toBool($row['has_outdoor'] ?? null),
            ];

            StagingUnit::create([
                'batch_id' => $this->batchId,
                'file_name' => $this->fileName,
                'user_email' => $this->userEmail,
                'data' => $data,
                'status' => 'pending',
                'row_number' => $row->getKey() + 2,
            ]);
        }
    }

    /**
     * Convert various formats to boolean
     */
    private function toBool($value)
    {
        if ($value === null || $value === '') {
            return false;
        }
        if (is_bool($value)) {
            return $value;
        }
        if (is_numeric($value)) {
            return (bool) $value;
        }
        $lowered = strtolower((string) $value);
        return in_array($lowered, ['true', 'yes', '1', 'y', 'true'], true);
    }
}
