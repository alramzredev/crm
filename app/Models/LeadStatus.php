<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadStatus extends Model
{
    protected $table = 'lead_statuses';

    protected $fillable = [
        'name',
        'description',
        'color',
        'code', // Added code field
    ];

    public function leads()
    {
        return $this->hasMany(Lead::class, 'status_id');
    }

    public function findByCode($code)
    {
        return $this->where('code', $code)->first();
    }
}
