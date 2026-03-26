<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NeighborhoodResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'municipality_id' => $this->municipality_id,
            'name' => $this->getTranslation('name', app()->getLocale()),
            'municipality' => new MunicipalityResource($this->whenLoaded('municipality')),
            'name_translations' => $this->getTranslations('name'),
        ];
    }
}
