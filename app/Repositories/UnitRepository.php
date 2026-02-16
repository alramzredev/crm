<?php

namespace App\Repositories;

use App\Models\Unit;

class UnitRepository
{
    /**
     * Return a base query for units, optionally eager loading relations.
     */
    public function query(array $with = [])
    {
        return Unit::with($with);
    }

    /**
     * Find a unit by ID.
     */
    public function find($id, array $with = [])
    {
        return Unit::with($with)->find($id);
    }
}
