<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProjectCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return $this->collection->map(function ($project) {
            return [
                'id' => $project->id,
                'project_id' => $project->project_id,
                'project_code' => $project->project_code,
                'name' => $project->name,
                'owner' => $project->owner ? [
                    'id' => $project->owner->id,
                    'name' => $project->owner->name,
                    'owner_type' => optional($project->owner->ownerType)->only('id', 'name'),
                ] : null,
                'city' => $project->city ? $project->city->only('id', 'name') : null,
                'project_type' => $project->projectType ? $project->projectType->only('id', 'name') : null,
                'project_ownership' => $project->ownership ? $project->ownership->only('id', 'name') : null,
                'status' => $project->status ? $project->status->only('id', 'name') : null,
                'neighborhood' => $project->neighborhood,
                'location' => $project->location,
                'budget' => $project->budget,
                'no_of_floors' => $project->no_of_floors,
                'number_of_units' => $project->number_of_units,
                'warranty' => (bool) $project->warranty,
                'deleted_at' => $project->deleted_at,
            ];
        });
    }
}
