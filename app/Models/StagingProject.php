<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StagingProject extends Model
{
    use HasFactory;

    protected $table = 'staging_projects';

    protected $fillable = [
        'import_batch_id',
        'row_number',
        'import_status',
        'error_message',
        'project_code',
        'uuid',
        'name',
        'reservation_period_days',
        'reservation_duration_days',
        'owner_name',
        'city_name',
        'neighborhood',
        'location',
        'project_type_name',
        'status_name',
        'status_reason',
        'land_area',
        'built_up_area',
        'selling_space',
        'sellable_area_factor',
        'floor_area_ratio',
        'no_of_floors',
        'number_of_units',
        'budget',
        'warranty',
        'created_by',
        'updated_by',
    ];
}
