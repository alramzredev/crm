<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_receipts', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('payment_id');

            $table->string('file_name', 255);
            $table->string('file_path', 500);
            $table->string('file_type', 50)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('mime_type', 100)->nullable();

            $table->string('receipt_number', 100)->nullable();
            $table->text('notes')->nullable();

            $table->unsignedBigInteger('uploaded_by')->nullable();

            $table->timestamps();

            $table->foreign('payment_id')
                ->references('id')
                ->on('payments')
                ->onDelete('cascade');

            $table->foreign('uploaded_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->index('payment_id', 'idx_payment_receipts_payment');
            $table->index('uploaded_by', 'idx_payment_receipts_uploaded_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_receipts');
    }
};
