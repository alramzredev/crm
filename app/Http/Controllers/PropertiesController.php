<?php

namespace App\Http\Controllers;

use App\Http\Requests\PropertyStoreRequest;
use App\Http\Requests\PropertyUpdateRequest;
use App\Http\Resources\PropertyCollection;
use App\Http\Resources\PropertyResource;
use App\Models\Municipality;
use App\Models\Neighborhood;
use App\Models\Owner;
use App\Models\Project;
use App\Models\Property;
use App\Models\PropertyStatus;
use App\Models\PropertyType;
use App\Models\PropertyClass;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class PropertiesController extends Controller
{
    public function index()
    {
        return Inertia::render('Properties/Index', [
            'filters' => Request::all('search', 'trashed'),
            'properties' => new PropertyCollection(
                Property::with(['project', 'owner', 'status'])
                    ->orderBy('property_code')
                    ->when(Request::get('project_id'), fn ($q, $pid) => $q->where('project_id', $pid))
                    ->paginate()
                    ->appends(Request::all())
            ),
        ]);
    }

    public function create()
    {
        return Inertia::render('Properties/Create', [
            'projects' => Project::orderBy('name')->get(),
            'owners' => Owner::orderBy('name')->get(),
            'municipalities' => Municipality::with('city')->orderBy('name')->get(),
            'neighborhoods' => Neighborhood::orderBy('name')->get(),
            'propertyStatuses' => PropertyStatus::orderBy('name')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyClasses' => PropertyClass::orderBy('name')->get(),
            'defaults' => [
                'project_id' => Request::get('project_id'),
                'municipality_id' => Request::get('municipality_id'),
                'neighborhood_id' => Request::get('neighborhood_id'),
                'owner_id' => Request::get('owner_id'),
                'status_id' => Request::get('status_id'),
            ],
        ]);
    }

    public function store(PropertyStoreRequest $request)
    {
        Property::create($request->validated());

        return Redirect::route('properties')->with('success', 'Property created.');
    }

    public function show(Property $property)
    {
        return Inertia::render('Properties/Show', [
            'property' => new PropertyResource(
                $property->load(['project', 'owner', 'status', 'neighborhood.municipality.city'])
            ),
        ]);
    }

    public function edit(Property $property)
    {
        return Inertia::render('Properties/Edit', [
            'property' => new PropertyResource(
                $property->load(['project', 'owner', 'status', 'propertyType', 'propertyClass', 'neighborhood.municipality.city'])
            ),
            'projects' => Project::orderBy('name')->get(),
            'owners' => Owner::orderBy('name')->get(),
            'municipalities' => Municipality::with('city')->orderBy('name')->get(),
            'neighborhoods' => Neighborhood::orderBy('name')->get(),
            'propertyStatuses' => PropertyStatus::orderBy('name')->get(),
            'propertyTypes' => PropertyType::orderBy('name')->get(),
            'propertyClasses' => PropertyClass::orderBy('name')->get(),
            'defaults' => [
                'project_id' => $property->project_id,
                'municipality_id' => optional($property->neighborhood)->municipality_id,
                'neighborhood_id' => $property->neighborhood_id,
                'owner_id' => $property->owner_id,
                'status_id' => $property->status_id,
            ],
        ]);
    }

    public function update(Property $property, PropertyUpdateRequest $request)
    {
        $property->update($request->validated());

        return Redirect::back()->with('success', 'Property updated.');
    }

    public function destroy(Property $property)
    {
        $property->delete();

        return Redirect::back()->with('success', 'Property deleted.');
    }

    public function restore(Property $property)
    {
        $property->restore();

        return Redirect::back()->with('success', 'Property restored.');
    }
}
