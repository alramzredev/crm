<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectUser extends Pivot
{
    protected $table = 'project_user';

    protected $fillable = [
        'project_id',
        'user_id',
        'role_in_project',
        'assigned_by',
        'assigned_at',
        'unassigned_at',
        'is_active',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'unassigned_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user who assigned this project role
     */
    public function assignedByUser()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * Get the user assigned to the project
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the project
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Scope to get active assignments only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->whereNull('unassigned_at');
    }

    /**
     * Scope to get inactive assignments
     */
    public function scopeInactive($query)
    {
        return $query->where('is_active', false)->orWhereNotNull('unassigned_at');
    }
}
