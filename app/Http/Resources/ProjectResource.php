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
            'uuid' => $this->uuid,
            'project_code' => $this->project_code,
            'name' => $this->name,
            'reservation_period_days' => $this->reservation_period_days,
            'owner_id' => $this->owner_id,
            'owner' => $this->whenLoaded('owner', $this->owner ? [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
                'owner_type' => $this->owner->ownerType ? $this->owner->ownerType->only('id', 'name') : null,
            ] : null),
            'city_id' => $this->city_id,
            'city' => $this->whenLoaded('city', $this->city ? $this->city->only('id', 'name') : null),
            'project_type_id' => $this->project_type_id,
            'project_type' => $this->whenLoaded('projectType', $this->projectType ? $this->projectType->only('id', 'name') : null),
            'status_id' => $this->status_id,
            'status' => $this->whenLoaded('status', $this->status ? $this->status->only('id', 'name') : null),
            'neighborhood' => $this->neighborhood,
            'location' => $this->location,
            'budget' => $this->budget,
            'no_of_floors' => $this->no_of_floors,
            'number_of_units' => $this->number_of_units,
            'warranty' => $this->warranty,
            'deleted_at' => $this->deleted_at,
            'properties' => PropertyResource::collection($this->whenLoaded('properties')),
        ];
    }
}
