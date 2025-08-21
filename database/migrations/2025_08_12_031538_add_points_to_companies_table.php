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
        Schema::table('companies', function (Blueprint $table) {
            $table->integer('job_posting_points')->default(5); // Default free points
            $table->integer('total_job_posts')->default(0); // Track total job posts created
            $table->integer('active_job_posts')->default(0); // Track currently active job posts
            $table->integer('max_active_jobs')->default(3); // Maximum active jobs allowed
            $table->timestamp('points_last_updated')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn([
                'job_posting_points',
                'total_job_posts',
                'active_job_posts',
                'max_active_jobs',
                'points_last_updated'
            ]);
        });
    }
};