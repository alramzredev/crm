<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectsTable extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('project_id', 36)->nullable()->unique();
            $table->string('project_code', 100)->index();
            $table->string('name', 255)->nullable();
            $table->integer('owner_id')->nullable()->index();
            $table->integer('city_id')->nullable()->index();
            $table->string('neighborhood', 255)->nullable();
            $table->text('location')->nullable();
            $table->integer('project_type_id')->nullable()->index();
            $table->integer('project_ownership_id')->nullable()->index();
            $table->integer('status_id')->nullable()->index();
            $table->string('status_reason', 255)->nullable();
            $table->decimal('land_area', 12, 2)->nullable();
            $table->decimal('built_up_area', 12, 2)->nullable();
            $table->decimal('selling_space', 12, 2)->nullable();
            $table->decimal('sellable_area_factor', 5, 2)->nullable();
            $table->decimal('floor_area_ratio', 5, 2)->nullable();
            $table->integer('no_of_floors')->nullable();
            $table->integer('number_of_units')->nullable();
            $table->decimal('budget', 15, 2)->nullable();
            $table->boolean('warranty')->default(0);
            $table->string('created_by', 150)->nullable();
            $table->string('updated_by', 150)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->softDeletes();
        });
    }
}
