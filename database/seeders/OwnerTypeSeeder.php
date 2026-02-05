<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OwnerTypeSeeder extends Seeder
{
    public function run()
    {
        $types = [
            ['name' => 'Individual'],
            ['name' => 'Company'],
            ['name' => 'Partnership'],
            ['name' => 'Government'],
            ['name' => 'Joint Venture'],
        ];

        DB::table('owner_types')->insert($types);
    }
}
