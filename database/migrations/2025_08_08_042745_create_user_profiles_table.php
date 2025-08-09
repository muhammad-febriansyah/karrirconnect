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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('avatar')->nullable();
            $table->string('resume')->nullable(); // File path to resume
            $table->string('portfolio_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('github_url')->nullable();
            $table->json('experience')->nullable(); // Array of work experience
            $table->json('education')->nullable(); // Array of education
            $table->string('current_position')->nullable();
            $table->decimal('expected_salary_min', 10, 2)->nullable();
            $table->decimal('expected_salary_max', 10, 2)->nullable();
            $table->string('salary_currency', 3)->default('IDR');
            $table->boolean('open_to_work')->default(true);
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
