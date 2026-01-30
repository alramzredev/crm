<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectStatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            ['name' => 'new'],
            ['name' => 'planning'],
            ['name' => 'in_progress'],
            ['name' => 'completed'],
            ['name' => 'cancelled'],
        ];

        DB::table('project_statuses')->insert($statuses);
    }
}
