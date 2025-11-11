<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // Add verification_status enum
            if (!Schema::hasColumn('companies', 'verification_status')) {
                $table->enum('verification_status', ['pending', 'verified', 'rejected', 'under_review'])
                    ->default('pending')
                    ->after('is_verified');
            }
            
            // Add verification_documents json
            if (!Schema::hasColumn('companies', 'verification_documents')) {
                $table->json('verification_documents')->nullable()->after('verification_status');
            }
            
            // Add verification_data json if not exists
            if (!Schema::hasColumn('companies', 'verification_data')) {
                $table->json('verification_data')->nullable()->after('verification_documents');
            }
            
            // Add company_name if not exists (alias for name)
            if (!Schema::hasColumn('companies', 'company_name')) {
                $table->string('company_name')->nullable()->after('name');
            }
            
            // Add address if not exists
            if (!Schema::hasColumn('companies', 'address')) {
                $table->text('address')->nullable()->after('location');
            }
            
            // Add slug if not exists
            if (!Schema::hasColumn('companies', 'slug')) {
                $table->string('slug')->unique()->nullable()->after('company_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $columns = ['verification_status', 'verification_documents', 'verification_data', 'company_name', 'address', 'slug'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('companies', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
