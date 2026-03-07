<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('lead_assignments', function (Blueprint $table) {
            $table->dropUnique('uq_active_lead_assignment');
        });
    }

    public function down()
    {
        Schema::table('lead_assignments', function (Blueprint $table) {
            $table->unique(['lead_id', 'is_active'], 'uq_active_lead_assignment');
        });
    }
};