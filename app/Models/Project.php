<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'projects';

    protected $fillable = [
        'project_id',
        'project_code',
        'name',
        'owner_id',
        'city_id',
        'neighborhood',
        'location',
        'project_type_id',
        'project_ownership_id',
        'status_id',
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

    protected $casts = [
        'land_area' => 'decimal:2',
        'built_up_area' => 'decimal:2',
        'selling_space' => 'decimal:2',
        'sellable_area_factor' => 'decimal:2',
        'floor_area_ratio' => 'decimal:2',
        'warranty' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($project) {
            if (empty($project->project_id)) {
                $project->project_id = (string) Str::uuid();
            }
            if (empty($project->project_code)) {
                $project->project_code = 'PRJ-' . strtoupper(Str::random(6));
            }
        });
    }

    // Relations
    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function projectType()
    {
        return $this->belongsTo(ProjectType::class, 'project_type_id');
    }

    public function ownership()
    {
        return $this->belongsTo(ProjectOwnership::class, 'project_ownership_id');
    }

    public function status()
    {
        return $this->belongsTo(ProjectStatus::class, 'status_id');
    }

    public function contracts()
    {
        return $this->hasMany(ProjectContract::class);
    }

    public function legal()
    {
        return $this->hasOne(ProjectLegal::class);
    }

    public function assets()
    {
        return $this->hasOne(ProjectAsset::class);
    }

    public function audits()
    {
        return $this->morphMany(Audit::class, 'auditable');
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    // Filtering scope
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($q2) use ($search) {
                $q2->where('name', 'like', "%{$search}%")
                   ->orWhere('project_code', 'like', "%{$search}%");
            });
        })->when($filters['trashed'] ?? null, function ($q, $trashed) {
            if ($trashed === 'with') {
                $q->withTrashed();
            } elseif ($trashed === 'only') {
                $q->onlyTrashed();
            }
        })->when($filters['status_id'] ?? null, function ($q, $status) {
            $q->where('status_id', $status);
        })->when($filters['owner_id'] ?? null, function ($q, $owner) {
            $q->where('owner_id', $owner);
        });
    }
}
