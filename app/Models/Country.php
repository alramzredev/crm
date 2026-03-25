<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Country extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name',
        'iso_code',
    ];

    public $translatable = ['name'];

    protected $casts = [
        'name' => 'array',
    ];

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
