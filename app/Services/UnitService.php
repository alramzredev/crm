<?php

namespace App\Services;

use App\Models\Unit;
use App\Models\PropertyType;
use App\Models\UnitStatus;
use App\Models\UnitType;
use App\Models\Neighborhood;
use App\Http\Resources\UnitResource;
use App\Http\Resources\UnitStatusResource;
use App\Repositories\UnitRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\PropertyRepository;

class UnitService
{
    protected $repo;
    protected $projectRepo;
    protected $propertyRepo;

    public function __construct(UnitRepository $repo, ProjectRepository $projectRepo, PropertyRepository $propertyRepo)
    {
        $this->repo = $repo;
        $this->projectRepo = $projectRepo;
        $this->propertyRepo = $propertyRepo;
    }

    public function getCreateData(): array
    {
        return [
            'projects' => $this->projectRepo->query()->orderBy('name')->get(),
            'properties' => $this->propertyRepo->query()->orderBy('property_code')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyStatuses' => UnitStatusResource::collection(UnitStatus::orderBy('name')->get()),
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
            'projects' => $this->projectRepo->query()->orderBy('name')->get(),
            'properties' => $this->propertyRepo->query()->orderBy('property_code')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyStatuses' => UnitStatusResource::collection(UnitStatus::orderBy('name')->get()),
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
        // Filter units by the current user using the forUser scope
       

        return [
            'units' => UnitResource::collection(
                $query
                    ->orderBy('unit_code')
                    ->when(request()->get('project_id'), fn ($q, $pid) => $q->where('project_id', $pid))
                    ->when(request()->get('status_id'), fn ($q, $sid) => $q->where('status_id', $sid))
                    ->paginate($perPage)
                    ->appends(request()->all())
            ),
            'projects' => \App\Http\Resources\ProjectResource::collection(
                $this->projectRepo->query()->orderBy('name')->get()
            ),
            'unitStatuses' => UnitStatusResource::collection(\App\Models\UnitStatus::all()),
        ];
    }
}
