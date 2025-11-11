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
        Schema::create('message_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['employer_to_employee', 'employee_to_employer']);
            $table->string('title');
            $table->text('content');
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('available_variables')->nullable(); // Available placeholders for this template
            $table->integer('usage_count')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'type']);
            $table->index(['is_default', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_templates');
    }
};
