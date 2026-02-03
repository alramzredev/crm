<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservationStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'lead_id' => 'required|exists:leads,id',
            'unit_id' => 'required|exists:units,id',
            'status' => 'nullable|in:draft,active,confirmed,expired,canceled',
            'payment_method' => 'nullable|in:cash,bank_transfer,check',
            'payment_plan' => 'nullable|in:cash,installment,mortgage',
            'total_price' => 'nullable|numeric|min:0',
            'down_payment' => 'nullable|numeric|min:0',
            'remaining_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'terms_accepted' => 'required|accepted',
            'privacy_accepted' => 'required|accepted',
            'notes' => 'nullable|string',
        ];
    }
}
