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
        'uuid',
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
            if (empty($property->uuid)) {
                $property->uuid = (string) Str::uuid();
            }
            if (empty($property->property_code)) {
                $nextId = (static::withTrashed()->max('id') ?? 0) + 1;
                $property->property_code = 'Prop-' . str_pad((string) $nextId, 5, '0', STR_PAD_LEFT);
            }
        });

        static::created(function ($property) {
            $ownerId = $property->owner_id ?: optional($property->project)->owner_id;

            if (!$ownerId) {
                return;
            }

            if (!$property->owner_id) {
                $property->owner_id = $ownerId;
                $property->saveQuietly();
            }

            if (!$property->ownerships()->where('is_current', true)->exists()) {
                $property->ownerships()->create([
                    'owner_id' => $ownerId,
                    'started_at' => now(),
                    'is_current' => true,
                ]);
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

    public function ownerships()
    {
        return $this->hasMany(PropertyOwnership::class);
    }

    public function currentOwnership()
    {
        return $this->hasOne(PropertyOwnership::class)->where('is_current', true);
    }

    public function currentOwner()
    {
        return $this->hasOneThrough(
            Owner::class,
            PropertyOwnership::class,
            'property_id',
            'id',
            'id',
            'owner_id'
        )->where('property_ownerships.is_current', true);
    }

    /**
     * Get the user who created this property.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last modified this property.
     */
    public function modifier()
    {
        return $this->belongsTo(User::class, 'modified_by');
    }
}
