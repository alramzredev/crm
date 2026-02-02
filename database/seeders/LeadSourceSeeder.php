<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadSourceSeeder extends Seeder
{
    public function run()
    {
        $sources = [
            ['name' => 'Website'],
            ['name' => 'Referral'],
            ['name' => 'Agent'],
            ['name' => 'Advertisement'],
            ['name' => 'Walk-in'],
        ];

        DB::table('lead_sources')->insertOrIgnore($sources);
    }
}
