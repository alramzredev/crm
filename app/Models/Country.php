<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model
{
    use HasTranslations, SoftDeletes;

    protected $fillable = [
        'name',
        'iso_code',
    ];

    public $translatable = ['name'];

    protected $casts = [
        'name' => 'array',
    ];

    protected $dates = ['deleted_at'];

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
