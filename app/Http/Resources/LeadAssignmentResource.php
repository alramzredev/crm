<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LeadAssignmentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'lead_id' => $this->lead_id,
            'employee_id' => $this->employee_id,
            'assigned_by' => $this->assigned_by,
            'assigned_at' => $this->assigned_at,
            'unassigned_at' => $this->unassigned_at,
            'is_active' => $this->is_active,
            'employee' => new UserResource($this->whenLoaded('employee')),
        ];
    }
}
