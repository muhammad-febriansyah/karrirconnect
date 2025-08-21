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
        Schema::create('point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('point_package_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type', ['purchase', 'usage', 'refund', 'bonus', 'expired']);
            $table->integer('points'); // Positive for credit, negative for debit
            $table->decimal('amount', 12, 2)->nullable(); // Payment amount (for purchases)
            $table->string('description');
            $table->string('reference_type')->nullable(); // e.g., 'job_listing', 'payment'
            $table->unsignedBigInteger('reference_id')->nullable(); // ID of related model
            $table->string('payment_method')->nullable(); // e.g., 'midtrans', 'bank_transfer'
            $table->string('payment_reference')->nullable(); // Midtrans order ID, etc.
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->json('metadata')->nullable(); // Additional data (payment response, etc.)
            $table->timestamp('expires_at')->nullable(); // For point expiration
            $table->timestamps();
            
            $table->index(['company_id', 'type']);
            $table->index(['reference_type', 'reference_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_transactions');
    }
};