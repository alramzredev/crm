<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'reservation_code' => $this->reservation_code,
            'lead_id' => $this->lead_id,
            'customer_id' => $this->customer_id,
            'unit_id' => $this->unit_id,
            'status' => $this->status,
            'started_at' => $this->started_at,
            'expires_at' => $this->expires_at,
            'payment_method' => $this->payment_method,
            'payment_plan' => $this->payment_plan,
            'total_price' => $this->total_price,
            'down_payment' => $this->down_payment,
            'remaining_amount' => $this->remaining_amount,
            'currency' => $this->currency,
            'terms_accepted' => $this->terms_accepted,
            'privacy_accepted' => $this->privacy_accepted,
            'notes' => $this->notes,
            'lead' => new LeadResource($this->whenLoaded('lead')),
            'unit' => new UnitResource($this->whenLoaded('unit')),
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
