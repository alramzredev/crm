<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Repositories\UnitRepository;
use App\Http\Requests\UnitStoreRequest;
use App\Http\Requests\UnitUpdateRequest;

class UnitsController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new UnitRepository();
    }

    public function index()
    {
        $this->authorize('viewAny', Unit::class);
        
        return Inertia::render('Units/Index', [
            'filters' => Request::all('search', 'trashed'),
            'units' => $this->repo->getPaginatedUnits(Request::only('search', 'trashed')),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Unit::class);
        
        return Inertia::render('Units/Create', $this->repo->getCreateData());
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
        
        return Inertia::render('Units/Edit', $this->repo->getEditData($unit));
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
            'unit' => $this->repo->getShowResource($unit),
        ]);
    }
}
