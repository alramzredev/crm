<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Owner extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = ['name', 'type', 'phone', 'email'];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
