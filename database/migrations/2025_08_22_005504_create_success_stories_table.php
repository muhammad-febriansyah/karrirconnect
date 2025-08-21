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
        Schema::create('success_stories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position');
            $table->string('company');
            $table->text('story');
            $table->string('avatar')->nullable();
            $table->string('location')->nullable();
            $table->integer('experience_years')->nullable();
            $table->decimal('salary_before', 10, 2)->nullable();
            $table->decimal('salary_after', 10, 2)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('success_stories');
    }
};
