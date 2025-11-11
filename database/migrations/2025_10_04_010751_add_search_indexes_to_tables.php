<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add basic indexes for better search performance
        Schema::table('users', function (Blueprint $table) {
            $table->index(['name'], 'idx_users_name');
            $table->index(['email'], 'idx_users_email');
        });

        Schema::table('job_listings', function (Blueprint $table) {
            $table->index(['title'], 'idx_job_listings_title');
        });

        Schema::table('job_invitations', function (Blueprint $table) {
            $table->index(['status'], 'idx_job_invitations_status');
            $table->index(['company_id', 'status'], 'idx_job_invitations_company_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_name');
            $table->dropIndex('idx_users_email');
        });

        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropIndex('idx_job_listings_title');
        });

        Schema::table('job_invitations', function (Blueprint $table) {
            $table->dropIndex('idx_job_invitations_status');
            $table->dropIndex('idx_job_invitations_company_status');
        });
    }
};
