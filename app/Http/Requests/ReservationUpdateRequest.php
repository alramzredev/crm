<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservationUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'status' => 'nullable|in:draft,active,confirmed,expired,cancelled',
            'payment_method' => 'nullable|in:cash,bank_transfer,check',
            'payment_plan' => 'nullable|in:cash,installment,mortgage',
            'total_price' => 'nullable|numeric|min:0',
            'down_payment' => 'nullable|numeric|min:0',
            'remaining_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'notes' => 'nullable|string',
        ];
    }
}
