<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('import_batches', function (Blueprint $table) {
            $table->bigIncrements('id');

            // Batch Identifier
            $table->char('batch_uuid', 36)->unique();

            // Import Context
            $table->string('import_type', 50);
            $table->string('file_name', 255);

            // Status
            $table->string('status', 20)->default('pending');

            // Counters
            $table->unsignedInteger('total_rows')->default(0);
            $table->unsignedInteger('processed_rows')->default(0);
            $table->unsignedInteger('failed_rows')->default(0);

            // Audit
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('import_type', 'idx_import_batches_type');
            $table->index('status', 'idx_import_batches_status');
            $table->index('created_by', 'idx_import_batches_created_by');

            // Foreign Keys
            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('import_batches');
    }
};
