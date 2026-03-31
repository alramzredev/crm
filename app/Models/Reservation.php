<?php

namespace App\Models;

use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Reservation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'reservation_code',
        'lead_id',
        'unit_id',
        'customer_id',
         'down_payment',
         'terms_accepted',
        'privacy_accepted',
        'status',
        'started_at',
        'expires_at',
        'cancel_reason_id',
        'notes',
        'created_by',
        'updated_by',
        'total_price',
        'base_price',
        'remaining_amount',
        'currency',
        'national_address_file',
        'national_id_file',
        'approved_discount_amount',
        'approved_discount_percentage',
        'payment_method_id',
         'payment_plan_id', 
    ];

    protected $casts = [
        'status' => ReservationStatus::class,
        'terms_accepted' => 'boolean',
        'privacy_accepted' => 'boolean',
        'down_payment' => 'decimal:2',
        'total_price' => 'decimal:2',
        'base_price' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
        'approved_discount_amount' => 'decimal:2',
        'approved_discount_percentage' => 'decimal:2',
    ];

    /**
     * Bootstrap the model and its events.
     * 
     * Automatically generates unique identifiers when creating a new reservation.
     */
    protected static function booted()
    {
        static::creating(function ($reservation) {
            // Generate UUID for unique identification
            if (empty($reservation->uuid)) {
                $reservation->uuid = (string) Str::uuid();
            }
            
            // Generate human-readable reservation code if not provided
            if (empty($reservation->reservation_code)) {
                $nextId = (static::withTrashed()->max('id') ?? 0) + 1;
                $reservation->reservation_code = 'Res-' . str_pad((string) $nextId, 6, '0', STR_PAD_LEFT);
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

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    /**
     * Shortcut: get the latest contract (if any)
     */
    public function contract()
    {
        return $this->hasOne(Contract::class)->latestOfMany();
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function creator()
    {
        return $this->createdBy();
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function discountRequests()
    {
        return $this->hasMany(ReservationDiscountRequest::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    public function paymentPlan()
    {
        return $this->belongsTo(PaymentPlan::class, 'payment_plan_id');
    }

    public function scopeForUser($query, User $user)
    {
        // Super Admin: No restrictions
        if ($user->hasRole('super_admin')) {
            return $query;
        }

        // Project Admin: Reservations from their managed projects
        if ($user->hasRole('project_admin')) {
            return $query->whereHas('unit.project', function ($q) use ($user) {
                $q->whereHas('users', function ($q2) use ($user) {
                    $q2->where('project_user.user_id', $user->id);
                });
            });
        }

        // Sales Supervisor: Reservations created by them or their team members
        if ($user->hasRole('sales_supervisor')) {
            return $query->where(function ($q) use ($user) {
                // Reservations created by the supervisor themselves
                $q->where('created_by', $user->id)
                  // OR reservations created by their team members
                  ->orWhereHas('createdBy.supervisor', function ($q2) use ($user) {
                      $q2->where('supervisor_id', $user->id);
                  });
            });
        }

        // Sales Employee: Only their own reservations
        if ($user->hasRole('sales_employee')) {
            return $query->whereHas('lead.activeAssignment', function ($q) use ($user) {
                $q->where('employee_id', $user->id);
            });
        }

        // No access for unknown roles
        return $query->whereRaw('1 = 0');
    }
}
