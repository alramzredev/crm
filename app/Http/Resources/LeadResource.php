<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name' => $this->name,
            'national_id' => $this->national_id,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'region' => $this->region,
            'country' => $this->country,
            'postal_code' => $this->postal_code,
            'national_address_file' => $this->national_address_file,
            'national_id_file' => $this->national_id_file,
            'project_id' => $this->project_id,
            'lead_source_id' => $this->lead_source_id,
            'project' => new ProjectResource($this->whenLoaded('project')),
            'leadSource' => new LeadSourceResource($this->whenLoaded('leadSource')),
            'activeAssignment' => new LeadAssignmentResource($this->whenLoaded('activeAssignment')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
