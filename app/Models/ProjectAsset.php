<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectAsset extends Model
{
    use HasFactory;

    protected $table = 'project_assets';

    protected $fillable = [
        'project_id',
        'renders_high_quality',
        'free_maintenance',
        'timetable',
    ];

    protected $casts = [
        'renders_high_quality' => 'boolean',
        'free_maintenance' => 'boolean',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
