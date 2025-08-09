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
        Schema::create('about_us', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('vision');
            $table->text('mission');
            $table->json('values'); // Store array of values
            $table->json('features'); // Store array of features
            $table->json('stats'); // Store statistics
            $table->json('team'); // Store team members
            $table->json('contact'); // Store contact information
            $table->string('cta_title')->nullable();
            $table->text('cta_description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_us');
    }
};
