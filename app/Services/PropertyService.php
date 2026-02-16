<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Owner;
use App\Models\City;
use App\Models\Municipality;
use App\Models\Neighborhood;
use App\Models\PropertyStatus;
use App\Models\PropertyType;
use App\Models\PropertyClass;
use App\Models\Property;
use App\Repositories\PropertyRepository;
use App\Http\Resources\PropertyResource;
use App\Http\Resources\UnitResource;
use Illuminate\Support\Facades\Request;

class PropertyService
{
    protected $repo;

    public function __construct(PropertyRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getPaginatedProperties(array $filters = [])
    {
        $query = $this->repo->query(['project', 'owner', 'status']);

        return PropertyResource::collection(
            $query
                ->orderBy('property_code')
                ->when(Request::get('project_id'), fn ($q, $pid) => $q->where('project_id', $pid))
                ->paginate()
                ->appends(Request::all())
        );
    }

    public function getCreateData(): array
    {
        return [
            'projects' => Project::orderBy('name')->get(),
            'owners' => Owner::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'municipalities' => Municipality::with('city')->orderBy('name')->get(),
            'neighborhoods' => Neighborhood::orderBy('name')->get(),
            'propertyStatuses' => PropertyStatus::orderBy('name')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyClasses' => PropertyClass::orderBy('name')->get(),
            'defaults' => [
                'project_id' => Request::get('project_id'),
                'city_id' => Request::get('city_id'),
                'municipality_id' => Request::get('municipality_id'),
                'neighborhood_id' => Request::get('neighborhood_id'),
                'owner_id' => Request::get('owner_id'),
                'status_id' => Request::get('status_id'),
            ],
        ];
    }

    public function getEditData(Property $property): array
    {
        return [
            'property' => new PropertyResource(
                $property->load([
                    'project', 'owner', 'status', 'propertyType', 'propertyClass', 'city', 'neighborhood.municipality.city', 'municipality'
                ])
            ),
            'projects' => Project::orderBy('name')->get(),
            'owners' => Owner::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'municipalities' => Municipality::with('city')->orderBy('name')->get(),
            'neighborhoods' => Neighborhood::orderBy('name')->get(),
            'propertyStatuses' => PropertyStatus::orderBy('name')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyClasses' => PropertyClass::orderBy('name')->get(),
            'defaults' => [
                'project_id' => $property->project_id,
                'city_id' => $property->city_id,
                'municipality_id' => optional($property->neighborhood)->municipality_id,
                'neighborhood_id' => $property->neighborhood_id,
                'owner_id' => $property->owner_id,
                'status_id' => $property->status_id,
            ],
        ];
    }

    public function getShowResource(Property $property)
    {
        $property->load([
            'project',
            'owner',
            'status',
            'city',
            'neighborhood.municipality.city',
            'municipality',
            'propertyType',
            'propertyClass'
        ]);

        $units = $this->repo->getUnits($property);

        return [
            'property' => new PropertyResource($property),
            'units' => UnitResource::collection($units),
        ];
    }
}
