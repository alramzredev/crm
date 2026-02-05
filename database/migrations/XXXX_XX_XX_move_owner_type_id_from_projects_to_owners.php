<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['owner_type_id']);
            $table->dropColumn('owner_type_id');
        });

        Schema::table('owners', function (Blueprint $table) {
            $table->unsignedBigInteger('owner_type_id')->nullable()->after('type');
            $table->foreign('owner_type_id')->references('id')->on('owner_types')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('owners', function (Blueprint $table) {
            $table->dropForeign(['owner_type_id']);
            $table->dropColumn('owner_type_id');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedBigInteger('owner_type_id')->nullable();
            $table->foreign('owner_type_id')->references('id')->on('owner_types')->onDelete('set null');
        });
    }
};
