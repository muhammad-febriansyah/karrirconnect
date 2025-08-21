<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\News;
use App\Models\User;
use App\Models\JobApplication;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class HomepageDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create job categories
        $categories = [
            [
                'name' => 'Information Technology',
                'description' => 'Software development, programming, system administration',
                'slug' => 'information-technology',
                'icon' => '💻',
                'is_active' => true,
            ],
            [
                'name' => 'Marketing & Sales',
                'description' => 'Digital marketing, sales, business development',
                'slug' => 'marketing-sales',
                'icon' => '📈',
                'is_active' => true,
            ],
            [
                'name' => 'Finance & Accounting',
                'description' => 'Financial analysis, accounting, auditing',
                'slug' => 'finance-accounting',
                'icon' => '💰',
                'is_active' => true,
            ],
            [
                'name' => 'Design & Creative',
                'description' => 'UI/UX design, graphic design, creative content',
                'slug' => 'design-creative',
                'icon' => '🎨',
                'is_active' => true,
            ],
            [
                'name' => 'Human Resources',
                'description' => 'Talent acquisition, HR management, training',
                'slug' => 'human-resources',
                'icon' => '👥',
                'is_active' => true,
            ],
            [
                'name' => 'Engineering',
                'description' => 'Mechanical, electrical, civil engineering',
                'slug' => 'engineering',
                'icon' => '⚙️',
                'is_active' => true,
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $category) {
            $createdCategories[] = JobCategory::firstOrCreate(
                ['name' => $category['name']],
                $category
            );
        }

        // Create companies
        $companies = [
            [
                'name' => 'TechCorp Indonesia',
                'description' => 'Leading technology company specializing in digital transformation and cloud solutions.',
                'website' => 'https://techcorp.id',
                'industry' => 'Technology',
                'size' => '1000-5000 employees',
                'location' => 'Jakarta, Indonesia',
                'email' => 'hr@techcorp.id',
                'phone' => '+62-21-1234-5678',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 50,
                'total_job_posts' => 15,
                'active_job_posts' => 8,
                'max_active_jobs' => 20,
            ],
            [
                'name' => 'Digital Marketing Pro',
                'description' => 'Full-service digital marketing agency helping businesses grow online.',
                'website' => 'https://digitalmarketingpro.co.id',
                'industry' => 'Marketing & Advertising',
                'size' => '100-500 employees',
                'location' => 'Bandung, Indonesia',
                'email' => 'careers@digitalmarketingpro.co.id',
                'phone' => '+62-22-9876-5432',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 30,
                'total_job_posts' => 8,
                'active_job_posts' => 5,
                'max_active_jobs' => 10,
            ],
            [
                'name' => 'Fintech Solutions',
                'description' => 'Innovative fintech company providing digital payment and lending solutions.',
                'website' => 'https://fintechsolutions.id',
                'industry' => 'Financial Services',
                'size' => '500-1000 employees',
                'location' => 'Surabaya, Indonesia',
                'email' => 'hr@fintechsolutions.id',
                'phone' => '+62-31-5555-1234',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 40,
                'total_job_posts' => 12,
                'active_job_posts' => 7,
                'max_active_jobs' => 15,
            ],
            [
                'name' => 'Creative Studio',
                'description' => 'Award-winning creative studio specializing in branding and digital experiences.',
                'website' => 'https://creativestudio.co.id',
                'industry' => 'Design & Creative',
                'size' => '50-100 employees',
                'location' => 'Yogyakarta, Indonesia',
                'email' => 'hello@creativestudio.co.id',
                'phone' => '+62-274-8888-9999',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 25,
                'total_job_posts' => 6,
                'active_job_posts' => 4,
                'max_active_jobs' => 8,
            ],
            [
                'name' => 'Global Manufacturing',
                'description' => 'International manufacturing company with operations across Southeast Asia.',
                'website' => 'https://globalmanufacturing.com',
                'industry' => 'Manufacturing',
                'size' => '5000+ employees',
                'location' => 'Karawang, Indonesia',
                'email' => 'recruitment@globalmanufacturing.com',
                'phone' => '+62-267-444-5555',
                'is_verified' => true,
                'is_active' => true,
                'job_posting_points' => 60,
                'total_job_posts' => 20,
                'active_job_posts' => 12,
                'max_active_jobs' => 25,
            ],
        ];

        $createdCompanies = [];
        foreach ($companies as $companyData) {
            $createdCompanies[] = Company::firstOrCreate(
                ['name' => $companyData['name']],
                $companyData
            );
        }

        // Create users (including job seekers and company admins)
        $users = [
            [
                'name' => 'Admin TechCorp',
                'email' => 'admin@techcorp.id',
                'password' => Hash::make('password'),
                'role' => 'company_admin',
                'company_id' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Ahmad Rizki',
                'email' => 'ahmad.rizki@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_active' => true,
            ],
            [
                'name' => 'Sari Dewi',
                'email' => 'sari.dewi@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_active' => true,
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_active' => true,
            ],
            [
                'name' => 'Maya Putri',
                'email' => 'maya.putri@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_active' => true,
            ],
            [
                'name' => 'Content Writer',
                'email' => 'writer@karirconnect.com',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'is_active' => true,
            ],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            // Update company_id based on created companies
            if (isset($userData['company_id'])) {
                $userData['company_id'] = $createdCompanies[$userData['company_id'] - 1]->id;
            }
            $createdUsers[] = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        // Create job listings
        $jobListings = [
            [
                'title' => 'Senior Full Stack Developer',
                'description' => 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
                'requirements' => 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience with React, Node.js, and PostgreSQL.',
                'benefits' => 'Health insurance, flexible working hours, remote work options, learning budget.',
                'employment_type' => 'full_time',
                'work_arrangement' => 'hybrid',
                'experience_level' => 'senior',
                'salary_min' => 15000000,
                'salary_max' => 25000000,
                'salary_currency' => 'IDR',
                'location' => 'Jakarta, Indonesia',
                'salary_negotiable' => false,
                'application_deadline' => now()->addDays(30),
                'positions_available' => 2,
                'status' => 'published',
                'featured' => true,
                'company_id' => 1,
                'job_category_id' => 1,
                'created_by' => 1,
            ],
            [
                'title' => 'Digital Marketing Specialist',
                'description' => 'Join our marketing team to create and execute digital marketing campaigns that drive brand awareness and customer engagement.',
                'requirements' => 'Degree in Marketing or related field. 3+ years experience in digital marketing, Google Ads, Facebook Ads, SEO.',
                'benefits' => 'Performance bonus, health insurance, professional development opportunities.',
                'employment_type' => 'full_time',
                'work_arrangement' => 'on_site',
                'experience_level' => 'mid',
                'salary_min' => 8000000,
                'salary_max' => 12000000,
                'salary_currency' => 'IDR',
                'location' => 'Bandung, Indonesia',
                'salary_negotiable' => false,
                'application_deadline' => now()->addDays(25),
                'positions_available' => 3,
                'status' => 'published',
                'featured' => true,
                'company_id' => 2,
                'job_category_id' => 2,
                'created_by' => 1,
            ],
            [
                'title' => 'UI/UX Designer',
                'description' => 'We are seeking a creative UI/UX Designer to design intuitive and engaging user interfaces for our digital products.',
                'requirements' => 'Bachelor\'s degree in Design or related field. Proficiency in Figma, Adobe Creative Suite. Portfolio required.',
                'benefits' => 'Creative environment, latest design tools, flexible schedule.',
                'employment_type' => 'full_time',
                'work_arrangement' => 'remote',
                'experience_level' => 'mid',
                'salary_min' => 10000000,
                'salary_max' => 15000000,
                'salary_currency' => 'IDR',
                'location' => 'Remote',
                'salary_negotiable' => false,
                'application_deadline' => now()->addDays(20),
                'positions_available' => 1,
                'status' => 'published',
                'featured' => false,
                'company_id' => 4,
                'job_category_id' => 4,
                'created_by' => 1,
            ],
            [
                'title' => 'Financial Analyst',
                'description' => 'Analyze financial data and provide insights to support business decision-making in our growing fintech company.',
                'requirements' => 'Degree in Finance, Economics, or Accounting. Strong analytical skills, Excel proficiency, SQL knowledge preferred.',
                'benefits' => 'Competitive salary, stock options, health coverage, continuous learning opportunities.',
                'employment_type' => 'full_time',
                'work_arrangement' => 'hybrid',
                'experience_level' => 'junior',
                'salary_min' => 7000000,
                'salary_max' => 10000000,
                'salary_currency' => 'IDR',
                'location' => 'Surabaya, Indonesia',
                'salary_negotiable' => false,
                'application_deadline' => now()->addDays(35),
                'positions_available' => 2,
                'status' => 'published',
                'featured' => true,
                'company_id' => 3,
                'job_category_id' => 3,
                'created_by' => 1,
            ],
            [
                'title' => 'HR Generalist',
                'description' => 'Support all aspects of human resources including recruitment, employee relations, and performance management.',
                'requirements' => 'Bachelor\'s degree in HR or related field. 2+ years HR experience, knowledge of labor law.',
                'benefits' => 'Professional development, health insurance, work-life balance.',
                'employment_type' => 'full_time',
                'work_arrangement' => 'on_site',
                'experience_level' => 'mid',
                'salary_min' => 6000000,
                'salary_max' => 9000000,
                'salary_currency' => 'IDR',
                'location' => 'Jakarta, Indonesia',
                'salary_negotiable' => true,
                'application_deadline' => now()->addDays(28),
                'positions_available' => 1,
                'status' => 'published',
                'featured' => false,
                'company_id' => 1,
                'job_category_id' => 5,
                'created_by' => 1,
            ],
            [
                'title' => 'Mechanical Engineer',
                'description' => 'Design and optimize manufacturing processes and equipment in our state-of-the-art facility.',
                'requirements' => 'Bachelor\'s degree in Mechanical Engineering. 3+ years experience in manufacturing, AutoCAD proficiency.',
                'benefits' => 'Excellent benefits package, career advancement opportunities, training programs.',
                'employment_type' => 'full_time',
                'work_arrangement' => 'on_site',
                'experience_level' => 'mid',
                'salary_min' => 9000000,
                'salary_max' => 13000000,
                'salary_currency' => 'IDR',
                'location' => 'Karawang, Indonesia',
                'salary_negotiable' => false,
                'application_deadline' => now()->addDays(40),
                'positions_available' => 3,
                'status' => 'published',
                'featured' => true,
                'company_id' => 5,
                'job_category_id' => 6,
                'created_by' => 1,
            ],
        ];

        $createdJobs = [];
        foreach ($jobListings as $index => $jobData) {
            // Update foreign keys based on created records
            $jobData['company_id'] = $createdCompanies[$jobData['company_id'] - 1]->id;
            $jobData['job_category_id'] = $createdCategories[$jobData['job_category_id'] - 1]->id;
            $jobData['created_by'] = $createdUsers[0]->id; // First user as creator
            
            $createdJobs[] = JobListing::firstOrCreate(
                ['title' => $jobData['title'], 'company_id' => $jobData['company_id']],
                $jobData
            );
        }

        // Create some job applications for success stories
        $applications = [
            [
                'job_listing_id' => 1,
                'user_id' => 2,
                'status' => 'hired',
                'created_at' => now()->subDays(90),
                'updated_at' => now()->subDays(85),
            ],
            [
                'job_listing_id' => 2,
                'user_id' => 3,
                'status' => 'hired',
                'created_at' => now()->subDays(120),
                'updated_at' => now()->subDays(115),
            ],
            [
                'job_listing_id' => 3,
                'user_id' => 4,
                'status' => 'hired',
                'created_at' => now()->subDays(60),
                'updated_at' => now()->subDays(55),
            ],
            [
                'job_listing_id' => 4,
                'user_id' => 5,
                'status' => 'hired',
                'created_at' => now()->subDays(45),
                'updated_at' => now()->subDays(40),
            ],
        ];

        foreach ($applications as $index => $appData) {
            // Update foreign keys
            $appData['job_listing_id'] = $createdJobs[$appData['job_listing_id'] - 1]->id;
            $appData['user_id'] = $createdUsers[$appData['user_id'] - 1]->id;
            
            JobApplication::firstOrCreate(
                ['job_listing_id' => $appData['job_listing_id'], 'user_id' => $appData['user_id']],
                $appData
            );
        }

        // Create news articles
        $newsArticles = [
            [
                'title' => 'Tips Sukses Wawancara Kerja di Era Digital',
                'slug' => 'tips-sukses-wawancara-kerja-era-digital',
                'excerpt' => 'Pelajari strategi terbaru untuk menghadapi wawancara kerja online dan offline di tahun 2024.',
                'content' => '<p>Wawancara kerja merupakan tahap penting dalam proses pencarian pekerjaan. Di era digital ini, ada beberapa tips yang dapat membantu Anda sukses dalam wawancara kerja...</p>',
                'status' => 'published',
                'published_at' => now()->subDays(5),
                'author_id' => 6,
            ],
            [
                'title' => 'Tren Karir IT 2024: Peluang dan Tantangan',
                'slug' => 'tren-karir-it-2024',
                'excerpt' => 'Eksplorasi tren terbaru di industri teknologi dan peluang karir yang menjanjikan.',
                'content' => '<p>Industri teknologi terus berkembang pesat. Tahun 2024 menjadi tahun yang menarik untuk profesi di bidang IT...</p>',
                'status' => 'published',
                'published_at' => now()->subDays(12),
                'author_id' => 6,
            ],
            [
                'title' => 'Panduan Lengkap Membuat CV yang Menarik',
                'slug' => 'panduan-membuat-cv-menarik',
                'excerpt' => 'Langkah-langkah praktis untuk membuat CV yang akan membuat Anda menonjol dari kandidat lain.',
                'content' => '<p>CV adalah representasi pertama Anda kepada calon employer. Berikut adalah panduan lengkap untuk membuat CV yang menarik...</p>',
                'status' => 'published',
                'published_at' => now()->subDays(8),
                'author_id' => 6,
            ],
        ];

        foreach ($newsArticles as $newsData) {
            // Update author_id
            $newsData['author_id'] = $createdUsers[5]->id; // Content Writer user
            
            News::firstOrCreate(
                ['slug' => $newsData['slug']],
                $newsData
            );
        }
    }
}