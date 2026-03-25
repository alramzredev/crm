<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NeighborhoodSeeder extends Seeder
{
    public function run()
    {
        $neighborhoods = [
            [
                'municipality_id' => 1,
                'name' => json_encode(['en' => 'Downtown', 'ar' => 'وسط المدينة']),
            ],
            [
                'municipality_id' => 2,
                'name' => json_encode(['en' => 'North Hills', 'ar' => 'تلال الشمال']),
            ],
            // ...add more as needed...
        ];

        DB::table('neighborhoods')->insert($neighborhoods);
    }
}
