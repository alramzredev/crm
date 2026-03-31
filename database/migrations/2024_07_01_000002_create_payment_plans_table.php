<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentPlansTable extends Migration
{
    public function up()
    {
        Schema::create('payment_plans', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->json('name');
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payment_plans');
    }
}
