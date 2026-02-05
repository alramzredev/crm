<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'project_code' => ['required', 'string', 'max:100', 'unique:projects,project_code'],
            'name' => ['required', 'string', 'max:255'],
            'reservation_period_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'owner_id' => ['nullable', 'integer', 'exists:owners,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'neighborhood' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string'],
            'project_type_id' => ['nullable', 'integer', 'exists:project_types,id'],
            'project_ownership_id' => ['nullable', 'integer', 'exists:project_ownerships,id'],
            'status_id' => ['nullable', 'integer', 'exists:project_statuses,id'],
            'status_reason' => ['nullable', 'string', 'max:255'],
            'land_area' => ['nullable', 'numeric'],
            'built_up_area' => ['nullable', 'numeric'],
            'selling_space' => ['nullable', 'numeric'],
            'sellable_area_factor' => ['nullable', 'numeric'],
            'floor_area_ratio' => ['nullable', 'numeric'],
            'budget' => ['nullable', 'numeric'],
            'no_of_floors' => ['nullable', 'integer'],
            'number_of_units' => ['nullable', 'integer'],
            'warranty' => ['nullable', 'boolean'],
        ];
    }
}
