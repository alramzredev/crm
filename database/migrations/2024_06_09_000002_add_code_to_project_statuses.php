<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('project_statuses', function (Blueprint $table) {
            $table->string('code', 50)->after('name')->nullable(false);
        });
    }

    public function down()
    {
        Schema::table('project_statuses', function (Blueprint $table) {
            $table->dropColumn('code');
        });
    }
};
