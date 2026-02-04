<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentPlan;
use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Reservation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reservation_code',
        'lead_id',
        'unit_id',
        'customer_id',
        'payment_method',
        'down_payment',
        'payment_plan',
        'terms_accepted',
        'privacy_accepted',
        'status',
        'cancel_reason_id',
        'notes',
        'created_by',
        'updated_by',
        'total_price',
        'remaining_amount',
        'currency',
        'national_address_file',
        'national_id_file',
    ];

    protected $casts = [
        'payment_method' => PaymentMethod::class,
        'payment_plan' => PaymentPlan::class,
        'status' => ReservationStatus::class,
        'terms_accepted' => 'boolean',
        'privacy_accepted' => 'boolean',
        'down_payment' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::creating(function ($reservation) {
            if (empty($reservation->reservation_code)) {
                $reservation->reservation_code = (string) Str::uuid();
            }
        });
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function cancelReason()
    {
        return $this->belongsTo(ReservationCancelReason::class, 'cancel_reason_id');
    }

    public function contract()
    {
        return $this->hasOne(Contract::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
