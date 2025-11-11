<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\JobInvitation;
use App\Models\UserProfile;
use App\Models\JobCategory;
use Illuminate\Support\Facades\Hash;

class TestJobInvitationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or get test company admin user
        $companyAdmin = User::firstOrCreate(
            ['email' => 'company@test.com'],
            [
                'name' => 'Test Company Admin',
                'password' => Hash::make('password'),
                'role' => 'company_admin',
                'email_verified_at' => now(),
            ]
        );

        // Create or get test company
        $company = Company::firstOrCreate(
            ['email' => 'info@testcompany.com'],
            [
                'admin_user_id' => $companyAdmin->id,
                'name' => 'Test Company Inc',
                'slug' => 'test-company-inc',
                'description' => 'A test company for job invitation testing',
                'industry' => 'Technology',
                'size' => '50-200',
                'website' => 'https://testcompany.com',
                'phone' => '081234567890',
                'location' => 'Jakarta',
                'address' => 'Jakarta, Indonesia',
                'verification_status' => 'verified',
                'is_verified' => true,
            ]
        );

        // Update company admin with company_id
        $companyAdmin->update(['company_id' => $company->id]);

        // Create job category if not exists
        $jobCategory = JobCategory::firstOrCreate(
            ['name' => 'IT & Software'],
            [
                'slug' => 'it-software',
                'description' => 'Information Technology and Software Development',
            ]
        );

        // Create test job listing
        $jobListing = JobListing::firstOrCreate(
            ['slug' => 'senior-software-engineer-test'],
            [
                'company_id' => $company->id,
                'title' => 'Senior Software Engineer',
                'description' => 'We are looking for a senior software engineer. Design and develop software applications.',
                'requirements' => 'Bachelor degree in Computer Science, 5+ years experience',
                'benefits' => 'Competitive salary, health insurance, remote work',
                'employment_type' => 'full_time',
                'work_arrangement' => 'hybrid',
                'experience_level' => 'senior',
                'location' => 'Jakarta',
                'salary_min' => 15000000,
                'salary_max' => 25000000,
                'salary_currency' => 'IDR',
                // Remove status, let database use default
                'moderation_status' => 'approved',
                'job_category_id' => $jobCategory->id,
                'created_by' => $companyAdmin->id,
            ]
        );

        // Create or get test candidate user
        $candidate = User::firstOrCreate(
            ['email' => 'candidate@test.com'],
            [
                'name' => 'Test Candidate',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        // Create user profile for candidate
        UserProfile::firstOrCreate(
            ['user_id' => $candidate->id],
            [
                'phone' => '081234567891',
                'location' => 'Jakarta',
                'bio' => 'Experienced software engineer',
            ]
        );

        // Create a job invitation
        $invitation = JobInvitation::firstOrCreate(
            [
                'company_id' => $company->id,
                'job_listing_id' => $jobListing->id,
                'candidate_id' => $candidate->id,
            ],
            [
                'sent_by' => $companyAdmin->id,
                'status' => 'accepted', // Changed to accepted so chat button is enabled
                'message' => 'We are impressed with your profile and would like to invite you to apply for this position.',
                'responded_at' => now(),
            ]
        );

        $this->command->info('Test data created successfully!');
        $this->command->info('Company Admin: company@test.com / password');
        $this->command->info('Candidate: candidate@test.com / password');
        $this->command->info('Job Invitation ID: ' . $invitation->id);
    }
}
