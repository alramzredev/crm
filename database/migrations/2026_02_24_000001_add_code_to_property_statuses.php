<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('property_statuses', function (Blueprint $table) {
            $table->string('code', 100)->nullable()->unique('property_statuses_code_unique');
        });
    }

    public function down()
    {
        Schema::table('property_statuses', function (Blueprint $table) {
            $table->dropUnique('property_statuses_code_unique');
            $table->dropColumn('code');
        });
    }
};
