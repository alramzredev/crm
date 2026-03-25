<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CityResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->getTranslation('name', app()->getLocale()),
            'name_translations' => $this->getTranslations('name'),
            'country_id' => $this->country_id,
            'municipalities_count' => $this->municipalities()->count(),
            'country' => $this->whenLoaded('country', function () {
                return new CountryResource($this->country);
            }),
        ];
    }
}
