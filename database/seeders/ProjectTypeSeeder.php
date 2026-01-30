<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectTypeSeeder extends Seeder
{
    public function run()
    {
        $types = [
            ['name' => 'Villas'],
            ['name' => 'Flats'],
        ];

        DB::table('project_types')->insert($types);
    }
}
