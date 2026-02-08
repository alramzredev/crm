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
        'uuid',
        'project_code',
        'name',
        'reservation_period_days',
        'owner_id',
        'city_id',
        'municipality_id',
        'neighborhood_id',
        'location',
        'project_type_id',
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
            if (empty($project->uuid)) {
                $project->uuid = (string) Str::uuid();
            }
            if (empty($project->project_code)) {
                $project->project_code = 'PRJ-' . strtoupper(Str::random(6));
            }
        });

        static::created(function ($project) {
            if (!$project->owner_id) {
                return;
            }

            if (!$project->ownerships()->where('is_current', true)->exists()) {
                $project->ownerships()->create([
                    'owner_id' => $project->owner_id,
                    'started_at' => now(),
                    'is_current' => true,
                ]);
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

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function neighborhood()
    {
        return $this->belongsTo(Neighborhood::class);
    }

    public function projectType()
    {
        return $this->belongsTo(ProjectType::class, 'project_type_id');
    }

    public function ownership()
    {
        return $this->belongsTo(ProjectOwnership::class, 'project_ownership_id');
    }

    public function ownerships()
    {
        return $this->hasMany(ProjectOwnership::class);
    }

    public function currentOwnership()
    {
        return $this->hasOne(ProjectOwnership::class)->where('is_current', true);
    }

    public function currentOwner()
    {
        return $this->hasOneThrough(
            Owner::class,
            ProjectOwnership::class,
            'project_id',
            'id',
            'id',
            'owner_id'
        )->where('project_ownerships.is_current', true);
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

    /**
     * Get the user who created this project.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this project.
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Project → users (many-to-many with role)
     * Used to determine project visibility
     */
    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'project_user',
            'project_id',
            'user_id'
        )
        ->withPivot('role_in_project', 'assigned_by', 'assigned_at', 'unassigned_at', 'is_active')
        ->withTimestamps();
    }

    /**
     * Get active project assignments
     */
    public function activeUsers()
    {
        return $this->users()
            ->where('project_user.is_active', true)
            ->wherePivot('is_active', true);
    }

    /**
     * Get project managers
     */
    public function projectManagers()
    {
        return $this->users()
            ->wherePivot('role_in_project', 'project_manager')
            ->wherePivot('is_active', true);
    }

    /**
     * Get sales managers
     */
    public function salesManagers()
    {
        return $this->users()
            ->wherePivot('role_in_project', 'sales_manager')
            ->wherePivot('is_active', true);
    }

    /**
     * Get sales supervisors
     */
    public function salesSupervisors()
    {
        return $this->users()
            ->wherePivot('role_in_project', 'sales_supervisor')
            ->wherePivot('is_active', true);
    }

    /**
     * Get sales employees
     */
    public function salesEmployees()
    {
        return $this->users()
            ->wherePivot('role_in_project', 'sales_employee')
            ->wherePivot('is_active', true);
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

    public function scopeFilterByUserRole($query, User $user)
    {
        // Super Admin: No restrictions
        if ($user->hasRole('super_admin')) {
            return $query;
        }

        // For all other roles, filter by active project assignments
        return $query->whereHas('users', function ($q) use ($user) {
            $q->where('project_user.user_id', $user->id)
              ->where('project_user.is_active', true);
        });
    }

    /* ===========================
       VISIBILITY RULES
       =========================== 
       
       Projects are visible by ROLE + ASSIGNMENT:
       
       1️⃣ Super Admin
          Sees: ALL projects
          SQL: No filter
       
       2️⃣ Project Manager
          Sees: Projects where assigned as project_manager
          SQL: JOIN project_user WHERE role_in_project = 'project_manager'
       
       3️⃣ Sales Supervisor
          Sees: Projects where assigned as sales_supervisor
          SQL: JOIN project_user WHERE role_in_project = 'sales_supervisor'
       
       4️⃣ Sales Employee
          Sees: Projects where assigned as sales_employee
          SQL: JOIN project_user WHERE role_in_project = 'sales_employee'
          Note: Only for context (leads, reservations)
       
       === */
}
