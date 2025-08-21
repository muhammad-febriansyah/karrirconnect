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
            $table->enum('moderation_status', ['pending', 'approved', 'rejected'])->default('pending')->after('status');
            $table->foreignId('moderated_by')->nullable()->constrained('users')->onDelete('set null')->after('moderation_status');
            $table->text('moderation_notes')->nullable()->after('moderated_by');
            $table->timestamp('moderated_at')->nullable()->after('moderation_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropColumn(['moderation_status', 'moderated_by', 'moderation_notes', 'moderated_at']);
        });
    }
};
