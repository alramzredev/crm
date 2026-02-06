<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_statuses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 100);
            $table->string('description', 255)->nullable();
            $table->string('color', 20)->nullable();
            $table->timestamps();
            
            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_statuses');
    }
};
