<?php

namespace App\Repositories;

use App\Models\Country;

class CountryRepository
{
    /**
     * Return a base query for countries, optionally eager loading relations.
     */
    public function query(array $with = [])
    {
        return Country::with($with);
    }

    /**
     * Find a country by ID.
     */
    public function find($id, array $with = [])
    {
        return Country::with($with)->find($id);
    }
}
