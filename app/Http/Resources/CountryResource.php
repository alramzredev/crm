<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CountryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->getTranslation('name', app()->getLocale()),
            'name_translations' => $this->getTranslations('name'),
            'iso_code' => $this->iso_code,
            'cities_count' => $this->cities()->count(),
            'cities' => CityResource::collection($this->whenLoaded('cities')),
        ];
    }
}
