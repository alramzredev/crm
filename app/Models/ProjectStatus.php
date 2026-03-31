<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Translatable\HasTranslations;

class ProjectStatus extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = ['name', 'code'];

    public $translatable = ['name'];

 
   
    public function projects()
    {
        return $this->hasMany(Project::class, 'status_id');
    }
}
