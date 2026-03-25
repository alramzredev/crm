<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MunicipalitySeeder extends Seeder
{
    public function run()
    {
        $municipalities = [
            [
                'city_id' => 1,
                'name' => json_encode(['en' => 'Central Municipality', 'ar' => 'بلدية المركزية']),
            ],
            [
                'city_id' => 1,
                'name' => json_encode(['en' => 'North Municipality', 'ar' => 'بلدية الشمالية']),
            ],
            // ...add more as needed...
        ];

        DB::table('municipalities')->insert($municipalities);
    }
}
