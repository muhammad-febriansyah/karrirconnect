<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Paket gratis untuk memulai rekrutmen Anda',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'job_posting_limit' => 3, // Max 3 job postings
                'featured_job_limit' => 0,
                'auto_promote' => false,
                'premium_badge' => false,
                'analytics_access' => false,
                'priority_support' => false,
                'talent_database_access' => false,
                'job_invitation_limit' => 5,
                'features' => [
                    'Posting hingga 3 lowongan aktif',
                    'Akses talent database terbatas',
                    'Notifikasi lamaran masuk',
                    'Chat dengan kandidat',
                    'Support via email',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'Paket dasar untuk perusahaan kecil',
                'price_monthly' => 299000,
                'price_yearly' => 2990000, // ~16% discount
                'job_posting_limit' => 10,
                'featured_job_limit' => 2,
                'auto_promote' => false,
                'premium_badge' => false,
                'analytics_access' => true,
                'priority_support' => false,
                'talent_database_access' => true,
                'job_invitation_limit' => 20,
                'features' => [
                    'Posting hingga 10 lowongan aktif',
                    '2 featured job posting per bulan',
                    'Akses penuh talent database',
                    'Analytics dashboard basic',
                    'Job invitation ke kandidat',
                    'Priority listing dalam pencarian',
                    'Support via email dan chat',
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Premium',
                'slug' => 'premium',
                'description' => 'Paket premium untuk perusahaan berkembang',
                'price_monthly' => 799000,
                'price_yearly' => 7990000, // ~16% discount
                'job_posting_limit' => 30,
                'featured_job_limit' => 10,
                'auto_promote' => true,
                'premium_badge' => true,
                'analytics_access' => true,
                'priority_support' => true,
                'talent_database_access' => true,
                'job_invitation_limit' => 100,
                'features' => [
                    'Posting hingga 30 lowongan aktif',
                    '10 featured job posting per bulan',
                    'Auto-promote ke top of search',
                    'Premium company badge',
                    'Advanced analytics dashboard',
                    'Unlimited job invitations',
                    'Akses penuh talent database',
                    'Priority support 24/7',
                    'Dedicated account manager',
                    'Custom branding on job posts',
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'Solusi lengkap untuk perusahaan besar',
                'price_monthly' => 1999000,
                'price_yearly' => 19990000, // ~16% discount
                'job_posting_limit' => null, // Unlimited
                'featured_job_limit' => null, // Unlimited
                'auto_promote' => true,
                'premium_badge' => true,
                'analytics_access' => true,
                'priority_support' => true,
                'talent_database_access' => true,
                'job_invitation_limit' => null, // Unlimited
                'features' => [
                    'Unlimited job postings',
                    'Unlimited featured job posting',
                    'Auto-promote ke top of search',
                    'Premium company badge',
                    'Enterprise analytics dashboard',
                    'Unlimited job invitations',
                    'Akses penuh talent database dengan AI matching',
                    'Priority support 24/7',
                    'Dedicated account manager',
                    'Custom branding on job posts',
                    'API access untuk integrasi',
                    'Bulk upload candidates',
                    'Custom workflows',
                    'White-label career page',
                ],
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }

        $this->command->info('Subscription plans seeded successfully!');
    }
}
