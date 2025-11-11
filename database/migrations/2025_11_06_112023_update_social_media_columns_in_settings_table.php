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
        Schema::table('settings', function (Blueprint $table) {
            // Rename yt to x (Twitter)
            $table->renameColumn('yt', 'x');

            // Add linkedin column
            $table->string('linkedin')->nullable()->after('x');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            // Remove linkedin column
            $table->dropColumn('linkedin');

            // Rename x back to yt
            $table->renameColumn('x', 'yt');
        });
    }
};
