<?php

namespace Database\Factories;

use App\Models\SalesTeam;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SalesTeamFactory extends Factory
{
    protected $model = SalesTeam::class;

    public function definition()
    {
        return [
            'supervisor_id' => User::factory(),
            'employee_id' => User::factory(),
        ];
    }
}
