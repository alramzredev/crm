<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PropertyStatusSeeder extends Seeder
{
    public function run()
    {
        DB::table('property_statuses')->upsert([
            ['name' => 'Available', 'reason' => 'Property is available for sale or rent', 'description' => 'Property is available for sale', 'code' => 'available'],
            ['name' => 'Reserved', 'reason' => 'Property is temporarily reserved', 'description' => 'Property is temporarily reserved for a customer', 'code' => 'reserved'],
            ['name' => 'Sold', 'reason' => 'Property has been sold', 'description' => 'Property ownership has been fully transferred', 'code' => 'sold'],
            ['name' => 'Blocked', 'reason' => 'Property is blocked for internal reasons', 'description' => 'Property is not available for sale due to internal...', 'code' => 'blocked'],
            ['name' => 'Under Maintenance', 'reason' => 'Property is under maintenance', 'description' => 'Property is under maintenance and not available fo...', 'code' => 'under_maintenance'],
        ], ['name'], ['reason', 'description', 'code']);
    }
}
