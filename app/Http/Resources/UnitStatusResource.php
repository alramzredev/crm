<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UnitStatusResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->getTranslation('name', app()->getLocale()),
            'name_translations' => $this->getTranslations('name'),
            'description' => $this->getTranslation('description', app()->getLocale()),
            'description_translations' => $this->getTranslations('description'),
        ];
    }
}
