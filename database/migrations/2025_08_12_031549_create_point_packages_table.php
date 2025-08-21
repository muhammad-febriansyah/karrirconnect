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
        Schema::create('point_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Starter Pack', 'Business Pack', 'Enterprise Pack'
            $table->text('description');
            $table->integer('points'); // Number of points in this package
            $table->decimal('price', 12, 2); // Price in IDR
            $table->integer('bonus_points')->default(0); // Bonus points (for promotions)
            $table->integer('validity_days')->default(365); // Points validity in days
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->json('features')->nullable(); // Additional features (JSON array)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_packages');
    }
};