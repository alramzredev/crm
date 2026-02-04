<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitStatus extends Model
{
    protected $fillable = ['name', 'description'];

    public function units()
    {
        return $this->hasMany(Unit::class, 'status_id');
    }
}
