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
            // Only add columns that don't exist yet
            if (!Schema::hasColumn('users', 'auth_provider')) {
                $table->string('auth_provider')->default('email')->after('avatar'); // 'email' or 'google'
            }
            if (!Schema::hasColumn('users', 'google_created_at')) {
                $table->timestamp('google_created_at')->nullable()->after('auth_provider');
            }
            
            // Add indexes
            if (!Schema::hasIndex('users', ['google_id'])) {
                $table->index(['google_id']);
            }
            if (!Schema::hasIndex('users', ['auth_provider'])) {
                $table->index(['auth_provider']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'auth_provider')) {
                $table->dropColumn(['auth_provider']);
            }
            if (Schema::hasColumn('users', 'google_created_at')) {
                $table->dropColumn(['google_created_at']);
            }
        });
    }
};
