<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Lead extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'title',
        'first_name',
        'last_name',
        'national_id',
        'email',
        'phone',
        'lead_source_id',
        'status_id',
        'national_address_file',
        'national_id_file',
        'created_by',
        'address',
        'city',
        'region',
        'country',
        'postal_code',
        'project_id',
    ];

    public function getNameAttribute()
    {
        return $this->first_name.' '.$this->last_name;
    }

    public function scopeOrderByName($query)
    {
        $query->orderBy('last_name')->orderBy('first_name');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('first_name', 'like', '%'.$search.'%')
                    ->orWhere('last_name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhereHas('project', function ($query) use ($search) {
                        $query->where('name', 'like', '%'.$search.'%');
                    });
            });
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        });
    }

    public function scopeFilterByUserRole($query, User $user)
    {
        if ($user->hasRole('sales_employee')) {
            $query->whereHas('activeAssignment', function ($q) use ($user) {
                $q->where('employee_id', $user->id);
            });
        } else if ($user->hasRole('sales_supervisor')) {
            $query->whereHas('project', function ($q) use ($user) {
                $q->whereIn('id', $user->activeProjects()->pluck('projects.id'));
            });
        }
    }

    public function leadSource()
    {
        return $this->belongsTo(LeadSource::class, 'lead_source_id');
    }

    public function status()
    {
        return $this->belongsTo(LeadStatus::class, 'status_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(LeadAssignment::class);
    }

    public function activeAssignment(): HasOne
    {
        return $this->hasOne(LeadAssignment::class)->where('is_active', true);
    }
}
