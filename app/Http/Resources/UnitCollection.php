<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class UnitCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return $this->collection->map(function ($unit) {
            return [
                'id' => $unit->id,
                'unit_code' => $unit->unit_code,
                'unit_number' => $unit->unit_number,
                'project' => $unit->project ? $unit->project->only('id', 'name') : null,
                'property' => $unit->property ? $unit->property->only('id', 'property_code') : null,
                'property_type' => $unit->propertyType ? $unit->propertyType->only('id', 'name') : null,
                'status' => $unit->status ? $unit->status->only('id', 'name') : null,
                'floor' => $unit->floor,
                'area' => $unit->area,
                'rooms' => $unit->rooms,
                'deleted_at' => $unit->deleted_at,
            ];
        });
    }
}
