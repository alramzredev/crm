<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use League\Glide\Server;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use SoftDeletes, Authenticatable, Authorizable, HasFactory, HasRoles;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'lead_capacity',
        'password',
        'photo_path',
    ];

    protected $casts = [
        'owner' => 'boolean',
        'lead_capacity' => 'integer',
    ];

    public function getNameAttribute()
    {
        return $this->first_name.' '.$this->last_name;
    }

    public function setPasswordAttribute($password)
    {
        if(!$password) return;

        $this->attributes['password'] = Hash::make($password);
    }

    public function setPhotoAttribute($photo)
    {
        if(!$photo) return;

        $this->attributes['photo_path'] = $photo instanceof UploadedFile ? $photo->store('users') : $photo;
    }

    public function getPhotoAttribute() {
        return $this->photoUrl(['w' => 40, 'h' => 40, 'fit' => 'crop']);
    }

    public function photoUrl(array $attributes)
    {
        if ($this->photo_path) {
            return URL::to(App::make(Server::class)->fromPath($this->photo_path, $attributes));
        }
    }

    public function isDemoUser()
    {
        return $this->email === 'johndoe@example.com';
    }

    public function scopeOrderByName($query)
    {
        $query->orderBy('last_name')->orderBy('first_name');
    }

    public function scopeWhereRole($query, $role)
    {
        switch ($role) {
            case 'user': return $query->where('owner', false);
            case 'owner': return $query->where('owner', true);
        }
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('first_name', 'like', '%'.$search.'%')
                    ->orWhere('last_name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%');
            });
        })->when($filters['role'] ?? null, function ($query, $role) {
            $query->whereRole($role);
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        });
    }

    /**
     * Supervisor → employees
     */
    public function salesEmployees()
    {
        return $this->belongsToMany(
            User::class,
            'sales_teams',
            'supervisor_id',
            'employee_id'
        )->withTimestamps();
    }

    /**
     * Employee → supervisor
     */
    public function supervisor()
    {
        return $this->belongsToMany(
            User::class,
            'sales_teams',
            'employee_id',
            'supervisor_id'
        )->withTimestamps();
    }

    /**
     * User → projects (many-to-many with role)
     */
    public function projects()
    {
        return $this->belongsToMany(
            Project::class,
            'project_user',
            'user_id',
            'project_id'
        )
        ->withPivot('role_in_project', 'assigned_by', 'assigned_at', 'unassigned_at', 'is_active')
        ->withTimestamps();
    }

  /**
 * Active project assignments only
 */
public function activeProjects()
{
    return $this->projects()
        ->wherePivot('is_active', true);
}


    /**
     * Get projects where user is project admin
     */
    public function managedProjects()
    {
        return $this->projects()
            ->wherePivot('role_in_project', 'project_admin')
            ->wherePivot('is_active', true);
    }

    /**
     * Get projects where user is sales manager
     */
    public function salesManagedProjects()
    {
        return $this->projects()
            ->wherePivot('role_in_project', 'sales_supervisor')
            ->wherePivot('is_active', true);
    }

    public function leadAssignments(): HasMany
    {
        return $this->hasMany(LeadAssignment::class, 'employee_id');
    }

    public function leadAssignmentsAssignedBy(): HasMany
    {
        return $this->hasMany(LeadAssignment::class, 'assigned_by');
    }

   
}
