<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitySeeder extends Seeder
{
    public function run()
    {
        $cities = [
            ['name' => 'Riyadh', 'country_id' => 1],
            ['name' => 'Jeddah', 'country_id' => 1],
            ['name' => 'Dammam', 'country_id' => 1],
            ['name' => 'Mecca', 'country_id' => 1],
            ['name' => 'Medina', 'country_id' => 1],
        ];

        DB::table('cities')->insert($cities);
    }
}
