<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staging_properties', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('import_batch_id', 36)->nullable();
            $table->unsignedInteger('row_number')->nullable();
            $table->string('import_status', 20)->default('pending');
            $table->text('error_message')->nullable();
            $table->char('uuid', 36)->nullable();
            $table->string('property_code', 50)->nullable();
            $table->integer('property_no')->nullable();
            $table->string('project_code', 100)->nullable();
            $table->string('owner_name', 255)->nullable();
            $table->string('property_type_name', 150)->nullable();
            $table->string('property_class_name', 150)->nullable();
            $table->string('status_name', 100)->nullable();
            $table->string('city_name', 150)->nullable();
            $table->string('neighborhood_name', 150)->nullable();
            $table->string('diagram_number', 100)->nullable();
            $table->string('instrument_no', 100)->nullable();
            $table->string('license_no', 100)->nullable();
            $table->string('lot_no', 100)->nullable();
            $table->decimal('total_square_meter', 12, 2)->nullable();
            $table->integer('total_units')->nullable();
            $table->integer('count_available')->nullable();
            $table->text('notes')->nullable();
            $table->string('created_by', 100)->nullable();
            $table->string('modified_by', 100)->nullable();
            $table->string('row_checksum', 255)->nullable();
            $table->timestamps();

            $table->index('import_batch_id', 'idx_staging_properties_batch');
            $table->index('import_status', 'idx_staging_properties_status');
            $table->index('property_code', 'idx_staging_properties_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staging_properties');
    }
};
