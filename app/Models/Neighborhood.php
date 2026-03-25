<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Neighborhood extends Model
{
    use HasTranslations;

    protected $fillable = ['municipality_id', 'name'];

    public $translatable = ['name'];

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }
}
