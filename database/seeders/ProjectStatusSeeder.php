<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectStatusSeeder extends Seeder
{
    public function run()
    {
        DB::table('project_statuses')->upsert([
            ['name' => 'New', 'code' => 'new'],
            ['name' => 'Planing', 'code' => 'planning'],
            ['name' => 'In progress', 'code' => 'in_progress'],
            ['name' => 'Completed', 'code' => 'completed'],
            ['name' => 'Canceled', 'code' => 'canceled'],
            ['name' => 'Active', 'code' => 'active'],
        ], ['name'], ['code']);
    }
}
