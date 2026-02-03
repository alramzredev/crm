<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'unit_uuid' => $this->unit_uuid,
            'unit_code' => $this->unit_code,
            'unit_number' => $this->unit_number,
            'unit_external_id' => $this->unit_external_id,
            'project' => $this->whenLoaded('project', $this->project ? $this->project->only('id', 'name', 'project_code') : null),
            'property' => $this->whenLoaded('property', $this->property ? $this->property->only('id', 'property_code') : null),
            'property_type' => $this->whenLoaded('propertyType', $this->propertyType ? $this->propertyType->only('id', 'name') : null),
            'status' => $this->whenLoaded('status', $this->status ? $this->status->only('id', 'name') : null),
            'neighborhood' => $this->neighborhood,
            'status_reason' => $this->status_reason,
            'floor' => $this->floor,
            'area' => $this->area,
            'building_surface_area' => $this->building_surface_area,
            'housh_area' => $this->housh_area,
            'rooms' => $this->rooms,
            'wc_number' => $this->wc_number,
            'price' => $this->price,
            'price_base' => $this->price_base,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
