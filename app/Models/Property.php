<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_id',
        'property_code',
        'property_no',
        'project_id',
        'owner_id',
        'neighborhood_id',
        'status_id',
        'property_type',
        'property_class',
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
        'property_type_id',
        'property_class_id',
    ];

    protected $casts = [
        'total_square_meter' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::creating(function ($property) {
            if (empty($property->property_id)) {
                $property->property_id = (string) Str::uuid();
            }
        });
    }

    public function propertyType()
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function propertyClass()
    {
        return $this->belongsTo(PropertyClass::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }

    public function status()
    {
        return $this->belongsTo(PropertyStatus::class);
    }

    public function neighborhood()
    {
        return $this->belongsTo(Neighborhood::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }
}
