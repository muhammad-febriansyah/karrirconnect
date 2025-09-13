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
        Schema::create('whatsapp_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('title')->nullable();
            $table->text('message');
            $table->enum('type', ['notification', 'marketing', 'system', 'alert'])->default('notification');
            $table->json('variables')->nullable(); // Available variables for template
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('use_emoji')->default(true);
            $table->boolean('include_timestamp')->default(true);
            $table->boolean('include_signature')->default(true);
            $table->string('signature_text')->default('_Pesan otomatis dari KarirConnect_');
            $table->timestamps();

            $table->index(['type', 'is_active']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_templates');
    }
};
