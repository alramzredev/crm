<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitySeeder extends Seeder
{
    public function run()
    {
        $cities = [
            [
                'name' => json_encode(['en' => 'Riyadh', 'ar' => 'الرياض']),
                'country_id' => 1
            ],
            [
                'name' => json_encode(['en' => 'Jeddah', 'ar' => 'جدة']),
                'country_id' => 1
            ],
            [
                'name' => json_encode(['en' => 'Dammam', 'ar' => 'الدمام']),
                'country_id' => 1
            ],
            [
                'name' => json_encode(['en' => 'Mecca', 'ar' => 'مكة']),
                'country_id' => 1
            ],
            [
                'name' => json_encode(['en' => 'Medina', 'ar' => 'المدينة']),
                'country_id' => 1
            ],
        ];

        DB::table('cities')->insert($cities);
    }
}
