<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'amount' => 'sometimes|numeric|min:0.01',
            'payment_method' => 'sometimes|in:cash,bank_transfer,check',
            'payment_date' => 'sometimes|date',
            'reference_no' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'payment_receipts' => 'nullable|array',
            'payment_receipts.*' => 'file|mimes:pdf,jpg,jpeg,png|max:5120',
        ];
    }
}
