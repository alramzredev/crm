<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UnitOwnership extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'owner_id',
        'contract_id',
        'started_at',
        'ended_at',
        'is_current',
    ];

    protected $casts = [
        'started_at' => 'date',
        'ended_at' => 'date',
        'is_current' => 'boolean',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
