<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ContractResource;

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
            'project_id' => $this->when(
                $this->relationLoaded('unit') && $this->unit,
                fn () => $this->unit->project_id
            ),
            'project' => $this->whenLoaded('unit.project', function () {
                return $this->unit && $this->unit->project ? new ProjectResource($this->unit->project) : null;
            }),
            'property_id' => $this->when(
                $this->relationLoaded('unit') && $this->unit,
                fn () => $this->unit->property_id
            ),
            'status' => $this->status,
            'started_at' => $this->started_at,
            'expires_at' => $this->expires_at,
            'payment_method_id' => $this->payment_method_id,
            'payment_plan_id' => $this->payment_plan_id,
            'payment_method' => $this->whenLoaded('paymentMethod', function () {
                return $this->paymentMethod->name;
            }),
            'payment_plan' => $this->whenLoaded('paymentPlan', function () {
                return $this->paymentPlan->name;
            }),
            'total_price' => $this->total_price,
            'base_price' => $this->base_price,
            'approved_discount_amount' => $this->approved_discount_amount,
            'approved_discount_percentage' => $this->approved_discount_percentage,
            'created_by' => $this->created_by,
            'down_payment' => $this->down_payment,
            'remaining_amount' => $this->remaining_amount,
            'currency' => $this->currency,
            'terms_accepted' => $this->terms_accepted,
            'privacy_accepted' => $this->privacy_accepted,
            'notes' => $this->notes,
            'cancel_reason_id' => $this->cancel_reason_id,
            'cancel_reason' => $this->whenLoaded('cancelReason'),
            'lead' => new LeadResource($this->whenLoaded('lead')),
            'unit' => new UnitResource($this->whenLoaded('unit')),
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'contracts' => $this->whenLoaded('contracts', function () {
                return ContractResource::collection($this->contracts);
            }),
            'contract' => $this->whenLoaded('contract', function () {
                return $this->contract ? new ContractResource($this->contract) : null;
            }),
        ];
    }
}
