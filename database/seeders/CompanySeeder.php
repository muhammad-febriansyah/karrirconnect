<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            [
                'name' => 'TechVision Indonesia',
                'description' => 'TechVision Indonesia adalah perusahaan teknologi terkemuka yang fokus pada pengembangan solusi digital inovatif untuk berbagai industri. Kami berkomitmen untuk menciptakan teknologi yang mengubah cara bisnis beroperasi.',
                'website' => 'https://techvision.co.id',
                'industry' => 'Information Technology',
                'size' => '100-500',
                'location' => 'Jakarta',
                'address' => 'Jl. Sudirman No. 100, Jakarta Selatan 12190',
                'email' => 'career@techvision.co.id',
                'phone' => '+62 21 5082 1001',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/company/techvision-id',
                    'instagram' => 'https://instagram.com/techvision.id',
                    'twitter' => 'https://twitter.com/techvisionid'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 100,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
            [
                'name' => 'Global Finance Solutions',
                'description' => 'Global Finance Solutions adalah perusahaan konsultan keuangan yang menyediakan layanan perbankan, investasi, dan manajemen aset untuk klien korporat dan retail di seluruh Indonesia.',
                'website' => 'https://gfsolutions.co.id',
                'industry' => 'Finance & Banking',
                'size' => '500-1000',
                'location' => 'Jakarta',
                'address' => 'Menara BCA, Jl. MH Thamrin No. 1, Jakarta Pusat 10310',
                'email' => 'hr@gfsolutions.co.id',
                'phone' => '+62 21 2358 0000',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/company/gf-solutions',
                    'facebook' => 'https://facebook.com/gfsolutions'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 150,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
            [
                'name' => 'Creative Media Hub',
                'description' => 'Creative Media Hub adalah agensi kreatif full-service yang mengkhususkan diri dalam branding, desain grafis, produksi video, dan strategi media digital untuk membantu brand berkembang.',
                'website' => 'https://creativemediahub.id',
                'industry' => 'Creative & Design',
                'size' => '50-100',
                'location' => 'Bandung',
                'address' => 'Jl. Riau No. 50, Bandung 40116',
                'email' => 'jobs@creativemediahub.id',
                'phone' => '+62 22 4231 5000',
                'social_links' => [
                    'instagram' => 'https://instagram.com/creativemediahub',
                    'behance' => 'https://behance.net/creativemediahub'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 80,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
            [
                'name' => 'HealthCare Plus',
                'description' => 'HealthCare Plus adalah jaringan klinik dan rumah sakit modern yang menyediakan layanan kesehatan berkualitas tinggi dengan teknologi medis terkini dan tenaga medis profesional.',
                'website' => 'https://healthcareplus.id',
                'industry' => 'Healthcare & Medical',
                'size' => '1000+',
                'location' => 'Surabaya',
                'address' => 'Jl. HR Muhammad No. 140, Surabaya 60244',
                'email' => 'recruitment@healthcareplus.id',
                'phone' => '+62 31 5687 2000',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/company/healthcareplus',
                    'facebook' => 'https://facebook.com/healthcareplus.id'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 200,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
            [
                'name' => 'EduTech Academy',
                'description' => 'EduTech Academy adalah platform edukasi online yang menyediakan kursus berkualitas dalam berbagai bidang dari programming, desain, bisnis, hingga pengembangan diri dengan instruktur berpengalaman.',
                'website' => 'https://edutechacademy.id',
                'industry' => 'Education & Training',
                'size' => '100-500',
                'location' => 'Jakarta',
                'address' => 'Jl. Gatot Subroto Kav. 18, Jakarta Selatan 12930',
                'email' => 'careers@edutechacademy.id',
                'phone' => '+62 21 5290 8888',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/company/edutech-academy',
                    'instagram' => 'https://instagram.com/edutechacademy',
                    'youtube' => 'https://youtube.com/@edutechacademy'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 120,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
            [
                'name' => 'BuildPro Construction',
                'description' => 'BuildPro Construction adalah perusahaan konstruksi terpercaya dengan pengalaman lebih dari 20 tahun dalam membangun proyek residensial, komersial, dan infrastruktur berkualitas tinggi.',
                'website' => 'https://buildpro.co.id',
                'industry' => 'Construction',
                'size' => '500-1000',
                'location' => 'Jakarta',
                'address' => 'Jl. TB Simatupang Kav. 1, Jakarta Selatan 12560',
                'email' => 'hr@buildpro.co.id',
                'phone' => '+62 21 7599 3000',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/company/buildpro-construction',
                    'facebook' => 'https://facebook.com/buildpro.id'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 130,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
            [
                'name' => 'FoodieNation',
                'description' => 'FoodieNation adalah rantai restoran dan cafe modern yang menghadirkan konsep farm-to-table dengan menu sehat, lezat, dan berkelanjutan di berbagai kota besar Indonesia.',
                'website' => 'https://foodienation.id',
                'industry' => 'Hospitality & Tourism',
                'size' => '100-500',
                'location' => 'Bali',
                'address' => 'Jl. Sunset Road No. 86, Kuta, Bali 80361',
                'email' => 'recruitment@foodienation.id',
                'phone' => '+62 361 7890 1234',
                'social_links' => [
                    'instagram' => 'https://instagram.com/foodienation.id',
                    'facebook' => 'https://facebook.com/foodienation',
                    'tiktok' => 'https://tiktok.com/@foodienation'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 90,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
            [
                'name' => 'LogistikPro Indonesia',
                'description' => 'LogistikPro adalah perusahaan logistik dan supply chain management yang menyediakan solusi pengiriman, warehousing, dan distribusi terintegrasi untuk e-commerce dan retail.',
                'website' => 'https://logistikpro.id',
                'industry' => 'Logistics & Supply Chain',
                'size' => '1000+',
                'location' => 'Tangerang',
                'address' => 'Kawasan Industri Jababeka, Cikarang, Bekasi 17530',
                'email' => 'career@logistikpro.id',
                'phone' => '+62 21 8990 5000',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/company/logistikpro',
                    'instagram' => 'https://instagram.com/logistikpro.id'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 180,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
            [
                'name' => 'SmartRetail Indonesia',
                'description' => 'SmartRetail adalah perusahaan retail modern yang mengoperasikan berbagai toko elektronik, fashion, dan lifestyle dengan teknologi retail terkini dan pengalaman belanja yang menyenangkan.',
                'website' => 'https://smartretail.co.id',
                'industry' => 'Manufacturing & Production',
                'size' => '500-1000',
                'location' => 'Surabaya',
                'address' => 'Jl. Basuki Rahmat No. 8-12, Surabaya 60261',
                'email' => 'hrd@smartretail.co.id',
                'phone' => '+62 31 5320 9000',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/company/smartretail',
                    'instagram' => 'https://instagram.com/smartretail.id',
                    'facebook' => 'https://facebook.com/smartretail'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 140,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
            [
                'name' => 'Digital Marketing Pro',
                'description' => 'Digital Marketing Pro adalah agensi digital marketing terkemuka yang membantu brand meningkatkan presence online mereka melalui SEO, SEM, social media marketing, dan content strategy.',
                'website' => 'https://digitalmarketingpro.id',
                'industry' => 'Marketing & Sales',
                'size' => '50-100',
                'location' => 'Jakarta',
                'address' => 'Jl. Kuningan Barat No. 8, Jakarta Selatan 12710',
                'email' => 'jobs@digitalmarketingpro.id',
                'phone' => '+62 21 5269 4000',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/company/digital-marketing-pro',
                    'instagram' => 'https://instagram.com/dmpro.id',
                    'twitter' => 'https://twitter.com/dmpro_id'
                ],
                'verification_status' => 'verified',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 110,
                'total_job_posts' => 0,
                'active_job_posts' => 0,
            ],
        ];

        foreach ($companies as $companyData) {
            // Create the company first
            $company = Company::create([
                'name' => $companyData['name'],
                'slug' => Str::slug($companyData['name']),
                'description' => $companyData['description'],
                'website' => $companyData['website'],
                'industry' => $companyData['industry'],
                'size' => $companyData['size'],
                'location' => $companyData['location'],
                'address' => $companyData['address'],
                'email' => $companyData['email'],
                'phone' => $companyData['phone'],
                'social_links' => $companyData['social_links'],
                'verification_status' => $companyData['verification_status'],
                'is_verified' => $companyData['is_verified'],
                'is_active' => $companyData['is_active'],
                'job_posting_points' => $companyData['job_posting_points'],
                'total_job_posts' => $companyData['total_job_posts'],
                'active_job_posts' => $companyData['active_job_posts'],
            ]);

            // Create a company admin user for each company
            User::create([
                'name' => $companyData['name'] . ' Admin',
                'email' => 'admin@' . str_replace(['https://', 'http://'], '', $companyData['website']),
                'password' => bcrypt('password123'),
                'email_verified_at' => now(),
                'role' => 'company_admin',
                'company_id' => $company->id,
            ]);
        }

        $this->command->info('✓ ' . count($companies) . ' companies have been seeded successfully!');
    }
}
