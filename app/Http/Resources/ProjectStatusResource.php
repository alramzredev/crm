<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectStatusResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->getTranslation('name', app()->getLocale()),
            'name_translations' => $this->getTranslations('name'),
        ];
    }
}
