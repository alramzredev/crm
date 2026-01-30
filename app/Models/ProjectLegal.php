<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectLegal extends Model
{
    use HasFactory;

    protected $table = 'project_legal';

    protected $fillable = [
        'project_id',
        'title_deed_status',
        'construction_license_status',
        'soil_test_report_status',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
