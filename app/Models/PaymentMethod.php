<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = ['code', 'name', 'is_active'];

    protected $casts = [
        'name' => 'array',
        'is_active' => 'boolean',
    ];

    public function getNameAttribute($value)
    {
        $names = $this->attributes['name'] ?? $value;
        $names = is_array($names) ? $names : json_decode($names, true);
        $locale = app()->getLocale();
        return $names[$locale] ?? ($names['en'] ?? $this->code);
    }
}
