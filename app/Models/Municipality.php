<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Municipality extends Model
{
    use HasTranslations;

    protected $fillable = ['city_id', 'name'];

    public $translatable = ['name'];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function neighborhoods()
    {
        return $this->hasMany(Neighborhood::class);
    }
}
