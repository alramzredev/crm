<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    public function run()
    {
        $countries = [
            ['name' => 'Saudi Arabia', 'iso_code' => 'SA'],
        ];

        DB::table('countries')->insert($countries);
    }
}
