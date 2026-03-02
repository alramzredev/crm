<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Contract extends Model
{
    use HasFactory;

    protected $table = 'contracts';

    protected $fillable = [
        'contract_code',
        'customer_id',
        'reservation_id',
        'project_id',
        'unit_id',
        'contract_date',
        'total_price',
        'currency',
        'status', // possible values: draft, pending_signature, active, completed, cancelled
        'notes',
        'created_by',
    ];

   protected static function booted()
{
    static::creating(function ($contract) {

        if (!empty($contract->contract_code)) {
            return;
        }

        $projectId = $contract->project_id ?? $contract->reservation?->unit?->project_id;

        if (!$projectId) {
            $projectCode = 'PRJ';
        } else {
            $projectCode = Project::where('id', $projectId)
                ->value('project_code') ?? 'PRJ';
        }

        $year = now()->year;

         $lastContract = self::where('project_id', $projectId)
            ->whereYear('contract_date', $year)
            ->orderByDesc('id')
            ->lockForUpdate()
            ->first();

        $nextSequence = 1;

        if ($lastContract) {
            preg_match('/(\d+)$/', $lastContract->contract_code, $matches);
            $nextSequence = isset($matches[1])
                ? ((int) $matches[1]) + 1
                : 1;
        }

        $contract->contract_code = sprintf(
            'CTR-%s-%d-%04d',
            $projectCode,
            $year,
            $nextSequence
        );
    });
}

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
