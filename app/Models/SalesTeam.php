<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SalesTeam extends Model
{
    use HasFactory;

    protected $fillable = [
        'supervisor_id',
        'employee_id',
    ];

    /**
     * Get the supervisor (user) for this sales team relationship.
     */
    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    /**
     * Get the employee (user) for this sales team relationship.
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
