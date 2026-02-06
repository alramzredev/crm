<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeadRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => ['nullable', 'string', 'max:20'],
            'first_name' => ['required', 'string', 'max:25'],
            'last_name' => ['required', 'string', 'max:25'],
            'national_id' => ['nullable', 'string', 'max:50'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'lead_source_id' => ['nullable', 'integer'],
            'status_id' => ['nullable', 'integer', 'exists:lead_statuses,id'],
            'employee_id' => ['nullable', 'integer', 'exists:users,id'],
            'email' => ['nullable', 'email', 'max:50'],
            'phone' => ['nullable', 'string', 'max:50'],
            'national_address_file' => ['nullable', 'file'],
            'national_id_file' => ['nullable', 'file'],
            'address' => ['nullable', 'string', 'max:150'],
            'city' => ['nullable', 'string', 'max:50'],
            'region' => ['nullable', 'string', 'max:50'],
            'country' => ['nullable', 'string', 'max:2'],
            'postal_code' => ['nullable', 'string', 'max:25'],
        ];
    }
}
