<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request as HttpRequest;

class OwnersController extends Controller
{
    public function index()
    {
        $query = Owner::query();

        if ($search = Request::get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if (Request::get('trashed')) {
            $query->onlyTrashed();
        }

        $owners = $query->orderBy('name')->paginate()->appends(Request::all());

        return Inertia::render('Owners/Index', [
            'filters' => Request::all('search', 'trashed'),
            'owners' => $owners,
        ]);
    }

    public function create()
    {
        return Inertia::render('Owners/Create');
    }

    public function store(HttpRequest $request)
    {
        $data = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'type'  => ['required', 'in:individual,company,government,partnership'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        Owner::create($data);

        return Redirect::route('owners')->with('success', 'Owner created.');
    }

    public function edit(Owner $owner)
    {
        return Inertia::render('Owners/Edit', [
            'owner' => $owner,
        ]);
    }

    public function update(Owner $owner, HttpRequest $request)
    {
        $data = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'type'  => ['required', 'in:individual,company,government,partnership'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $owner->update($data);

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

