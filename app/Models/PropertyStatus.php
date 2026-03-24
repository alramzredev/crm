<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class PropertyStatus extends Model
{
    use HasTranslations;

    protected $fillable = ['name', 'description', 'reason', 'code'];

    public $translatable = ['name', 'description'];

 
     
   

    public function properties()
    {
        return $this->hasMany(Property::class, 'status_id');
    }

    public function units()
    {
        return $this->hasMany(Unit::class, 'status_id');
    }
}
