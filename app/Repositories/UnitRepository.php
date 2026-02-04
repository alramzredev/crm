<?php

namespace App\Repositories;

use App\Models\Unit;
use App\Models\Project;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\UnitStatus;
use App\Http\Resources\UnitResource;
use Illuminate\Support\Facades\Request;

class UnitRepository
{
    public function getPaginatedUnits(array $filters = [])
    {
        return Unit::with(['project', 'property', 'propertyType', 'status'])
            ->orderBy('unit_code')
            ->when(Request::get('project_id'), fn ($q, $pid) => $q->where('project_id', $pid))
            ->when(Request::get('property_id'), fn ($q, $pid) => $q->where('property_id', $pid))
            ->paginate()
            ->appends(Request::all());
    }

    public function getCreateData(): array
    {
        return [
            'projects' => Project::orderBy('name')->get(),
            'properties' => Property::orderBy('property_code')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyStatuses' => UnitStatus::orderBy('name')->get(),
            'defaults' => [
                'project_id' => Request::get('project_id'),
                'property_id' => Request::get('property_id'),
                'status_id' => Request::get('status_id'),
            ],
        ];
    }

    public function getEditData(Unit $unit): array
    {
        return [
            'unit' => new UnitResource(
                $unit->load(['project', 'property', 'propertyType', 'status'])
            ),
            'projects' => Project::orderBy('name')->get(),
            'properties' => Property::orderBy('property_code')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyStatuses' => UnitStatus::orderBy('name')->get(),
            'defaults' => [
                'project_id' => $unit->project_id,
                'property_id' => $unit->property_id,
                'status_id' => $unit->status_id,
            ],
        ];
    }

    public function getShowResource(Unit $unit)
    {
        return new UnitResource(
            $unit->load(['project', 'property', 'propertyType', 'status'])
        );
    }
}
