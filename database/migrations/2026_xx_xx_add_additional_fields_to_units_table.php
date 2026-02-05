<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            // Financial & Business Info
            $table->string('currency', 10)->nullable()->after('price_base');
            $table->decimal('exchange_rate', 12, 4)->nullable()->after('currency');
            $table->string('model', 100)->nullable()->after('exchange_rate');
            $table->string('purpose', 100)->nullable()->after('model');
            $table->string('unit_type', 100)->nullable()->after('purpose');
            $table->string('owner', 150)->nullable()->after('unit_type');
            
            // Legal/Document Info
            $table->string('instrument_no', 100)->nullable()->after('owner');
            $table->string('instrument_hijri_date', 50)->nullable()->after('instrument_no');
            $table->string('instrument_no_after_sales', 100)->nullable()->after('instrument_hijri_date');
            
            // Features - Structural
            $table->boolean('has_balcony')->default(false)->after('instrument_no_after_sales');
            $table->boolean('has_basement')->default(false)->after('has_balcony');
            $table->boolean('has_basement_parking')->default(false)->after('has_basement');
            $table->boolean('has_big_housh')->default(false)->after('has_basement_parking');
            $table->boolean('has_small_housh')->default(false)->after('has_big_housh');
            $table->boolean('has_housh')->default(false)->after('has_small_housh');
            $table->boolean('has_big_roof')->default(false)->after('has_housh');
            $table->boolean('has_small_roof')->default(false)->after('has_big_roof');
            $table->boolean('has_roof')->default(false)->after('has_small_roof');
            $table->boolean('has_rooftop')->default(false)->after('has_roof');
            
            // Features - Amenities
            $table->boolean('has_pool')->default(false)->after('has_rooftop');
            $table->boolean('has_pool_view')->default(false)->after('has_pool');
            $table->boolean('has_tennis_view')->default(false)->after('has_pool_view');
            $table->boolean('has_golf_view')->default(false)->after('has_tennis_view');
            $table->boolean('has_caffe_view')->default(false)->after('has_golf_view');
            $table->boolean('has_waterfall')->default(false)->after('has_caffe_view');
            $table->boolean('has_elevator')->default(false)->after('has_waterfall');
            
            // Features - Access & Security
            $table->boolean('has_private_entrance')->default(false)->after('has_elevator');
            $table->boolean('has_two_interfaces')->default(false)->after('has_private_entrance');
            $table->boolean('has_security_system')->default(false)->after('has_two_interfaces');
            $table->boolean('has_internet')->default(false)->after('has_security_system');
            
            // Features - Rooms & Spaces
            $table->boolean('has_kitchen')->default(false)->after('has_internet');
            $table->boolean('has_laundry_room')->default(false)->after('has_kitchen');
            $table->boolean('has_internal_store')->default(false)->after('has_laundry_room');
            $table->boolean('has_warehouse')->default(false)->after('has_internal_store');
            $table->boolean('has_living_room')->default(false)->after('has_warehouse');
            $table->boolean('has_family_lounge')->default(false)->after('has_living_room');
            $table->boolean('has_big_lounge')->default(false)->after('has_family_lounge');
            $table->boolean('has_food_area')->default(false)->after('has_big_lounge');
            
            // Features - Council/Meeting Rooms
            $table->boolean('has_council')->default(false)->after('has_food_area');
            $table->boolean('has_diwaniyah')->default(false)->after('has_council');
            $table->boolean('has_diwan1')->default(false)->after('has_diwaniyah');
            $table->boolean('has_mens_council')->default(false)->after('has_diwan1');
            $table->boolean('has_womens_council')->default(false)->after('has_mens_council');
            $table->boolean('has_family_council')->default(false)->after('has_womens_council');
            
            // Features - Service Rooms
            $table->boolean('has_maids_room')->default(false)->after('has_family_council');
            $table->boolean('has_drivers_room')->default(false)->after('has_maids_room');
            
            // Features - Outdoor
            $table->boolean('has_terrace')->default(false)->after('has_drivers_room');
            $table->boolean('has_outdoor')->default(false)->after('has_terrace');
            
            // Additional Info
            $table->text('unit_description_en')->nullable()->after('has_outdoor');
            $table->text('national_address')->nullable()->after('unit_description_en');
            $table->string('water_meter_no', 50)->nullable()->after('national_address');
        });
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn([
                'currency', 'exchange_rate', 'model', 'purpose', 'unit_type', 'owner',
                'instrument_no', 'instrument_hijri_date', 'instrument_no_after_sales',
                'has_balcony', 'has_basement', 'has_basement_parking',
                'has_big_housh', 'has_small_housh', 'has_housh',
                'has_big_roof', 'has_small_roof', 'has_roof', 'has_rooftop',
                'has_pool', 'has_pool_view', 'has_tennis_view', 'has_golf_view',
                'has_caffe_view', 'has_waterfall', 'has_elevator',
                'has_private_entrance', 'has_two_interfaces', 'has_security_system', 'has_internet',
                'has_kitchen', 'has_laundry_room', 'has_internal_store', 'has_warehouse',
                'has_living_room', 'has_family_lounge', 'has_big_lounge', 'has_food_area',
                'has_council', 'has_diwaniyah', 'has_diwan1',
                'has_mens_council', 'has_womens_council', 'has_family_council',
                'has_maids_room', 'has_drivers_room',
                'has_terrace', 'has_outdoor',
                'unit_description_en', 'national_address', 'water_meter_no'
            ]);
        });
    }
};
