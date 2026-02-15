<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReservationDiscountRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'requested_by',
        'original_price',
        'requested_price',
        'discount_amount',
        'discount_percentage',
        'reason',
        'status',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    protected $casts = [
        'original_price' => 'decimal:2',
        'requested_price' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'reviewed_at' => 'datetime',
    ];

    // Relations

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
