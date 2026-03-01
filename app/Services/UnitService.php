<?php

namespace App\Services;

use App\Models\Unit;
use App\Models\Project;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\UnitStatus;
use App\Models\UnitType;
use App\Models\Neighborhood;
use App\Http\Resources\UnitResource;
use App\Repositories\UnitRepository;

class UnitService
{
    protected $repo;

    public function __construct(UnitRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getCreateData(): array
    {
        return [
            'projects' => Project::orderBy('name')->get(),
            'properties' => Property::orderBy('property_code')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyStatuses' => UnitStatus::orderBy('name')->get(),
            'unitTypes' => UnitType::where('is_active', true)->orderBy('name')->get(),
            'neighborhoods' => Neighborhood::orderBy('name')->get(),
            'defaults' => [
                'project_id' => request()->get('project_id'),
                'property_id' => request()->get('property_id'),
                'status_id' => request()->get('status_id'),
            ],
        ];
    }

    public function getEditData(Unit $unit): array
    {
        return [
            'unit' => new UnitResource(
                $unit->load(['project', 'property', 'propertyType', 'status', 'neighborhood'])
            ),
            'projects' => Project::orderBy('name')->get(),
            'properties' => Property::orderBy('property_code')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyStatuses' => UnitStatus::orderBy('name')->get(),
            'unitTypes' => UnitType::where('is_active', true)->orderBy('name')->get(),
            'neighborhoods' => Neighborhood::orderBy('name')->get(),
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
            $unit->load(['project', 'property', 'propertyType', 'status', 'neighborhood'])
        );
    }

    public function getPaginatedUnits(array $filters = [], int $perPage = 25)
    {
        $query = $this->repo->query(['project', 'property', 'propertyType', 'status']);

        return [
            'units' => UnitResource::collection(
                $query
                    ->orderBy('unit_code')
                    ->when(request()->get('project_id'), fn ($q, $pid) => $q->where('project_id', $pid))
                    ->when(request()->get('status_id'), fn ($q, $sid) => $q->where('status_id', $sid))
                    ->paginate($perPage)
                    ->appends(request()->all())
            ),
            'projects' => \App\Models\Project::orderBy('name')->get(),
            'unitStatuses' => \App\Models\UnitStatus::orderBy('name')->get(),
        ];
    }
}
