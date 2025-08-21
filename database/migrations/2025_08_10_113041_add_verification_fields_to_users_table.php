<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('verification_status', ['unverified', 'pending', 'verified', 'rejected'])->default('unverified')->after('is_active');
            $table->json('verification_documents')->nullable()->after('verification_status');
            $table->text('verification_notes')->nullable()->after('verification_documents');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null')->after('verification_notes');
            $table->timestamp('verified_at')->nullable()->after('verified_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['verification_status', 'verification_documents', 'verification_notes', 'verified_by', 'verified_at']);
        });
    }
};
