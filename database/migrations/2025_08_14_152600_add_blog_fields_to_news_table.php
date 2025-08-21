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
        Schema::table('news', function (Blueprint $table) {
            $table->string('category')->nullable()->after('content');
            $table->json('tags')->nullable()->after('category');
            $table->boolean('is_featured')->default(false)->after('tags');
            $table->integer('views_count')->default(0)->after('is_featured');
            $table->integer('reading_time')->default(0)->after('views_count');
            $table->integer('comments_count')->default(0)->after('reading_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['category', 'tags', 'is_featured', 'views_count', 'reading_time', 'comments_count']);
        });
    }
};
