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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // user, company, application, system, finance, content, etc.
            $table->string('title');
            $table->text('message');
            $table->json('target_roles'); // ['super_admin', 'company_admin'] or ['super_admin'] etc.
            $table->json('data')->nullable(); // Additional data for the notification
            $table->string('action_url')->nullable(); // URL to redirect when clicked
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_global')->default(false); // Global notifications for all users in target_roles
            $table->foreignId('created_by')->nullable()->constrained('users'); // Who created this notification
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['type', 'is_active']);
            $table->index(['created_at', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
