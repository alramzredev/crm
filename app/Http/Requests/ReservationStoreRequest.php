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
            'first_name' => 'required|string|max:25',
            'last_name' => 'required|string|max:25',
            'email' => 'nullable|email|max:50',
            'phone' => 'nullable|string|max:50',
            'national_id' => 'required|string|max:50',
            'status' => 'nullable|in:draft,active,confirmed,expired,cancelled',
            'payment_method' => 'nullable|in:cash,bank_transfer,check',
            'payment_plan' => 'nullable|in:cash,installment,mortgage',
            'total_price' => 'nullable|numeric|min:0',
            'down_payment' => 'nullable|numeric|min:0',
            'remaining_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'national_address_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
            'national_id_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
            'terms_accepted' => 'nullable|boolean',
            'privacy_accepted' => 'nullable|boolean',
            'redirect_to_edit' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ];
    }
}
