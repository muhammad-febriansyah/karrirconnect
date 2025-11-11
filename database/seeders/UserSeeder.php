<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update Super Admin
        $superAdmin = \App\Models\User::updateOrCreate(
            ['email' => 'admin@karirconnect.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        \App\Models\UserProfile::updateOrCreate(
            ['user_id' => $superAdmin->id],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'bio' => 'System Administrator',
            ]
        );

        // Get first company or create one for testing
        $testCompany = \App\Models\Company::first() ?? \App\Models\Company::create([
            'name' => 'Test Company',
            'company_name' => 'Test Company',
            'email' => 'test@company.com',
            'description' => 'Test company for company admin',
            'website' => 'https://testcompany.com',
            'industry' => 'Technology',
            'size' => '50-100',
            'location' => 'Jakarta, Indonesia',
            'is_verified' => true,
            'verification_status' => 'verified',
            'is_active' => true,
        ]);

        // Create or update Company Admin
        $companyAdmin = \App\Models\User::updateOrCreate(
            ['email' => 'company@karirconnect.com'],
            [
                'name' => 'Company Admin',
                'password' => bcrypt('password'),
                'role' => 'company_admin',
                'company_id' => $testCompany->id,
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        \App\Models\UserProfile::updateOrCreate(
            ['user_id' => $companyAdmin->id],
            [
                'first_name' => 'Company',
                'last_name' => 'Admin',
                'bio' => 'Company Administrator',
            ]
        );

        // Create Regular Users (skip if exists)
        for ($i = 1; $i <= 10; $i++) {
            $email = "user{$i}@example.com";
            
            if (\App\Models\User::where('email', $email)->exists()) {
                continue;
            }
            
            $user = \App\Models\User::create([
                'name' => "User {$i}",
                'email' => $email,
                'password' => bcrypt('password'),
                'role' => 'user',
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            \App\Models\UserProfile::create([
                'user_id' => $user->id,
                'first_name' => "First{$i}",
                'last_name' => "Last{$i}",
                'phone' => "08123456789{$i}",
                'bio' => "I am user number {$i}, looking for new opportunities in technology.",
                'location' => $this->getRandomLocation(),
                'current_position' => $this->getRandomPosition(),
                'expected_salary_min' => rand(5000000, 10000000),
                'expected_salary_max' => rand(10000000, 20000000),
                'open_to_work' => rand(0, 1),
                'experience' => [
                    [
                        'company' => 'Tech Company ' . $i,
                        'position' => $this->getRandomPosition(),
                        'start_date' => '2020-01-01',
                        'end_date' => '2023-12-31',
                        'description' => 'Worked as a developer in various projects'
                    ]
                ],
                'education' => [
                    [
                        'institution' => 'University ' . $i,
                        'degree' => 'Bachelor of Computer Science',
                        'start_date' => '2016-09-01',
                        'end_date' => '2020-07-31',
                        'gpa' => '3.' . rand(5, 9)
                    ]
                ]
            ]);
        }

        // Create or update Demo User
        $demoUser = \App\Models\User::updateOrCreate(
            ['email' => 'demo@karirconnect.com'],
            [
                'name' => 'Demo User',
                'password' => bcrypt('demo123'),
                'role' => 'user',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        \App\Models\UserProfile::updateOrCreate(
            ['user_id' => $demoUser->id],
            [
                'first_name' => 'Demo',
                'last_name' => 'User',
                'phone' => '081234567890',
                'bio' => 'I am a demo user for testing purposes. Full-stack developer with 3+ years of experience.',
                'location' => 'Jakarta, Indonesia',
                'current_position' => 'Full Stack Developer',
                'expected_salary_min' => 8000000,
                'expected_salary_max' => 15000000,
                'open_to_work' => true,
                'linkedin_url' => 'https://linkedin.com/in/demo-user',
                'github_url' => 'https://github.com/demo-user',
                'portfolio_url' => 'https://demo-user.dev',
                'experience' => [
                    [
                        'company' => 'TechStart Indonesia',
                        'position' => 'Full Stack Developer',
                        'start_date' => '2021-03-01',
                        'end_date' => null,
                        'description' => 'Developing web applications using Laravel, React, and Vue.js'
                    ],
                    [
                        'company' => 'Digital Solutions',
                        'position' => 'Junior Developer',
                        'start_date' => '2020-06-01',
                        'end_date' => '2021-02-28',
                        'description' => 'Built responsive websites and maintained existing systems'
                    ]
                ],
                'education' => [
                    [
                        'institution' => 'Universitas Indonesia',
                        'degree' => 'Bachelor of Computer Science',
                        'start_date' => '2016-09-01',
                        'end_date' => '2020-07-31',
                        'gpa' => '3.8'
                    ]
                ]
            ]
        );
        
        $this->command->info('Users seeded successfully!');
    }

    private function getRandomLocation(): string
    {
        $locations = [
            'Jakarta, Indonesia',
            'Surabaya, Indonesia', 
            'Bandung, Indonesia',
            'Medan, Indonesia',
            'Semarang, Indonesia',
            'Makassar, Indonesia',
            'Palembang, Indonesia',
            'Yogyakarta, Indonesia',
        ];

        return $locations[array_rand($locations)];
    }

    private function getRandomPosition(): string
    {
        $positions = [
            'Software Engineer',
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'Mobile Developer',
            'DevOps Engineer',
            'Data Analyst',
            'UI/UX Designer',
            'Product Manager',
            'Quality Assurance',
        ];

        return $positions[array_rand($positions)];
    }
}
