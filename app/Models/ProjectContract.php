<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectContract extends Model
{
    use HasFactory;

    protected $table = 'project_contracts';

    protected $fillable = [
        'project_id',
        'contract_type',
        'status',
        'notes',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
