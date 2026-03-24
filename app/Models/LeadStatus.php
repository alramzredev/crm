<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class LeadStatus extends Model
{
    use HasTranslations;

    protected $table = 'lead_statuses';

    protected $fillable = [
        'name',
        'description',
        'color',
        'code',
    ];

    public $translatable = ['name', 'description'];

 

    public function leads()
    {
        return $this->hasMany(Lead::class, 'status_id');
    }

    public function findByCode($code)
    {
        return $this->where('code', $code)->first();
    }
}
