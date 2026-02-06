<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentReceipt extends Model
{
    use HasFactory;

    protected $table = 'payment_receipts';

    protected $fillable = [
        'payment_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'mime_type',
        'receipt_number',
        'notes',
        'uploaded_by',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
