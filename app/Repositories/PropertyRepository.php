<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\Owner;
use App\Models\City;
use App\Models\Municipality;
use App\Models\Neighborhood;
use App\Models\PropertyStatus;
use App\Models\PropertyType;
use App\Models\PropertyClass;
use App\Models\Property;
use App\Http\Resources\PropertyResource;
use Illuminate\Support\Facades\Request;

class PropertyRepository
{
    public function getPaginatedProperties(array $filters = [])
    {
        return PropertyResource::collection(
            Property::with(['project', 'owner', 'status'])
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
                $property->load(['project', 'owner', 'status', 'propertyType', 'propertyClass', 'city', 'neighborhood.municipality.city', 'municipality'])
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

        $units = $property->units()
            ->with(['property', 'status', 'propertyType'])
            ->orderBy('unit_code')
            ->paginate(25)
            ->appends(request()->query());

        return [
            'property' => new PropertyResource($property),
            'units' => \App\Http\Resources\UnitResource::collection($units),
        ];
    }
}
