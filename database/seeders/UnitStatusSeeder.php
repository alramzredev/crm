<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitStatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            ['name' => 'Available', 'description' => 'Unit is available for purchase'],
            ['name' => 'Reserved', 'description' => 'Unit is reserved and awaiting completion'],
            ['name' => 'Sold', 'description' => 'Unit has been sold'],
            ['name' => 'Under Construction', 'description' => 'Unit is currently under construction'],
            ['name' => 'Completed', 'description' => 'Unit construction is completed'],
        ];

        DB::table('unit_statuses')->insert($statuses);
    }
}
