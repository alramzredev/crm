<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StagingUnit extends Model
{
    use HasFactory;

    protected $table = 'staging_units';

    protected $fillable = [
        'import_batch_id',
        'row_number',
        'import_status',
        'error_message',
        'unit_uuid',
        'unit_code',
        'unit_external_id',
        'project_code',
        'property_code',
        'owner_name',
        'property_type_name',
        'unit_type_name',
        'status_name',
        'status_reason',
        'neighborhood',
        'floor',
        'area',
        'building_surface_area',
        'housh_area',
        'rooms',
        'wc_number',
        'parking_no',
        'price',
        'price_base',
        'currency',
        'exchange_rate',
        'model',
        'purpose',
        'instrument_no',
        'instrument_hijri_date',
        'instrument_no_after_sales',
        'has_balcony',
        'has_basement',
        'has_basement_parking',
        'has_big_housh',
        'has_small_housh',
        'has_housh',
        'has_big_roof',
        'has_small_roof',
        'has_roof',
        'has_rooftop',
        'has_pool',
        'has_pool_view',
        'has_tennis_view',
        'has_golf_view',
        'has_caffe_view',
        'has_waterfall',
        'has_elevator',
        'has_private_entrance',
        'has_two_interfaces',
        'has_security_system',
        'has_internet',
        'has_kitchen',
        'has_laundry_room',
        'has_internal_store',
        'has_warehouse',
        'has_living_room',
        'has_family_lounge',
        'has_big_lounge',
        'has_food_area',
        'has_council',
        'has_diwaniyah',
        'has_diwan1',
        'has_mens_council',
        'has_womens_council',
        'has_family_council',
        'has_maids_room',
        'has_drivers_room',
        'has_terrace',
        'has_outdoor',
        'unit_description_en',
        'national_address',
        'water_meter_no',
        'note',
        'created_by',
        'modified_by',
        'excel_modified_on',
    ];

    protected $casts = [
        'area' => 'decimal:2',
        'building_surface_area' => 'decimal:2',
        'housh_area' => 'decimal:2',
        'price' => 'decimal:2',
        'price_base' => 'decimal:2',
        'exchange_rate' => 'decimal:4',
        'rooms' => 'integer',
        'wc_number' => 'integer',
        'parking_no' => 'integer',
        'excel_modified_on' => 'datetime',
    ];

    public function batch()
    {
        return $this->belongsTo(ImportBatch::class, 'import_batch_id', 'batch_uuid');
    }
}
