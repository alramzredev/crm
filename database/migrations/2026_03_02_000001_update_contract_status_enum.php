<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateContractStatusEnum extends Migration
{
    public function up()
    {
         DB::statement("
            ALTER TABLE contracts 
            MODIFY COLUMN status ENUM('draft','pending_signature','active','completed','cancelled') 
            DEFAULT 'draft'
        ");
    }

    public function down()
    {
         DB::statement("
            ALTER TABLE contracts 
            MODIFY COLUMN status VARCHAR(50) DEFAULT 'draft'
        ");
    }
}
