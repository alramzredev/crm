<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'customer_id',
        'contract_id',
        'reservation_id',
        'amount',
        'currency',
        'payment_method',
        'payment_type',
        'payment_date',
        'status',
        'reference_no',
        'notes',
        'created_by',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function receipts()
    {
        return $this->hasMany(PaymentReceipt::class);
    }
}
