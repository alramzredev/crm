<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadStatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            ['name' => 'New', 'description' => 'Newly created lead', 'color' => 'blue', 'code' => 'new'],
            ['name' => 'Contacted', 'description' => 'Lead has been contacted', 'color' => 'yellow', 'code' => 'contacted'],
            ['name' => 'Qualified', 'description' => 'Lead is qualified', 'color' => 'green', 'code' => 'qualified'],
            ['name' => 'Unqualified', 'description' => 'Lead is not qualified', 'color' => 'red', 'code' => 'unqualified'],
            ['name' => 'Converted', 'description' => 'Lead converted to customer', 'color' => 'purple', 'code' => 'converted'],
            ['name' => 'No Answer', 'description' => 'No answer from lead', 'color' => 'gray', 'code' => 'no_answer'],
            ['name' => 'Callback Requested', 'description' => 'Lead requested a callback', 'color' => 'orange', 'code' => 'callback_requested'],
            ['name' => 'Phone Off', 'description' => 'Lead phone is off', 'color' => 'gray', 'code' => 'phone_off'],
        ];

        DB::table('lead_statuses')->upsert($statuses, ['name'], ['description', 'color', 'code']);
    }
}
