<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;

class UpdateCompaniesWithPointsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update existing companies that don't have points set
        Company::whereNull('job_posting_points')
               ->orWhere('job_posting_points', 0)
               ->update([
                   'job_posting_points' => 5,
                   'total_job_posts' => 0,
                   'active_job_posts' => 0,
                   'max_active_jobs' => 3,
                   'points_last_updated' => now(),
               ]);

        $this->command->info('Updated existing companies with default points.');
    }
}