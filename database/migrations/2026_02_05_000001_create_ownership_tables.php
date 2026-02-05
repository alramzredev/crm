<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_ownerships', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('owner_id');
            $table->date('started_at');
            $table->date('ended_at')->nullable();
            $table->boolean('is_current')->default(true);
            $table->timestamps();

            $table->foreign('project_id', 'fk_project_ownerships_project')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('owner_id', 'fk_project_ownerships_owner')->references('id')->on('owners')->onDelete('restrict');

            $table->index('project_id', 'idx_project_ownerships_project');
            $table->index('owner_id', 'idx_project_ownerships_owner');
            $table->index('is_current', 'idx_project_ownerships_current');
        });

        Schema::create('property_ownerships', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('property_id');
            $table->unsignedBigInteger('owner_id');
            $table->date('started_at');
            $table->date('ended_at')->nullable();
            $table->boolean('is_current')->default(true);
            $table->timestamps();

            $table->foreign('property_id', 'fk_property_ownerships_property')->references('id')->on('properties')->onDelete('cascade');
            $table->foreign('owner_id', 'fk_property_ownerships_owner')->references('id')->on('owners')->onDelete('restrict');

            $table->index('property_id', 'idx_property_ownerships_property');
            $table->index('owner_id', 'idx_property_ownerships_owner');
            $table->index('is_current', 'idx_property_ownerships_current');
        });

        Schema::create('unit_ownerships', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('unit_id');
            $table->unsignedBigInteger('owner_id');
            $table->unsignedBigInteger('contract_id')->nullable();
            $table->date('started_at');
            $table->date('ended_at')->nullable();
            $table->boolean('is_current')->default(true);
            $table->timestamps();

            $table->foreign('unit_id', 'fk_unit_ownerships_unit')->references('id')->on('units')->onDelete('cascade');
            $table->foreign('owner_id', 'fk_unit_ownerships_owner')->references('id')->on('owners')->onDelete('restrict');
            $table->foreign('contract_id', 'fk_unit_ownerships_contract')->references('id')->on('contracts')->onDelete('set null');

            $table->index('unit_id', 'idx_unit_ownerships_unit');
            $table->index('owner_id', 'idx_unit_ownerships_owner');
            $table->index('contract_id', 'idx_unit_ownerships_contract');
            $table->index('is_current', 'idx_unit_ownerships_current');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_ownerships');
        Schema::dropIfExists('property_ownerships');
        Schema::dropIfExists('project_ownerships');
    }
};
