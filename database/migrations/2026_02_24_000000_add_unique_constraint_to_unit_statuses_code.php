<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('unit_statuses', function (Blueprint $table) {
            $table->unique('code', 'unit_statuses_code_unique');
        });
    }

    public function down()
    {
        Schema::table('unit_statuses', function (Blueprint $table) {
            $table->dropUnique('unit_statuses_code_unique');
        });
    }
};
