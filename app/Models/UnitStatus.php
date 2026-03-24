<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class UnitStatus extends Model
{
    use HasTranslations;

    protected $fillable = ['name', 'description', 'code'];

    public $translatable = ['name', 'description'];

 
    
    public function units()
    {
        return $this->hasMany(Unit::class, 'status_id');
    }
}
