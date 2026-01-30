<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectOwnershipSeeder extends Seeder
{
    public function run()
    {
        $ownerships = [
            ['name' => 'Individual'],
            ['name' => 'Company'],
            ['name' => 'Partnership'],
            ['name' => 'Government'],
            ['name' => 'Joint Venture'],
        ];

        DB::table('project_ownerships')->insert($ownerships);
    }
}
