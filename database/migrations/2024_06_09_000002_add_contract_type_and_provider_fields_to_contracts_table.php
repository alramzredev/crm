<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
             $table->unsignedBigInteger('contract_type_id')->nullable()->after('contract_code');
            $table->string('provider', 50)->nullable()->after('contract_type_id');
            $table->string('provider_contract_id', 255)->nullable()->after('provider');
            $table->timestamp('signed_at')->nullable()->after('provider_contract_id');
            $table->string('provider_status', 50)->nullable()->after('provider_contract_id');

            $table->index('contract_type_id', 'idx_contracts_contract_type');
            $table->index('provider_contract_id', 'idx_contracts_provider_contract_id');
        });

        // Step 2: Add FK constraint after column exists and is nullable
        Schema::table('contracts', function (Blueprint $table) {
            $table->foreign('contract_type_id')
                ->references('id')
                ->on('contract_types')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['contract_type_id']);
            $table->dropIndex('idx_contracts_contract_type');
            $table->dropIndex('idx_contracts_provider_contract_id');
            $table->dropColumn([
                'contract_type_id',
                'provider',
                'provider_contract_id',
                'signed_at',
                'provider_status',
            ]);
        });
    }
};
