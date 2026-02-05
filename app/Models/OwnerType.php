<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OwnerType extends Model
{
    use HasFactory;

    protected $table = 'owner_types';

    protected $fillable = ['name'];

    public function projects()
    {
        return $this->hasMany(Project::class, 'owner_type_id');
    }
}
