<?php

namespace App\Services;

use App\Models\Country;
use App\Repositories\CountryRepository;
use App\Http\Resources\CountryResource;
use App\Http\Resources\CityResource;

class CountryService
{
    protected $repo;

    public function __construct(CountryRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getPaginatedCountries(array $filters = [])
    {
        $query = $this->repo->query(['cities']);
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name->en', 'like', "%{$search}%")
                  ->orWhere('name->ar', 'like', "%{$search}%");
            });
        }
        if (!empty($filters['trashed'])) {
            $trashed = $filters['trashed'];
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        }
        return CountryResource::collection(
            $query->paginate()->appends(request()->all())
        );
    }

    public function getCreateData(): array
    {
        return [];
    }


    public function  getCityCreateData($countryId){

      $country = $this->repo->find($countryId);
      return  new CountryResource($country);
 
    }

    public function getEditData(Country $country): array
    {
        return [
            'country' => new CountryResource($country->load('cities')),
        ];
    }

    public function getShowData(Country $country): array
    {
        return [
            'country' => new CountryResource($country->load('cities')),
         ];
    }

    public function getMunicipalitiesForCity($city)
    {
        return $city->municipalities()->get();
    }
}
