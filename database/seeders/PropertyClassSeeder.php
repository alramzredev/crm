<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PropertyClassSeeder extends Seeder
{
    public function run()
    {
        $classes = [
            ['name' => 'Residential'],
            ['name' => 'Commercial'],
            ['name' => 'Mixed Use'],
            ['name' => 'Industrial'],
        ];

        DB::table('property_classes')->insert($classes);
    }
}
