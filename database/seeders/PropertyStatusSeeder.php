<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PropertyStatusSeeder extends Seeder
{
    public function run()
    {
        DB::table('property_statuses')->insert([
            ['name' => 'Available', 'reason' => null],
            ['name' => 'Reserved', 'reason' => null],
            ['name' => 'Sold', 'reason' => null],
        ]);
    }
}
