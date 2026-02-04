<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservation_cancel_reasons', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            // Business Data
            $table->string('name', 150);
            $table->string('description', 255)->nullable();
            
            // Control Flags
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            
            // Audit
            $table->timestamps();
            
            // Constraints
            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_cancel_reasons');
    }
};
