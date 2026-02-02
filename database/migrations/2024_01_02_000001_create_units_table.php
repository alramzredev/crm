<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->uuid('unit_uuid')->unique();
            
            $table->string('unit_code', 100)->nullable()->index();
            $table->string('unit_number', 50)->nullable();
            $table->string('unit_external_id', 50)->nullable();
            
            $table->unsignedBigInteger('project_id')->index();
            $table->unsignedBigInteger('property_id')->index();
            $table->unsignedBigInteger('property_type_id')->nullable()->index();
            $table->unsignedBigInteger('status_id')->nullable()->index();
            
            $table->string('neighborhood', 150)->nullable();
            $table->string('status_reason', 255)->nullable();
            $table->string('floor', 50)->nullable();
            
            $table->decimal('area', 12, 2)->nullable()->index();
            $table->decimal('building_surface_area', 12, 2)->nullable();
            $table->decimal('housh_area', 12, 2)->nullable();
            
            $table->integer('rooms')->nullable()->index();
            $table->integer('wc_number')->nullable();
            
            $table->string('created_by', 100)->nullable();
            $table->string('modified_by', 100)->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('project_id')->references('id')->on('projects');
            $table->foreign('property_id')->references('id')->on('properties');
            $table->foreign('property_type_id')->references('id')->on('property_types');
            $table->foreign('status_id')->references('id')->on('property_statuses');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
