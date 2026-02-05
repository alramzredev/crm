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
            'unit_external_id' => ['nullable', 'string', 'max:50'],
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'property_type_id' => ['nullable', 'integer', 'exists:property_types,id'],
            'status_id' => ['nullable', 'integer', 'exists:unit_statuses,id'],
            'neighborhood' => ['nullable', 'string', 'max:150'],
            'status_reason' => ['nullable', 'string', 'max:255'],
            'floor' => ['nullable', 'string', 'max:50'],
            'area' => ['nullable', 'numeric'],
            'building_surface_area' => ['nullable', 'numeric'],
            'housh_area' => ['nullable', 'numeric'],
            'rooms' => ['nullable', 'integer'],
            'wc_number' => ['nullable', 'integer'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'price_base' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'exchange_rate' => ['nullable', 'numeric'],
            'model' => ['nullable', 'string', 'max:100'],
            'purpose' => ['nullable', 'string', 'max:100'],
            'unit_type' => ['nullable', 'string', 'max:100'],
            'owner' => ['nullable', 'string', 'max:150'],
            'instrument_no' => ['nullable', 'string', 'max:100'],
            'instrument_hijri_date' => ['nullable', 'string', 'max:50'],
            'instrument_no_after_sales' => ['nullable', 'string', 'max:100'],
            'unit_description_en' => ['nullable', 'string'],
            'national_address' => ['nullable', 'string'],
            'water_meter_no' => ['nullable', 'string', 'max:50'],
            'has_balcony' => ['nullable', 'boolean'],
            'has_basement' => ['nullable', 'boolean'],
            'has_basement_parking' => ['nullable', 'boolean'],
            'has_big_housh' => ['nullable', 'boolean'],
            'has_small_housh' => ['nullable', 'boolean'],
            'has_housh' => ['nullable', 'boolean'],
            'has_big_roof' => ['nullable', 'boolean'],
            'has_small_roof' => ['nullable', 'boolean'],
            'has_roof' => ['nullable', 'boolean'],
            'has_rooftop' => ['nullable', 'boolean'],
            'has_pool' => ['nullable', 'boolean'],
            'has_pool_view' => ['nullable', 'boolean'],
            'has_tennis_view' => ['nullable', 'boolean'],
            'has_golf_view' => ['nullable', 'boolean'],
            'has_caffe_view' => ['nullable', 'boolean'],
            'has_waterfall' => ['nullable', 'boolean'],
            'has_elevator' => ['nullable', 'boolean'],
            'has_private_entrance' => ['nullable', 'boolean'],
            'has_two_interfaces' => ['nullable', 'boolean'],
            'has_security_system' => ['nullable', 'boolean'],
            'has_internet' => ['nullable', 'boolean'],
            'has_kitchen' => ['nullable', 'boolean'],
            'has_laundry_room' => ['nullable', 'boolean'],
            'has_internal_store' => ['nullable', 'boolean'],
            'has_warehouse' => ['nullable', 'boolean'],
            'has_living_room' => ['nullable', 'boolean'],
            'has_family_lounge' => ['nullable', 'boolean'],
            'has_big_lounge' => ['nullable', 'boolean'],
            'has_food_area' => ['nullable', 'boolean'],
            'has_council' => ['nullable', 'boolean'],
            'has_diwaniyah' => ['nullable', 'boolean'],
            'has_diwan1' => ['nullable', 'boolean'],
            'has_mens_council' => ['nullable', 'boolean'],
            'has_womens_council' => ['nullable', 'boolean'],
            'has_family_council' => ['nullable', 'boolean'],
            'has_maids_room' => ['nullable', 'boolean'],
            'has_drivers_room' => ['nullable', 'boolean'],
            'has_terrace' => ['nullable', 'boolean'],
            'has_outdoor' => ['nullable', 'boolean'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'has_balcony' => $this->boolean('has_balcony'),
            'has_basement' => $this->boolean('has_basement'),
            'has_basement_parking' => $this->boolean('has_basement_parking'),
            'has_big_housh' => $this->boolean('has_big_housh'),
            'has_small_housh' => $this->boolean('has_small_housh'),
            'has_housh' => $this->boolean('has_housh'),
            'has_big_roof' => $this->boolean('has_big_roof'),
            'has_small_roof' => $this->boolean('has_small_roof'),
            'has_roof' => $this->boolean('has_roof'),
            'has_rooftop' => $this->boolean('has_rooftop'),
            'has_pool' => $this->boolean('has_pool'),
            'has_pool_view' => $this->boolean('has_pool_view'),
            'has_tennis_view' => $this->boolean('has_tennis_view'),
            'has_golf_view' => $this->boolean('has_golf_view'),
            'has_caffe_view' => $this->boolean('has_caffe_view'),
            'has_waterfall' => $this->boolean('has_waterfall'),
            'has_elevator' => $this->boolean('has_elevator'),
            'has_private_entrance' => $this->boolean('has_private_entrance'),
            'has_two_interfaces' => $this->boolean('has_two_interfaces'),
            'has_security_system' => $this->boolean('has_security_system'),
            'has_internet' => $this->boolean('has_internet'),
            'has_kitchen' => $this->boolean('has_kitchen'),
            'has_laundry_room' => $this->boolean('has_laundry_room'),
            'has_internal_store' => $this->boolean('has_internal_store'),
            'has_warehouse' => $this->boolean('has_warehouse'),
            'has_living_room' => $this->boolean('has_living_room'),
            'has_family_lounge' => $this->boolean('has_family_lounge'),
            'has_big_lounge' => $this->boolean('has_big_lounge'),
            'has_food_area' => $this->boolean('has_food_area'),
            'has_council' => $this->boolean('has_council'),
            'has_diwaniyah' => $this->boolean('has_diwaniyah'),
            'has_diwan1' => $this->boolean('has_diwan1'),
            'has_mens_council' => $this->boolean('has_mens_council'),
            'has_womens_council' => $this->boolean('has_womens_council'),
            'has_family_council' => $this->boolean('has_family_council'),
            'has_maids_room' => $this->boolean('has_maids_room'),
            'has_drivers_room' => $this->boolean('has_drivers_room'),
            'has_terrace' => $this->boolean('has_terrace'),
            'has_outdoor' => $this->boolean('has_outdoor'),
        ]);
    }
}
