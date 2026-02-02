<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UnitUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $unitId = $this->route('unit')->id ?? null;

        return [
            'unit_code' => ['nullable', 'string', 'max:100', 'unique:units,unit_code,' . $unitId],
            'unit_number' => ['nullable', 'string', 'max:50'],
            'unit_external_id' => ['nullable', 'string', 'max:50'],
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'property_type_id' => ['nullable', 'integer', 'exists:property_types,id'],
            'status_id' => ['nullable', 'integer', 'exists:property_statuses,id'],
            'neighborhood' => ['nullable', 'string', 'max:150'],
            'status_reason' => ['nullable', 'string', 'max:255'],
            'floor' => ['nullable', 'string', 'max:50'],
            'area' => ['nullable', 'numeric'],
            'building_surface_area' => ['nullable', 'numeric'],
            'housh_area' => ['nullable', 'numeric'],
            'rooms' => ['nullable', 'integer'],
            'wc_number' => ['nullable', 'integer'],
        ];
    }
}
