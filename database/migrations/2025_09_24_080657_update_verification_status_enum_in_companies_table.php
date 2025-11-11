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
        // Update the enum to include 'unverified' value
        \DB::statement("ALTER TABLE companies MODIFY COLUMN verification_status ENUM('unverified', 'pending', 'verified', 'rejected') NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        \DB::statement("ALTER TABLE companies MODIFY COLUMN verification_status ENUM('pending', 'verified', 'rejected') NULL");
    }
};
