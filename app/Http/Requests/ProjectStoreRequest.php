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
        $langs = config('app.available_languages', ['en', 'ar']);
        $nameRules = [];
        $locationRules = [];
        foreach ($langs as $lang) {
            $nameRules["name.$lang"] = ['required', 'string', 'max:255'];
            $locationRules["location.$lang"] = ['required', 'string', 'max:255'];
        }
        return array_merge([
            'project_code' => ['nullable', 'string', 'max:100', 'unique:projects,project_code'],
            'name' => $nameRules,
            'location' => $locationRules,
            'reservation_period_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'owner_id' => ['nullable', 'integer', 'exists:owners,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'municipality_id' => ['nullable', 'integer', 'exists:municipalities,id'],
            'neighborhood_id' => ['nullable', 'integer', 'exists:neighborhoods,id'],
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
        ], $nameRules, $locationRules, [
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
        ]);
    }

    public function messages()
    {
        $langs = config('app.available_languages', ['en', 'ar']);
        $messages = [];
        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The project name ($lang) is required.";
            $messages["name.$lang.max"] = "The project name ($lang) may not be greater than 255 characters.";
            $messages["location.$lang.required"] = "The project location ($lang) is required.";
            $messages["location.$lang.max"] = "The project location ($lang) may not be greater than 255 characters.";
        }
        return array_merge($messages, [
            'name.required' => 'The project name is required.',
            'name.max' => 'The project name may not be greater than 255 characters.',
            'project_code.unique' => 'This project code is already in use.',
            'project_code.max' => 'The project code may not be greater than 100 characters.',
            'reservation_period_days.integer' => 'The reservation period must be a number.',
            'reservation_period_days.min' => 'The reservation period must be at least 1 day.',
            'reservation_period_days.max' => 'The reservation period may not exceed 365 days.',
            'owner_id.exists' => 'The selected owner is invalid.',
            'city_id.exists' => 'The selected city is invalid.',
            'project_type_id.exists' => 'The selected project type is invalid.',
            'status_id.exists' => 'The selected status is invalid.',
            'budget.numeric' => 'The budget must be a valid number.',
            'no_of_floors.integer' => 'The number of floors must be a whole number.',
            'number_of_units.integer' => 'The number of units must be a whole number.',
            'land_area.numeric' => 'The land area must be a valid number.',
            'built_up_area.numeric' => 'The built up area must be a valid number.',
            'selling_space.numeric' => 'The selling space must be a valid number.',
            'sellable_area_factor.numeric' => 'The sellable area factor must be a valid number.',
            'floor_area_ratio.numeric' => 'The floor area ratio must be a valid number.',
        ]);
    }
}
