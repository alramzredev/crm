<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staging_projects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('import_batch_id', 36)->nullable();
            $table->unsignedInteger('row_number')->nullable();
            $table->string('import_status', 20)->default('pending');
            $table->text('error_message')->nullable();
            
            // Project identification
            $table->char('project_uuid', 36)->nullable();
            $table->string('project_code', 100)->nullable();
            $table->string('project_external_id', 50)->nullable();
            
            // Relations (text references)
            $table->string('property_code', 50)->nullable();
            $table->string('owner_name', 255)->nullable();
            $table->string('property_type_name', 150)->nullable();
            $table->string('unit_type_name', 150)->nullable();
            
            // Status
            $table->string('status_name', 100)->nullable();
            $table->string('status_reason', 255)->nullable();
            
            // Location
            $table->string('neighborhood', 150)->nullable();
            $table->string('floor', 50)->nullable();
            
            // Physical properties
            $table->decimal('area', 12, 2)->nullable();
            $table->decimal('building_surface_area', 12, 2)->nullable();
            $table->decimal('housh_area', 12, 2)->nullable();
            $table->integer('rooms')->nullable();
            $table->integer('wc_number')->nullable();
            $table->integer('parking_no')->nullable();
            
            // Pricing
            $table->decimal('price', 15, 2)->nullable();
            $table->decimal('price_base', 15, 2)->nullable();
            $table->string('currency', 10)->nullable();
            $table->decimal('exchange_rate', 12, 4)->nullable();
            
            // Details
            $table->string('model', 100)->nullable();
            $table->string('purpose', 100)->nullable();
            
            // Legal/Document
            $table->string('instrument_no', 100)->nullable();
            $table->string('instrument_hijri_date', 50)->nullable();
            $table->string('instrument_no_after_sales', 100)->nullable();
            
            // Features - Structural
            $table->boolean('has_balcony')->nullable();
            $table->boolean('has_basement')->nullable();
            $table->boolean('has_basement_parking')->nullable();
            $table->boolean('has_big_housh')->nullable();
            $table->boolean('has_small_housh')->nullable();
            $table->boolean('has_housh')->nullable();
            $table->boolean('has_big_roof')->nullable();
            $table->boolean('has_small_roof')->nullable();
            $table->boolean('has_roof')->nullable();
            $table->boolean('has_rooftop')->nullable();
            
            // Features - Amenities
            $table->boolean('has_pool')->nullable();
            $table->boolean('has_pool_view')->nullable();
            $table->boolean('has_tennis_view')->nullable();
            $table->boolean('has_golf_view')->nullable();
            $table->boolean('has_caffe_view')->nullable();
            $table->boolean('has_waterfall')->nullable();
            $table->boolean('has_elevator')->nullable();
            
            // Features - Access & Security
            $table->boolean('has_private_entrance')->nullable();
            $table->boolean('has_two_interfaces')->nullable();
            $table->boolean('has_security_system')->nullable();
            $table->boolean('has_internet')->nullable();
            
            // Features - Rooms & Spaces
            $table->boolean('has_kitchen')->nullable();
            $table->boolean('has_laundry_room')->nullable();
            $table->boolean('has_internal_store')->nullable();
            $table->boolean('has_warehouse')->nullable();
            $table->boolean('has_living_room')->nullable();
            $table->boolean('has_family_lounge')->nullable();
            $table->boolean('has_big_lounge')->nullable();
            $table->boolean('has_food_area')->nullable();
            
            // Features - Councils
            $table->boolean('has_council')->nullable();
            $table->boolean('has_diwaniyah')->nullable();
            $table->boolean('has_diwan1')->nullable();
            $table->boolean('has_mens_council')->nullable();
            $table->boolean('has_womens_council')->nullable();
            $table->boolean('has_family_council')->nullable();
            
            // Features - Service Rooms & Outdoor
            $table->boolean('has_maids_room')->nullable();
            $table->boolean('has_drivers_room')->nullable();
            $table->boolean('has_terrace')->nullable();
            $table->boolean('has_outdoor')->nullable();
            
            // Additional
            $table->text('unit_description_en')->nullable();
            $table->text('national_address')->nullable();
            $table->string('water_meter_no', 50)->nullable();
            $table->text('note')->nullable();
            
            // Audit
            $table->string('created_by', 100)->nullable();
            $table->string('modified_by', 100)->nullable();
            $table->timestamp('excel_modified_on')->nullable();
            $table->timestamps();

            $table->index('import_batch_id', 'idx_staging_projects_batch');
            $table->index('import_status', 'idx_staging_projects_status');
            $table->index('project_code', 'idx_staging_projects_code');
            // Add composite index for project_code + batch_id uniqueness check
            $table->index(['project_code', 'import_batch_id'], 'idx_staging_projects_code_batch');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staging_projects');
    }
};