<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class City extends Model
{
    use HasTranslations;

    protected $fillable = ['name', 'country_id'];

    public $translatable = ['name'];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
    public function municipalities()
    {
        return $this->hasMany(Municipality::class);
    }
}
