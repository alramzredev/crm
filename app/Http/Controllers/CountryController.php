<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Services\CountryService;
use App\Http\Requests\CountryRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Redirect;

class CountryController extends Controller
{
    protected $service;

    public function __construct(CountryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $this->authorize('viewAny', Country::class);

        return Inertia::render('Countries/Index', [
            'filters' => Request::all('search', 'trashed'),
            'countries' => $this->service->getPaginatedCountries(Request::only('search', 'trashed')),
            
        ]);
    }

    public function create()
    {
        $this->authorize('create', Country::class);

        return Inertia::render('Countries/Create', $this->service->getCreateData());
    }

    public function store(CountryRequest $request)
    {
        $this->authorize('create', Country::class);

        Country::create($request->validated());

        return Redirect::route('countries')->with('success', 'Country created.');
    }

    public function show(Country $country)
    {
        $this->authorize('view', $country);

        return Inertia::render('Countries/Show', $this->service->getShowData($country));
    }

    public function edit(Country $country)
    {
        $this->authorize('update', $country);

        return Inertia::render('Countries/Edit', $this->service->getEditData($country));
    }

    public function update(Country $country, CountryRequest $request)
    {
        $this->authorize('update', $country);

        $country->update($request->validated());

        return Redirect::back()->with('success', 'Country updated.');
    }

    public function destroy(Country $country)
    {
        $this->authorize('delete', $country);

        $country->delete();

        return Redirect::back()->with('success', 'Country deleted.');
    }

    public function restore(Country $country)
    {
        $this->authorize('restore', $country);

        $country->restore();

        return Redirect::back()->with('success', 'Country restored.');
    }
}
