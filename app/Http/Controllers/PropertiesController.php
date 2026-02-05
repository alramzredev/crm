<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Repositories\PropertyRepository;
use App\Http\Requests\PropertyStoreRequest;
use App\Http\Requests\PropertyUpdateRequest;

class PropertiesController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new PropertyRepository();
    }

    public function index()
    {
        $this->authorize('viewAny', Property::class);
        
        return Inertia::render('Properties/Index', [
            'filters' => Request::all('search', 'trashed'),
            'properties' => $this->repo->getPaginatedProperties(Request::only('search', 'trashed')),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Property::class);
        
        return Inertia::render('Properties/Create', $this->repo->getCreateData());
    }

    public function store(PropertyStoreRequest $request)
    {
        $this->authorize('create', Property::class);
        
        Property::create($request->validated());

        return Redirect::route('properties')->with('success', 'Property created.');
    }

    public function edit(Property $property)
    {
        $this->authorize('update', $property);
        
        return Inertia::render('Properties/Edit', $this->repo->getEditData($property));
    }

    public function update(Property $property, PropertyUpdateRequest $request)
    {
        $this->authorize('update', $property);
        
        $property->update($request->validated());

        return Redirect::back()->with('success', 'Property updated.');
    }

    public function destroy(Property $property)
    {
        $this->authorize('delete', $property);
        
        $property->delete();

        return Redirect::back()->with('success', 'Property deleted.');
    }

    public function restore(Property $property)
    {
        $this->authorize('restore', $property);
        
        $property->restore();

        return Redirect::back()->with('success', 'Property restored.');
    }

    public function show(Property $property)
    {
        $this->authorize('view', $property);
        
        return Inertia::render('Properties/Show', $this->repo->getShowResource($property));
    }
}
