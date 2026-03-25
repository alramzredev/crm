<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MunicipalityResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->getTranslation('name', app()->getLocale()),
            'name_translations' => $this->getTranslations('name'),
            'neighborhoods_count' => $this->neighborhoods()->count(),
            'city_id' => $this->city_id,
        ];
    }
}
