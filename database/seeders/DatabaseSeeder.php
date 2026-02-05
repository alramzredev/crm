<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            CountrySeeder::class,
            CitySeeder::class,
            OwnerTypeSeeder::class,
            ProjectStatusSeeder::class,
            ProjectTypeSeeder::class,
            PropertyStatusSeeder::class,
            PropertyClassSeeder::class,
            UnitStatusSeeder::class,
            ProjectPropertyUnitSeeder::class,
        ]);
    }
}
