<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UnitStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'unit_code' => ['nullable', 'string', 'max:100', 'unique:units,unit_code'],
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
            // All boolean fields
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
}
