<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use App\Repositories\OwnerRepository;
use App\Http\Requests\OwnerRequest;

class OwnersController extends Controller
{
    protected $repo;

    public function __construct()
    {
        $this->repo = new OwnerRepository();
    }

    public function index()
    {
        $owners = $this->repo->getPaginatedOwners(Request::only('search', 'trashed'));

        return Inertia::render('Owners/Index', [
            'filters' => Request::all('search', 'trashed'),
            'owners' => $owners,
        ]);
    }

    public function create()
    {
        return Inertia::render('Owners/Create');
    }

    public function store(OwnerRequest $request)
    {
        Owner::create($request->validated());

        return Redirect::route('owners')->with('success', 'Owner created.');
    }

    public function edit(Owner $owner)
    {
        return Inertia::render('Owners/Edit', [
            'owner' => $owner,
        ]);
    }

    public function update(Owner $owner, OwnerRequest $request)
    {
        $owner->update($request->validated());

        return Redirect::back()->with('success', 'Owner updated.');
    }

    public function destroy(Owner $owner)
    {
        $owner->delete();

        return Redirect::back()->with('success', 'Owner deleted.');
    }

    public function restore(Owner $owner)
    {
        $owner->restore();

        return Redirect::back()->with('success', 'Owner restored.');
    }
}

