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
        'unit_external_id',
        'project_id',
        'property_id',
        'property_type_id',
        'status_id',
        'neighborhood_id',
        'status_reason',
        'floor',
        'area',
        'building_surface_area',
        'housh_area',
        'rooms',
        'wc_number',
        'price',
        'price_base',
        'currency',
        'exchange_rate',
        'model',
        'purpose',
        'unit_type',
        'owner',
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
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'area' => 'decimal:2',
        'building_surface_area' => 'decimal:2',
        'housh_area' => 'decimal:2',
        'price' => 'decimal:2',
        'price_base' => 'decimal:2',
        'exchange_rate' => 'decimal:4',
        'has_balcony' => 'boolean',
        'has_basement' => 'boolean',
        'has_basement_parking' => 'boolean',
        'has_big_housh' => 'boolean',
        'has_small_housh' => 'boolean',
        'has_housh' => 'boolean',
        'has_big_roof' => 'boolean',
        'has_small_roof' => 'boolean',
        'has_roof' => 'boolean',
        'has_rooftop' => 'boolean',
        'has_pool' => 'boolean',
        'has_pool_view' => 'boolean',
        'has_tennis_view' => 'boolean',
        'has_golf_view' => 'boolean',
        'has_caffe_view' => 'boolean',
        'has_waterfall' => 'boolean',
        'has_elevator' => 'boolean',
        'has_private_entrance' => 'boolean',
        'has_two_interfaces' => 'boolean',
        'has_security_system' => 'boolean',
        'has_internet' => 'boolean',
        'has_kitchen' => 'boolean',
        'has_laundry_room' => 'boolean',
        'has_internal_store' => 'boolean',
        'has_warehouse' => 'boolean',
        'has_living_room' => 'boolean',
        'has_family_lounge' => 'boolean',
        'has_big_lounge' => 'boolean',
        'has_food_area' => 'boolean',
        'has_council' => 'boolean',
        'has_diwaniyah' => 'boolean',
        'has_diwan1' => 'boolean',
        'has_mens_council' => 'boolean',
        'has_womens_council' => 'boolean',
        'has_family_council' => 'boolean',
        'has_maids_room' => 'boolean',
        'has_drivers_room' => 'boolean',
        'has_terrace' => 'boolean',
        'has_outdoor' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($unit) {
            if (empty($unit->unit_uuid)) {
                $unit->unit_uuid = (string) Str::uuid();
            }
            if (empty($unit->unit_code)) {
                $nextId = (static::withTrashed()->max('id') ?? 0) + 1;
                $unit->unit_code = 'Unit-' . str_pad((string) $nextId, 6, '0', STR_PAD_LEFT);
            }
        });

        static::created(function ($unit) {
            $ownerId = optional($unit->property)->owner_id;

            if (!$ownerId) {
                return;
            }

            if (!$unit->ownerships()->where('is_current', true)->exists()) {
                $unit->ownerships()->create([
                    'owner_id' => $ownerId,
                    'started_at' => now(),
                    'is_current' => true,
                ]);
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

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function neighborhood()
    {
        return $this->belongsTo(Neighborhood::class);
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

    public function ownerships()
    {
        return $this->hasMany(UnitOwnership::class);
    }

    public function currentOwnership()
    {
        return $this->hasOne(UnitOwnership::class)->where('is_current', true);
    }

    public function currentOwner()
    {
        return $this->hasOneThrough(
            Owner::class,
            UnitOwnership::class,
            'unit_id',
            'id',
            'id',
            'owner_id'
        )->where('unit_ownerships.is_current', true);
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

    public function scopeAvailable($query)
    {
        return $query->where('status_id', 1);
    }
}
