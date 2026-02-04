<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name' => $this->name,
            'email' => $this->email,
            'photo' => $this->photo,
            'photo_path' => $this->photo_path,
            'deleted_at' => $this->deleted_at,
            'roles' => $this->whenLoaded('roles', $this->roles),
            'supervisor' => $this->whenLoaded('supervisor', $this->supervisor),
            'projects' => $this->whenLoaded('projects', $this->projects),
        ];
    }
}
