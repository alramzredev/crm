<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'contract_code' => $this->contract_code,
            'status' => $this->status,
            'contract_date' => $this->contract_date,
            'total_price' => $this->total_price,
            'currency' => $this->currency,
            'notes' => $this->notes,
            'contract_type_id' => $this->contract_type_id,
            'contract_type' => $this->contractType?->name,
            'original_contract' => $this->getFirstMedia('original_contract') ? [
                'id' => $this->getFirstMedia('original_contract')->id,
                'file_name' => $this->getFirstMedia('original_contract')->file_name,
                'mime_type' => $this->getFirstMedia('original_contract')->mime_type,
                'size' => $this->getFirstMedia('original_contract')->size,
                'url' => $this->getFirstMedia('original_contract')->getFullUrl(),
                'created_at' => $this->getFirstMedia('original_contract')->created_at,
            ] : null,
            'signed_contract' => $this->getFirstMedia('signed_contract') ? [
                'id' => $this->getFirstMedia('signed_contract')->id,
                'file_name' => $this->getFirstMedia('signed_contract')->file_name,
                'mime_type' => $this->getFirstMedia('signed_contract')->mime_type,
                'size' => $this->getFirstMedia('signed_contract')->size,
                'url' => $this->getFirstMedia('signed_contract')->getFullUrl(),
                'created_at' => $this->getFirstMedia('signed_contract')->created_at,
            ] : null,
        ];
    }
}
