<?php

namespace App\Repositories;

use App\Models\StagingProperty;
use App\Models\Property;
use App\Models\Owner;
use App\Models\City;
use App\Models\PropertyType;
use App\Models\PropertyStatus;
use App\Models\PropertyClass;
use App\Models\Project;
use Illuminate\Support\Facades\Request;

class StagingPropertyRepository
{
    public function getPaginatedRowsAll($filters = [])
    {
        $query = StagingProperty::query();

        if (Request::get('status') && Request::get('status') !== 'all') {
            $query->where('import_status', Request::get('status'));
        }

        if (Request::get('search')) {
            $search = Request::get('search');
            $query->where(function ($q) use ($search) {
                $q->where('property_code', 'like', "%{$search}%")
                  ->orWhere('project_code', 'like', "%{$search}%")
                  ->orWhere('owner_name', 'like', "%{$search}%");
            });
        }

        if (Request::get('batch_id')) {
            $query->where('import_batch_id', Request::get('batch_id'));
        }

        return $query->orderByDesc('id')->paginate(50)->appends(Request::all());
    }

    public function getPaginatedRows($batchId, $filters = [])
    {
        $query = StagingProperty::where('import_batch_id', $batchId);

        if (Request::get('status') && Request::get('status') !== 'all') {
            $query->where('import_status', Request::get('status'));
        }

        if (Request::get('search')) {
            $search = Request::get('search');
            $query->where(function ($q) use ($search) {
                $q->where('property_code', 'like', "%{$search}%")
                  ->orWhere('project_code', 'like', "%{$search}%")
                  ->orWhere('owner_name', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('row_number')->paginate(50)->appends(Request::all());
    }

    public function importRow(StagingProperty $row)
    {
        // Find project by code
        $project = Project::where('project_code', $row->project_code)->first();
        if (!$project) {
            throw new \Exception("Project with code '{$row->project_code}' not found");
        }

        // Find or create owner
        $owner = Owner::firstOrCreate(
            ['name' => $row->owner_name]
        );

        // Find or create city
        $city = City::firstOrCreate(
            ['name' => $row->city_name],
            ['code' => strtoupper(str_replace(' ', '_', $row->city_name))]
        );

        // Find or create property type
        $propertyType = PropertyType::firstOrCreate(
            ['name' => $row->property_type_name]
        );

        // Find or create property class
        $propertyClass = PropertyClass::firstOrCreate(
            ['name' => $row->property_class_name]
        );

        // Find or create property status
        $propertyStatus = PropertyStatus::firstOrCreate(
            ['name' => $row->status_name]
        );

        // Create property with project_id
        Property::create([
            'property_code' => $row->property_code,
            'property_no' => $row->property_no,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'city_id' => $city->id,
            'property_type_id' => $propertyType->id,
            'property_class_id' => $propertyClass->id,
            'status_id' => $propertyStatus->id,
            'diagram_number' => $row->diagram_number,
            'instrument_no' => $row->instrument_no,
            'license_no' => $row->license_no,
            'lot_no' => $row->lot_no,
            'total_square_meter' => $row->total_square_meter,
            'total_units' => $row->total_units,
            'count_available' => $row->count_available,
            'notes' => $row->notes,
            'created_by' => auth()->id(),
            'modified_by' => auth()->id(),
        ]);
    }
}
