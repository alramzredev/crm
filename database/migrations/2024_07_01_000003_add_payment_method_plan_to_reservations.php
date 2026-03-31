<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaymentMethodPlanToReservations extends Migration
{
    public function up()
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->unsignedBigInteger('payment_method_id')->nullable()->after('payment_method');
            $table->unsignedBigInteger('payment_plan_id')->nullable()->after('payment_plan');

            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->nullOnDelete();
            $table->foreign('payment_plan_id')->references('id')->on('payment_plans')->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['payment_method_id']);
            $table->dropForeign(['payment_plan_id']);
            $table->dropColumn(['payment_method_id', 'payment_plan_id']);
        });
    }
}
