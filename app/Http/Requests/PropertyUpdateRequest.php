<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PropertyUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'property_code' => ['nullable', 'string', 'max:100', 'unique:properties,property_code,' . $this->route('property')->id],
            'property_no' => ['nullable', 'string', 'max:150'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'owner_id' => ['nullable', 'integer', 'exists:owners,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'municipality_id' => ['nullable', 'integer', 'exists:municipalities,id'],
            'neighborhood_id' => ['nullable', 'integer', 'exists:neighborhoods,id'],
            'status_id' => ['nullable', 'integer', 'exists:property_statuses,id'],
            'property_type_id' => ['nullable', 'integer', 'exists:property_types,id'],
            'property_class_id' => ['nullable', 'integer', 'exists:property_classes,id'],
            'diagram_number' => ['nullable', 'string', 'max:100'],
            'instrument_no' => ['nullable', 'string', 'max:100'],
            'license_no' => ['nullable', 'string', 'max:100'],
            'lot_no' => ['nullable', 'string', 'max:100'],
            'total_square_meter' => ['nullable', 'numeric'],
            'total_units' => ['nullable', 'integer'],
            'count_available' => ['nullable', 'integer'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
