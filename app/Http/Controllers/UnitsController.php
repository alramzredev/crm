<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Repositories\UnitRepository;
use App\Http\Requests\UnitStoreRequest;
use App\Http\Requests\UnitUpdateRequest;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UnitsController extends Controller
{
    protected $unitRepository;

    public function __construct(UnitRepository $unitRepository)
    {
        $this->unitRepository = $unitRepository;
    }

    public function index()
    {
        return Inertia::render('Units/Index', [
            'units' => $this->unitRepository->getPaginatedUnits(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Units/Create', $this->unitRepository->getCreateData());
    }

    public function store(UnitStoreRequest $request)
    {
        Unit::create($request->validated());

        return Redirect::route('units')->with('success', 'Unit created.');
    }

    public function show(Unit $unit)
    {
        return Inertia::render('Units/Show', [
            'unit' => $this->unitRepository->getShowResource($unit),
        ]);
    }

    public function edit(Unit $unit)
    {
        return Inertia::render('Units/Edit', $this->unitRepository->getEditData($unit));
    }

    public function update(UnitUpdateRequest $request, Unit $unit)
    {
        $unit->update($request->validated());

        return Redirect::back()->with('success', 'Unit updated.');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return Redirect::back()->with('success', 'Unit deleted.');
    }

    public function restore(Unit $unit)
    {
        $unit->restore();

        return Redirect::back()->with('success', 'Unit restored.');
    }
}
