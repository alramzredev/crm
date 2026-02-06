<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadStatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            ['name' => 'New', 'description' => 'Newly created lead', 'color' => 'blue'],
            ['name' => 'Contacted', 'description' => 'Lead has been contacted', 'color' => 'yellow'],
            ['name' => 'Qualified', 'description' => 'Lead is qualified', 'color' => 'green'],
            ['name' => 'Unqualified', 'description' => 'Lead is not qualified', 'color' => 'red'],
            ['name' => 'Converted', 'description' => 'Lead converted to customer', 'color' => 'purple'],
        ];

        foreach ($statuses as $status) {
            DB::table('lead_statuses')->insertOrIgnore($status);
        }
    }
}
