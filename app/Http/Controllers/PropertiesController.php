<?php

namespace App\Http\Controllers;

use App\Http\Requests\PropertyStoreRequest;
use App\Http\Requests\PropertyUpdateRequest;
use App\Http\Resources\PropertyCollection;
use App\Http\Resources\PropertyResource;
use App\Repositories\PropertyRepository;
use App\Models\Property;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class PropertiesController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new PropertyRepository();
    }

    public function index()
    {
        return Inertia::render('Properties/Index', [
            'filters' => Request::all('search', 'trashed'),
            'properties' => new PropertyCollection(
                $this->repo->getPaginatedProperties(Request::only('search', 'trashed'))
            ),
        ]);
    }

    public function create()
    {
        return Inertia::render('Properties/Create', $this->repo->getCreateData());
    }

    public function store(PropertyStoreRequest $request)
    {
        Property::create($request->validated());

        return Redirect::route('properties')->with('success', 'Property created.');
    }

    public function show(Property $property)
    {
        return Inertia::render('Properties/Show', [
            'property' => $this->repo->getShowResource($property),
        ]);
    }

    public function edit(Property $property)
    {
        return Inertia::render('Properties/Edit', $this->repo->getEditData($property));
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
