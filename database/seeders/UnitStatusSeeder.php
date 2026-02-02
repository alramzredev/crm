<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitStatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            ['name' => 'Available'],
            ['name' => 'Reserved'],
            ['name' => 'Sold'],
            ['name' => 'Under Construction'],
            ['name' => 'Completed'],
        ];

        DB::table('unit_statuses')->insert($statuses);
    }
}
