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
        Schema::table('job_listings', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('title');
        });
        
        // Generate slugs for existing records
        $jobs = \App\Models\JobListing::all();
        foreach ($jobs as $job) {
            $slug = \Illuminate\Support\Str::slug($job->title . '-' . $job->id);
            $job->update(['slug' => $slug]);
        }
        
        // Make slug unique after populating existing records
        Schema::table('job_listings', function (Blueprint $table) {
            $table->string('slug')->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
