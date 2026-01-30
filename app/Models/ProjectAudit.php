<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectAudit extends Model
{
    use HasFactory;

    protected $table = 'project_audit';

    protected $fillable = [
        'project_id',
        'row_checksum',
        'source_modified_on',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
