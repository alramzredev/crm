<?php

namespace App\Repositories;

use App\Models\StagingUnit;
use App\Models\Unit;
use App\Models\Project;
use App\Models\Property;
use App\Models\UnitStatus;
use App\Models\PropertyType;
use Illuminate\Support\Facades\Request;

class StagingUnitRepository
{
    public function getPaginatedRowsAll($filters = [])
    {
        $query = StagingUnit::query();

        if (Request::get('status') && Request::get('status') !== 'all') {
            $query->where('import_status', Request::get('status'));
        }

        if (Request::get('search')) {
            $search = Request::get('search');
            $query->where(function ($q) use ($search) {
                $q->where('unit_code', 'like', "%{$search}%")
                  ->orWhere('property_code', 'like', "%{$search}%")
                  ->orWhere('project_code', 'like', "%{$search}%");
            });
        }

        if (Request::get('batch_id')) {
            $query->where('import_batch_id', Request::get('batch_id'));
        }

        return $query->orderByDesc('id')->paginate(50)->appends(Request::all());
    }

    public function getPaginatedRows($batchId, $filters = [])
    {
        $query = StagingUnit::where('import_batch_id', $batchId);

        if (Request::get('status') && Request::get('status') !== 'all') {
            $query->where('import_status', Request::get('status'));
        }

        if (Request::get('search')) {
            $search = Request::get('search');
            $query->where(function ($q) use ($search) {
                $q->where('unit_code', 'like', "%{$search}%")
                  ->orWhere('property_code', 'like', "%{$search}%")
                  ->orWhere('project_code', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('row_number')->paginate(50)->appends(Request::all());
    }

    public function importRow(StagingUnit $row)
    {
        // Skip if unit code already exists
        $existingUnit = Unit::where('unit_code', $row->unit_code)->first();
        if ($existingUnit) {
            throw new \Exception("Unit with code '{$row->unit_code}' already exists in the system");
        }

        // Find or create unit status
        $unitStatus = UnitStatus::firstOrCreate(
            ['name' => $row->status_name]
        );

        // Find property and project by codes
        $property = Property::where('property_code', $row->property_code)->first();
        $project = Project::where('project_code', $row->project_code)->first();

        if (!$property || !$project) {
            throw new \Exception('Property or Project not found');
        }

        // Find or create property type
        $propertyType = PropertyType::query();
        if (!empty($row->property_type_name)) {
            $propertyType = $propertyType->firstOrCreate(['name' => $row->property_type_name]);
        } else {
            $propertyType = $propertyType->first();
        }

        // Create unit with all features
        Unit::create([
            'unit_code' => $row->unit_code,
            'unit_external_id' => $row->unit_external_id,
            'project_id' => $project->id,
            'property_id' => $property->id,
            'property_type_id' => $propertyType->id ?? null,
            'status_id' => $unitStatus->id,
            'status_reason' => $row->status_reason,
            'floor' => $row->floor,
            'area' => $row->area,
            'building_surface_area' => $row->building_surface_area,
            'housh_area' => $row->housh_area,
            'rooms' => $row->rooms,
            'wc_number' => $row->wc_number,
            'price' => $row->price,
            'price_base' => $row->price_base,
            'currency' => $row->currency,
            'exchange_rate' => $row->exchange_rate,
            'model' => $row->model,
            'purpose' => $row->purpose,
            'unit_type' => $row->unit_type_name,
            'instrument_no' => $row->instrument_no,
            'instrument_hijri_date' => $row->instrument_hijri_date,
            'instrument_no_after_sales' => $row->instrument_no_after_sales,
            'has_balcony' => $row->has_balcony,
            'has_basement' => $row->has_basement,
            'has_basement_parking' => $row->has_basement_parking,
            'has_big_housh' => $row->has_big_housh,
            'has_small_housh' => $row->has_small_housh,
            'has_housh' => $row->has_housh,
            'has_big_roof' => $row->has_big_roof,
            'has_small_roof' => $row->has_small_roof,
            'has_roof' => $row->has_roof,
            'has_rooftop' => $row->has_rooftop,
            'has_pool' => $row->has_pool,
            'has_pool_view' => $row->has_pool_view,
            'has_tennis_view' => $row->has_tennis_view,
            'has_golf_view' => $row->has_golf_view,
            'has_caffe_view' => $row->has_caffe_view,
            'has_waterfall' => $row->has_waterfall,
            'has_elevator' => $row->has_elevator,
            'has_private_entrance' => $row->has_private_entrance,
            'has_two_interfaces' => $row->has_two_interfaces,
            'has_security_system' => $row->has_security_system,
            'has_internet' => $row->has_internet,
            'has_kitchen' => $row->has_kitchen,
            'has_laundry_room' => $row->has_laundry_room,
            'has_internal_store' => $row->has_internal_store,
            'has_warehouse' => $row->has_warehouse,
            'has_living_room' => $row->has_living_room,
            'has_family_lounge' => $row->has_family_lounge,
            'has_big_lounge' => $row->has_big_lounge,
            'has_food_area' => $row->has_food_area,
            'has_council' => $row->has_council,
            'has_diwaniyah' => $row->has_diwaniyah,
            'has_diwan1' => $row->has_diwan1,
            'has_mens_council' => $row->has_mens_council,
            'has_womens_council' => $row->has_womens_council,
            'has_family_council' => $row->has_family_council,
            'has_maids_room' => $row->has_maids_room,
            'has_drivers_room' => $row->has_drivers_room,
            'has_terrace' => $row->has_terrace,
            'has_outdoor' => $row->has_outdoor,
            'unit_description_en' => $row->unit_description_en,
            'national_address' => $row->national_address,
            'water_meter_no' => $row->water_meter_no,
            'created_by' => auth()->id(),
            'modified_by' => auth()->id(),
        ]);
    }
}
