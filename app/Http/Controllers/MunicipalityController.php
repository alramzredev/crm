<?php

namespace App\Http\Controllers;

use App\Models\Municipality;
use App\Models\City;
use App\Models\Country;
use App\Models\Neighborhood;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\MunicipalityResource;
use App\Http\Resources\NeighborhoodResource;
use App\Http\Resources\CityResource;

class MunicipalityController extends Controller
{
    // List all municipalities for a city (index)
    public function index($countryId, $cityId)
    {
        $city = City::with('country')->findOrFail($cityId);
        $country = $city->country ?? Country::findOrFail($countryId);

        $municipalities = Municipality::where('city_id', $city->id)
            ->withCount('neighborhoods')
            ->orderBy('name')
            ->get();

        return Inertia::render('Municipalities/Index', [
            'city' => $city,
            'country' => $country,
            'municipalities' => MunicipalityResource::collection($municipalities),
        ]);
    }

    // Show a single municipality (show)
    public function show($countryId, $cityId, Municipality $municipality)
    {
        $municipality->load(['city.country', 'neighborhoods']);
        return Inertia::render('Municipalities/Show', [
            'municipality' => new MunicipalityResource($municipality),
           
        ]);
    }

    // Show create form
    public function create(Country $country, City $city)
    {
         

        return Inertia::render('Municipalities/Create', [
            'city' =>  new CityResource($city->load('country')),
         ]);
    }

    // Store new municipality
    public function store(Request $request, $countryId, $cityId)
    {
        $city = City::findOrFail($cityId);

        $data = $request->validate([
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'name.ar' => 'required|string|max:255',
        ]);

        $municipality = new Municipality();
        $municipality->city_id = $city->id;
        $municipality->setTranslations('name', $data['name']);
        $municipality->save();

        return redirect()->route('countries.cities.municipalities.show', [$countryId, $cityId, $municipality->id])
            ->with('success', __('Municipality created.'));
    }

    // Show edit form
    public function edit($countryId, $cityId, Municipality $municipality)
    {
        $municipality->load('city.country');
  
        return Inertia::render('Municipalities/Edit', [
            'municipality' => new MunicipalityResource($municipality),
        ]);
    }

    // Update municipality
    public function update(Request $request, Country $country, City $city, Municipality $municipality)
    {
        $this->authorize('update', $country);

        $data = $request->validate([
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'name.ar' => 'required|string|max:255',
        ]);

        $municipality->setTranslations('name', $data['name']);
        $municipality->save();

        return redirect()->route('countries.cities.municipalities.show', [$country->id, $city->id, $municipality->id])
            ->with('success', __('Municipality updated.'));
    }

    // Optionally: restore, destroy, etc.

    // Edit Neighborhood (show edit form)
    public function editNeighborhood($countryId, $cityId, $municipalityId, $neighborhoodId)
    {
        $neighborhood = Neighborhood::with(['municipality.city.country'])->findOrFail($neighborhoodId);

        return Inertia::render('Neighborhoods/Edit', [
            'neighborhood' => new NeighborhoodResource($neighborhood),
        ]);
    }

    // Update Neighborhood
    public function updateNeighborhood(Request $request, $countryId, $cityId, $municipalityId, $neighborhoodId)
    {
        $municipality = Municipality::findOrFail($municipalityId);
        $neighborhood = Neighborhood::findOrFail($neighborhoodId);

        $data = $request->validate([
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'name.ar' => 'required|string|max:255',
        ]);

        $neighborhood->setTranslations('name', $data['name']);
        $neighborhood->save();

        return redirect()->route('countries.cities.municipalities.show', [$countryId, $cityId, $municipalityId])
            ->with('success', __('Neighborhood updated.'));
    }

     public function createNeighborhood($countryId, $cityId, $municipalityId)
    {
         $municipality = Municipality::with(['city.country'])->findOrFail($municipalityId);

        return Inertia::render('Neighborhoods/Create', [
            'municipality' => new MunicipalityResource($municipality),
        ]);
    }

    // Store new neighborhood
    public function storeNeighborhood(Request $request, Country $country, City $city, Municipality $municipality)
    {
        $data = $request->validate([
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'name.ar' => 'required|string|max:255',
        ]);

        $neighborhood = $municipality->neighborhoods()->create([
            'name' => $data['name'],
        ]);

        return redirect()->route('countries.cities.municipalities.show', [$country->id, $city->id, $municipality->id])
            ->with('success', __('Neighborhood created.'));
    }
}
