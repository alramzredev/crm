<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Unit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'unit_uuid',
        'unit_code',
        'unit_number',
        'unit_external_id',
        'project_id',
        'property_id',
        'property_type_id',
        'status_id',
        'neighborhood',
        'status_reason',
        'floor',
        'area',
        'building_surface_area',
        'housh_area',
        'rooms',
        'wc_number',
        'price',
        'price_base',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'area' => 'decimal:2',
        'building_surface_area' => 'decimal:2',
        'housh_area' => 'decimal:2',
        'price' => 'decimal:2',
        'price_base' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::creating(function ($unit) {
            if (empty($unit->unit_uuid)) {
                $unit->unit_uuid = (string) Str::uuid();
            }
        });
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function propertyType()
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function status()
    {
        return $this->belongsTo(UnitStatus::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    /**
     * Get the user who created this unit.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last modified this unit.
     */
    public function modifier()
    {
        return $this->belongsTo(User::class, 'modified_by');
    }
}
