<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class ImportBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'batch_uuid',
        'import_type',
        'file_name',
        'status',
        'total_rows',
        'processed_rows',
        'failed_rows',
        'created_by',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'total_rows' => 'integer',
        'processed_rows' => 'integer',
        'failed_rows' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($batch) {
            if (empty($batch->batch_uuid)) {
                $batch->batch_uuid = (string) Str::uuid();
            }
        });
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function stagingProjects()
    {
        return $this->hasMany(StagingProject::class, 'import_batch_id', 'batch_uuid');
    }

    public function incrementProcessed()
    {
        $this->increment('processed_rows');
    }

    public function incrementFailed()
    {
        $this->increment('failed_rows');
    }

    public function markAsProcessing()
    {
        $this->update([
            'status' => 'processing',
            'started_at' => now(),
        ]);
    }

    public function markAsCompleted()
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function markAsFailed()
    {
        $this->update([
            'status' => 'failed',
            'completed_at' => now(),
        ]);
    }
}
