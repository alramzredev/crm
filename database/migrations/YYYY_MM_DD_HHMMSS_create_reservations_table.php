<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            /* ===========================
               BUSINESS IDENTIFIER
               =========================== */
            $table->string('reservation_code', 50)->unique();

            /* ===========================
               RELATIONS
               =========================== */
            $table->foreignId('lead_id')
                  ->constrained('leads')
                  ->restrictOnDelete();

            $table->foreignId('unit_id')
                  ->constrained('units')
                  ->restrictOnDelete();

            /* ===========================
               STATUS & PAYMENT (NORMALIZED)
               =========================== */
            $table->foreignId('status_id')
                  ->constrained('reservation_statuses')
                  ->restrictOnDelete();

            $table->foreignId('payment_method_id')
                  ->nullable()
                  ->constrained('payment_methods')
                  ->nullOnDelete();

            $table->foreignId('payment_plan_id')
                  ->nullable()
                  ->constrained('payment_plans')
                  ->nullOnDelete();

            /* ===========================
               FINANCIALS
               =========================== */
            $table->decimal('total_price', 15, 2)->nullable();
            $table->decimal('down_payment', 15, 2)->nullable();
            $table->decimal('remaining_amount', 15, 2)->nullable();
            $table->string('currency', 10)->default('SAR');

            /* ===========================
               RESERVATION LIFECYCLE
               =========================== */
            $table->timestamp('started_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            /* ===========================
               LEGAL ACCEPTANCE
               =========================== */
            $table->boolean('terms_accepted')->default(false);
            $table->boolean('privacy_accepted')->default(false);

            /* ===========================
               NOTES & AUDIT
               =========================== */
            $table->text('notes')->nullable();

            $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->foreignId('updated_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            /* ===========================
               INDEXES
               =========================== */
            $table->index(['unit_id', 'status_id']);
            $table->index(['expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
