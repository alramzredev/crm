<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Owner extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = ['name', 'phone', 'email', 'owner_type_id'];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function ownerType()
    {
        return $this->belongsTo(OwnerType::class, 'owner_type_id');
    }

    public function projectOwnerships()
    {
        return $this->hasMany(ProjectOwnership::class);
    }

    public function propertyOwnerships()
    {
        return $this->hasMany(PropertyOwnership::class);
    }

    public function unitOwnerships()
    {
        return $this->hasMany(UnitOwnership::class);
    }
}
