<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuditSeeder extends Seeder
{
    public function run()
    {
        // Example data for audits
        $audits = [
            [
                'auditable_id' => 1,
                'auditable_type' => 'App\Models\Project',
                'row_checksum' => 'checksum1',
                'source_modified_on' => now(),
            ],
            // Add more audit records as needed
        ];

        DB::table('audits')->insert($audits);
    }
}
