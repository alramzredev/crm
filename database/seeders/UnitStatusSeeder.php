<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitStatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            ['name' => 'Available', 'description' => 'Unit is available for purchase', 'code' => 'available'],
            ['name' => 'Reserved', 'description' => 'Unit is reserved and awaiting completion', 'code' => 'reserved'],
            ['name' => 'Sold', 'description' => 'Unit has been sold', 'code' => 'sold'],
            ['name' => 'Blocked', 'description' => 'Unit is blocked', 'code' => 'blocked'],
            ['name' => 'Under Maintenance', 'description' => 'Unit is under maintenance', 'code' => 'under_maintenance'],
            ['name' => 'Under Construction', 'description' => 'Unit is currently under construction', 'code' => 'under_construction'],
            ['name' => 'Completed', 'description' => 'Unit construction is completed', 'code' => 'completed'],
        ];

        DB::table('unit_statuses')->upsert($statuses, ['name'], ['description', 'code']);
    }
}
