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
        Schema::table('settings', function (Blueprint $table) {
            $table->boolean('use_custom_stats')->default(false)->after('thumbnail');
            $table->integer('custom_total_jobs')->nullable()->after('use_custom_stats');
            $table->integer('custom_total_companies')->nullable()->after('custom_total_jobs');
            $table->integer('custom_total_candidates')->nullable()->after('custom_total_companies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['use_custom_stats', 'custom_total_jobs', 'custom_total_companies', 'custom_total_candidates']);
        });
    }
};
