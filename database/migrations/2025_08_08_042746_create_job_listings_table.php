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
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->text('benefits')->nullable();
            $table->string('employment_type'); // Full-time, Part-time, Contract, Internship
            $table->string('work_arrangement'); // Remote, On-site, Hybrid
            $table->string('experience_level'); // Entry, Mid, Senior, Lead
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->string('salary_currency', 3)->default('IDR');
            $table->string('location');
            $table->boolean('salary_negotiable')->default(false);
            $table->date('application_deadline')->nullable();
            $table->integer('positions_available')->default(1);
            $table->enum('status', ['draft', 'published', 'closed', 'paused'])->default('draft');
            $table->boolean('featured')->default(false);
            $table->integer('views_count')->default(0);
            $table->integer('applications_count')->default(0);
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('job_category_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['status', 'featured']);
            $table->index(['company_id', 'status']);
            $table->index('job_category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
