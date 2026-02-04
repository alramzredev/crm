<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->unsignedBigInteger('cancel_reason_id')->nullable()->after('status');
            $table->foreign('cancel_reason_id')
                ->references('id')
                ->on('reservation_cancel_reasons')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['cancel_reason_id']);
            $table->dropColumn('cancel_reason_id');
        });
    }
};
