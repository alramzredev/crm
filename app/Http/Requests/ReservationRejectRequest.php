<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservationRejectRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'cancel_reason_id' => 'required|exists:reservation_cancel_reasons,id',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
