<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('lead_statuses', function (Blueprint $table) {
            $table->string('code', 50)->after('name')->nullable(false);
        });

        // Add unique constraint after column is populated
        // (You may want to run an update before this in production)
        Schema::table('lead_statuses', function (Blueprint $table) {
            $table->unique('code', 'lead_statuses_code_unique');
        });
    }

    public function down()
    {
        Schema::table('lead_statuses', function (Blueprint $table) {
            $table->dropUnique('lead_statuses_code_unique');
            $table->dropColumn('code');
        });
    }
};
