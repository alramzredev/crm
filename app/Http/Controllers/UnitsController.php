<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\Property;
use App\Models\City;
use App\Models\Municipality;
use App\Models\Neighborhood;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Repositories\UnitRepository;
use App\Http\Requests\UnitStoreRequest;
use App\Http\Requests\UnitUpdateRequest;
use App\Services\UnitService;

class UnitsController extends Controller
{
     protected $service;

    public function __construct(UnitService $service)
    {
         $this->service = $service;
    }

    public function index()
    {
        $this->authorize('viewAny', Unit::class);

        $data = $this->service->getPaginatedUnits(Request::only('search', 'trashed', 'project_id', 'status_id'));

        return Inertia::render('Units/Index', [
            'filters' => Request::all('search', 'trashed', 'project_id', 'status_id'),
            'units' => $data['units'],
            'projects' => $data['projects'],
            'unitStatuses' => $data['unitStatuses'],
        ]);
    }

    public function create()
    {
        $this->authorize('create', Unit::class);

        $createData = $this->service->getCreateData();
        
        // If property_id is provided, load the property with project
        if (request('property_id')) {
            $property = Property::with('project')->find(request('property_id'));
            $createData['property'] = $property;
            $createData['cities'] = City::orderBy('name')->get();
            $createData['municipalities'] = Municipality::with('city')->orderBy('name')->get();
            $createData['neighborhoods'] = Neighborhood::orderBy('name')->get();
            
            
            // Override defaults with property's project
            if ($property) {
                $createData['defaults']['project_id'] = $property->project_id;
                $createData['defaults']['property_id'] = $property->id;
            }
        }

        return Inertia::render('Units/Create', $createData);
    }

    public function store(UnitStoreRequest $request)
    {
        $this->authorize('create', Unit::class);
        
        Unit::create($request->validated());

        return Redirect::route('units')->with('success', 'Unit created.');
    }

    public function edit(Unit $unit)
    {
        $this->authorize('update', $unit);
        
        return Inertia::render('Units/Edit', $this->service->getEditData($unit));
    }

    public function update(Unit $unit, UnitUpdateRequest $request)
    {
        $this->authorize('update', $unit);
        
        $unit->update($request->validated());

        return Redirect::back()->with('success', 'Unit updated.');
    }

    public function destroy(Unit $unit)
    {
        $this->authorize('delete', $unit);
        
        $unit->delete();

        return Redirect::back()->with('success', 'Unit deleted.');
    }

    public function restore(Unit $unit)
    {
        $this->authorize('restore', $unit);
        
        $unit->restore();

        return Redirect::back()->with('success', 'Unit restored.');
    }

    public function show(Unit $unit)
    {
        $this->authorize('view', $unit);
        
        return Inertia::render('Units/Show', [
            'unit' => $this->service->getShowResource($unit),
        ]);
    }
}
