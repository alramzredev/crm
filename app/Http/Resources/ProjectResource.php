<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'project_code' => $this->project_code,
            'name' => $this->name,
            'reservation_period_days' => $this->reservation_period_days,
            'owner' => $this->whenLoaded('owner', $this->owner ? $this->owner->only('id', 'name') : null),
            'city' => $this->whenLoaded('city', $this->city ? $this->city->only('id', 'name') : null),
            'neighborhood' => $this->neighborhood,
            'location' => $this->location,
            'project_type' => $this->whenLoaded('projectType', $this->projectType ? $this->projectType->only('id', 'name') : null),
            'project_ownership' => $this->whenLoaded('ownership', $this->ownership ? $this->ownership->only('id', 'name') : null),
            'status' => $this->whenLoaded('status', $this->status ? $this->status->only('id', 'name') : null),
            'status_reason' => $this->status_reason,
            'land_area' => $this->land_area,
            'built_up_area' => $this->built_up_area,
            'selling_space' => $this->selling_space,
            'sellable_area_factor' => $this->sellable_area_factor,
            'floor_area_ratio' => $this->floor_area_ratio,
            'no_of_floors' => $this->no_of_floors,
            'number_of_units' => $this->number_of_units,
            'budget' => $this->budget,
            'warranty' => (bool) $this->warranty,
            'deleted_at' => $this->deleted_at,
            'properties' => new PropertyCollection($this->whenLoaded('properties')),
        ];
    }
}
