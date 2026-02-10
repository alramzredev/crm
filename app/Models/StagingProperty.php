<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StagingProperty extends Model
{
    use HasFactory;

    protected $table = 'staging_properties';

    protected $fillable = [
        'import_batch_id',
        'row_number',
        'import_status',
        'error_message',
        'uuid',
        'property_code',
        'property_no',
        'project_code',
        'owner_name',
        'property_type_name',
        'property_class_name',
        'status_name',
        'city_name',
        'neighborhood_name',
        'diagram_number',
        'instrument_no',
        'license_no',
        'lot_no',
        'total_square_meter',
        'total_units',
        'count_available',
        'notes',
        'created_by',
        'modified_by',
        'row_checksum',
    ];

    protected $casts = [
        'row_number' => 'integer',
        'property_no' => 'integer',
        'total_square_meter' => 'decimal:2',
        'total_units' => 'integer',
        'count_available' => 'integer',
    ];

    public function batch()
    {
        return $this->belongsTo(ImportBatch::class, 'import_batch_id', 'batch_uuid');
    }
}
