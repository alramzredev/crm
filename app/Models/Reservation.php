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
        'uuid',
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
        'started_at',
        'expires_at',
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
        'total_price' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
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

    public function scopeFilterByUserRole($query, User $user)
    {
        // Super Admin: No restrictions
        if ($user->hasRole('super_admin')) {
            return $query;
        }

        // Project Manager: Reservations from their managed projects
        if ($user->hasRole('project_manager')) {
            return $query->whereHas('unit.project.users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->wherePivot('role_in_project', 'project_manager')
                  ->wherePivot('is_active', true);
            });
        }

        // Sales Supervisor: Reservations from their supervised projects
        if ($user->hasRole('sales_supervisor')) {
            return $query->whereHas('unit.project.users', function ($q) use ($user) {
                $q->where('project_user.user_id', $user->id)
                  ->wherePivot('role_in_project', 'sales_supervisor')
                  ->wherePivot('is_active', true);
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
