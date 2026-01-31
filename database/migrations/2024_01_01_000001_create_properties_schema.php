<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('municipalities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('city_id');
            $table->string('name', 150);
            $table->timestamps();

            $table->unique(['city_id', 'name']);
            $table->foreign('city_id')->references('id')->on('cities');
        });

        Schema::create('neighborhoods', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('municipality_id');
            $table->string('name', 150);
            $table->timestamps();

            $table->unique(['municipality_id', 'name']);
            $table->foreign('municipality_id')->references('id')->on('municipalities');
        });

        Schema::create('property_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('reason', 100)->nullable();
            $table->timestamps();
        });

        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->uuid('property_id')->unique();

            $table->string('property_code', 50)->unique();
            $table->integer('property_no')->nullable();

            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('owner_id');
            $table->unsignedBigInteger('neighborhood_id')->nullable();
            $table->unsignedBigInteger('status_id')->nullable();

            $table->string('property_type', 100)->nullable();
            $table->string('property_class', 50)->nullable();

            $table->string('diagram_number', 100)->nullable();
            $table->string('instrument_no', 100)->nullable();
            $table->string('license_no', 100)->nullable();
            $table->string('lot_no', 100)->nullable();

            $table->decimal('total_square_meter', 12, 2)->nullable();
            $table->integer('total_units')->nullable();
            $table->integer('count_available')->default(0);

            $table->text('notes')->nullable();

            $table->string('created_by', 100)->nullable();
            $table->string('modified_by', 100)->nullable();

            $table->string('row_checksum', 255)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_id')->references('id')->on('projects');
            $table->foreign('owner_id')->references('id')->on('owners');
            $table->foreign('neighborhood_id')->references('id')->on('neighborhoods');
            $table->foreign('status_id')->references('id')->on('property_statuses');

            $table->index('property_id');
            $table->index('deleted_at');
            $table->index('project_id');
            $table->index('owner_id');
            $table->index('status_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
        Schema::dropIfExists('property_statuses');
        Schema::dropIfExists('neighborhoods');
        Schema::dropIfExists('municipalities');
    }
};
