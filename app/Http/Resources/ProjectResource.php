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
            'project_id' => $this->project_id,
            'project_code' => $this->project_code,
            'name' => $this->name,
            'owner' => $this->owner ? $this->owner->only('id', 'name', 'phone', 'email') : null,
            'city' => $this->city ? $this->city->only('id', 'name') : null,
            'neighborhood' => $this->neighborhood,
            'location' => $this->location,
            'project_type' => $this->projectType ? $this->projectType->only('id', 'name') : null,
            'project_ownership' => $this->ownership ? $this->ownership->only('id', 'name') : null,
            'status' => $this->status ? $this->status->only('id', 'name') : null,
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
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'contracts' => $this->whenLoaded('contracts', $this->contracts->map->only('id', 'contract_type', 'status', 'notes')),
            'legal' => $this->whenLoaded('legal', $this->legal ? $this->legal->only('id', 'title_deed_status', 'construction_license_status', 'soil_test_report_status') : null),
            'assets' => $this->whenLoaded('assets', $this->assets ? $this->assets->only('id', 'renders_high_quality', 'free_maintenance', 'timetable') : null),
            'audits' => $this->whenLoaded('audits', $this->audits->map->only('id', 'row_checksum', 'source_modified_on')),
        ];
    }
}
