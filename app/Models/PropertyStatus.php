<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyStatus extends Model
{
    protected $fillable = ['name', 'description', 'reason'];

    public function properties()
    {
        return $this->hasMany(Property::class, 'status_id');
    }

    public function units()
    {
        return $this->hasMany(Unit::class, 'status_id');
    }
}
