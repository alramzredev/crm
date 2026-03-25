<?php

namespace App\Http\Controllers;

use App\Models\Municipality;
use App\Models\City;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\MunicipalityResource;

class MunicipalityController extends Controller
{
    public function edit($countryId, $cityId, Municipality $municipality)
    {
        $municipality->load('city');
        $city = $municipality->city;
        $country = $city->country ?? Country::find($countryId);

        return Inertia::render('Municipalities/Edit', [
            'municipality' => new MunicipalityResource($municipality),
            'city' => $city,
            'country' => $country,
        ]);
    }

    public function update(Request $request, $countryId, $cityId, Municipality $municipality)
    {
        $this->authorize('update', $municipality);

        $data = $request->validate([
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'name.ar' => 'required|string|max:255',
        ]);

        $municipality->setTranslations('name', $data['name']);
        $municipality->save();

        return redirect()->route('countries.cities.show', [$countryId, $cityId])
            ->with('success', __('Municipality updated.'));
    }
}
