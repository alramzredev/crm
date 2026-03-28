<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\CountryService;
use App\Http\Resources\CityResource;
use App\Http\Resources\MunicipalityResource;
use App\Http\Requests\CityRequest;
 
class CityController extends Controller
{
    protected $countryService;

    public function __construct(CountryService $countryService)
    {
        $this->countryService = $countryService;
    }

    public function show($countryId, City $city)
    {
        $this->authorize('view', $city->country);

        $city->load('country');
        $municipalities = $this->countryService->getMunicipalitiesForCity($city);

        return Inertia::render('Cities/Show', [
            'city' => new CityResource($city),
            'municipalities' => MunicipalityResource::collection($municipalities),
        ]);
    }

    public function edit($countryId, City $city)
    {
        $this->authorize('update', $city->country);

        $city->load('country');
        $country = $city->country ?? Country::find($countryId);

        return Inertia::render('Cities/Edit', [
            'city' => new CityResource($city),
            'country' => $country,
        ]);
    }

    public function update(CityRequest $request, $countryId, City $city)
    {
        $this->authorize('update', $city->country);

        $data = $request->validated();

        $city->setTranslations('name', $data['name']);
        $city->save();

        return redirect()->route('countries.cities.show', [$countryId, $city->id])
            ->with('success', __('City updated.'));
    }

    public function create($countryId)
    {
        $country = $this->countryService->getCityCreateData($countryId);
        $this->authorize('create', Country::class);

        return Inertia::render('Cities/Create', [
            'country' => $country,
        ]);
    }

    public function store(CityRequest $request, $countryId)
    {
        $country = Country::findOrFail($countryId);
        $this->authorize('create', Country::class);

        $data = $request->validated();

        $city = new City();
        $city->country_id = $country->id;
        $city->setTranslations('name', $data['name']);
        $city->save();

        return redirect()->route('countries.cities.show', [$country->id, $city->id])
            ->with('success', __('City created.'));
    }

    public function destroy(Country $country, City $city)
    {
        $this->authorize('delete', $city->country);

        // Eager load municipalities and neighborhoods
        $city->load('municipalities.neighborhoods');

        // Delete all neighborhoods for each municipality
        foreach ($city->municipalities as $municipality) {
            $municipality->neighborhoods()->delete();
        }

        // Delete all municipalities for the city
        $city->municipalities()->delete();

        // Delete the city itself
        $city->delete();

        return redirect()->route('countries.show', $country->id)
            ->with('success', __('City deleted.'));
    }
}
