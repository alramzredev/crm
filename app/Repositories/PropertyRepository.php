<?php

namespace App\Repositories;

use App\Models\Property;

class PropertyRepository
{
    public function query(array $with = [])
    {
        $user = auth()->user();
        if ($user) {
            return Property::with($with)->forUser($user);
        }
        return Property::with($with);
    }

    public function find($id, array $with = [])
    {
        return Property::with($with)->find($id);
    }

    public function getUnits(Property $property, int $perPage = 25)
    {
        return $property->units()
            ->with(['property', 'status', 'propertyType'])
            ->orderBy('unit_code')
            ->paginate($perPage)
            ->appends(request()->query());
    }
}
