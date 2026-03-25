<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    public function run()
    {
        $countries = [
            [
                'name' => json_encode(['en' => 'Saudi Arabia', 'ar' => 'المملكة العربية السعودية']),
            ],
            [
                'name' => json_encode(['en' => 'United States', 'ar' => 'الولايات المتحدة']),
            ],
            [
                'name' => json_encode(['en' => 'United Kingdom', 'ar' => 'المملكة المتحدة']),
            ],
        ];

        DB::table('countries')->insert($countries);
    }
}
