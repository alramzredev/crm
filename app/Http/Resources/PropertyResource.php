<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'property_code' => $this->property_code,
            'property_no' => $this->property_no,
            'project_id' => $this->project_id,
            'project' => $this->whenLoaded('project', $this->project ? $this->project->only('id', 'name') : null),
            'owner_id' => $this->owner_id,
            'owner' => $this->whenLoaded('owner', $this->owner ? $this->owner->only('id', 'name') : null),
            'status_id' => $this->status_id,
            'status' => $this->whenLoaded('status', $this->status ? $this->status->only('id', 'name') : null),
            'property_type_id' => $this->property_type_id,
            'propertyType' => $this->whenLoaded('propertyType', $this->propertyType ? $this->propertyType->only('id', 'name') : null),
            'property_class_id' => $this->property_class_id,
            'propertyClass' => $this->whenLoaded('propertyClass', $this->propertyClass ? $this->propertyClass->only('id', 'name') : null),
            'neighborhood_id' => $this->neighborhood_id,
            'neighborhood' => $this->whenLoaded('neighborhood', $this->neighborhood ? $this->neighborhood->only('id', 'name', 'municipality_id') : null),
            'diagram_number' => $this->diagram_number,
            'instrument_no' => $this->instrument_no,
            'license_no' => $this->license_no,
            'lot_no' => $this->lot_no,
            'total_square_meter' => $this->total_square_meter,
            'total_units' => $this->total_units,
            'count_available' => $this->count_available,
            'notes' => $this->notes,
            'deleted_at' => $this->deleted_at,
            'units' => new UnitCollection($this->whenLoaded('units')),
        ];
    }
}
