<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\JobListing;
use App\Models\JobCategory;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class JobListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::where('is_verified', true)->get();

        if ($companies->count() === 0) {
            $this->command->error('No verified companies found. Please run CompanySeeder first.');
            return;
        }

        $jobCategories = JobCategory::all();

        if ($jobCategories->count() === 0) {
            $this->command->error('No job categories found. Please run JobCategorySeeder first.');
            return;
        }

        $jobListings = [
            [
                'company_name' => 'TechVision Indonesia',
                'title' => 'Senior Full Stack Developer',
                'description' => "Kami mencari Senior Full Stack Developer yang berpengalaman untuk bergabung dengan tim engineering kami. Anda akan bertanggung jawab untuk mengembangkan aplikasi web modern menggunakan teknologi terkini.\n\nTanggung Jawab:\n- Mengembangkan dan maintain aplikasi web full-stack\n- Berkolaborasi dengan tim product dan design\n- Code review dan mentoring developer junior\n- Mengoptimalkan performa aplikasi\n- Implementasi best practices dalam pengembangan software",
                'requirements' => "- Minimal 5 tahun pengalaman sebagai Full Stack Developer\n- Menguasai React, Node.js, dan TypeScript\n- Pengalaman dengan database SQL dan NoSQL\n- Familiar dengan cloud services (AWS/GCP/Azure)\n- Pemahaman yang baik tentang software architecture\n- Kemampuan problem-solving yang excellent\n- Good communication dan teamwork skills",
                'benefits' => "- Gaji kompetitif sesuai pengalaman\n- BPJS Kesehatan dan Ketenagakerjaan\n- Flexible working hours\n- Work from home option\n- Annual bonus dan performance incentive\n- Health insurance untuk keluarga\n- Laptop dan peralatan kerja\n- Training dan certification program\n- Team building dan company trip",
                'employment_type' => 'full_time',
                'work_arrangement' => 'hybrid',
                'experience_level' => 'senior',
                'salary_min' => 15000000,
                'salary_max' => 25000000,
                'location' => 'Jakarta',
                'category' => 'Information Technology',
                'positions_available' => 2,
                'application_deadline' => Carbon::now()->addMonths(2),
            ],
            [
                'company_name' => 'Global Finance Solutions',
                'title' => 'Financial Analyst',
                'description' => "Global Finance Solutions membuka kesempatan untuk posisi Financial Analyst. Anda akan menjadi bagian dari tim yang menangani analisis keuangan untuk klien korporat kami.\n\nTanggung Jawab:\n- Melakukan analisis laporan keuangan perusahaan\n- Membuat financial modeling dan forecasting\n- Menyiapkan presentasi untuk klien\n- Monitoring market trends dan memberikan insight\n- Support dalam proses M&A dan valuations",
                'requirements' => "- Lulusan S1 Finance, Accounting, atau Ekonomi\n- Minimal 2-3 tahun pengalaman di bidang financial analysis\n- Menguasai Excel dan financial modeling\n- Familiar dengan Bloomberg Terminal\n- Pemahaman yang baik tentang accounting standards\n- Analytical thinking dan attention to detail\n- Sertifikasi CFA level 1 (preferred)",
                'benefits' => "- Gaji pokok + bonus tahunan\n- Medical insurance (termasuk rawat inap)\n- Tunjangan transportasi dan makan\n- Professional development program\n- Career progression yang jelas\n- Modern office facility\n- Employee stock option",
                'employment_type' => 'full_time',
                'work_arrangement' => 'on_site',
                'experience_level' => 'mid',
                'salary_min' => 10000000,
                'salary_max' => 18000000,
                'location' => 'Jakarta',
                'category' => 'Finance & Banking',
                'positions_available' => 3,
                'application_deadline' => Carbon::now()->addMonths(1)->addDays(15),
            ],
            [
                'company_name' => 'Creative Media Hub',
                'title' => 'UI/UX Designer',
                'description' => "Join our creative team sebagai UI/UX Designer! Kami mencari designer yang passionate dalam menciptakan user experience yang memorable dan interface yang beautiful.\n\nTanggung Jawab:\n- Design user interface untuk web dan mobile applications\n- Conduct user research dan usability testing\n- Create wireframes, prototypes, dan high-fidelity designs\n- Collaborate dengan developers untuk implementasi\n- Maintain design system dan style guides",
                'requirements' => "- Portfolio yang menunjukkan UI/UX design projects\n- Minimal 2 tahun pengalaman sebagai UI/UX Designer\n- Mahir menggunakan Figma, Adobe XD, atau Sketch\n- Pemahaman tentang design thinking dan user-centered design\n- Knowledge of HTML/CSS (nice to have)\n- Creative, detail-oriented, dan good communication\n- Dapat bekerja dalam deadline",
                'benefits' => "- Competitive salary\n- Health insurance\n- Creative workspace\n- Latest design tools subscription\n- Flexible working hours\n- Learning budget untuk workshop/courses\n- Casual dress code\n- Free snacks dan coffee",
                'employment_type' => 'full_time',
                'work_arrangement' => 'hybrid',
                'experience_level' => 'mid',
                'salary_min' => 8000000,
                'salary_max' => 14000000,
                'location' => 'Bandung',
                'category' => 'Creative & Design',
                'positions_available' => 1,
                'application_deadline' => Carbon::now()->addMonth(),
            ],
            [
                'company_name' => 'HealthCare Plus',
                'title' => 'Staff Nurse',
                'description' => "HealthCare Plus Hospital membuka lowongan untuk Staff Nurse yang akan bertugas di berbagai unit perawatan. Kami mencari perawat profesional yang caring dan dedicated.\n\nTanggung Jawab:\n- Memberikan asuhan keperawatan kepada pasien\n- Monitoring kondisi pasien dan vital signs\n- Memberikan obat sesuai instruksi dokter\n- Dokumentasi medical records\n- Edukasi kesehatan kepada pasien dan keluarga",
                'requirements' => "- Lulusan D3/S1 Keperawatan (Ners)\n- Memiliki STR yang masih aktif\n- Fresh graduate welcome to apply\n- Mampu bekerja dalam shift\n- Komunikatif dan empati terhadap pasien\n- Teliti, bertanggung jawab, dan cekatan\n- Dapat bekerja dalam tim",
                'benefits' => "- Gaji sesuai standar RS + shift allowance\n- BPJS Kesehatan dan Ketenagakerjaan\n- Medical check-up rutin\n- Uniform disediakan\n- Fasilitas kesehatan untuk karyawan\n- Training dan development berkelanjutan\n- Jenjang karir yang jelas",
                'employment_type' => 'full_time',
                'work_arrangement' => 'on_site',
                'experience_level' => 'entry',
                'salary_min' => 5000000,
                'salary_max' => 8000000,
                'location' => 'Surabaya',
                'category' => 'Healthcare & Medical',
                'positions_available' => 5,
                'application_deadline' => Carbon::now()->addDays(45),
            ],
            [
                'company_name' => 'EduTech Academy',
                'title' => 'Content Creator & Video Editor',
                'description' => "EduTech Academy mencari Content Creator yang juga skilled dalam video editing untuk membuat konten edukatif yang engaging dan berkualitas tinggi.\n\nTanggung Jawab:\n- Membuat video edukasi untuk berbagai courses\n- Editing video dengan motion graphics dan animations\n- Develop content strategy untuk social media\n- Collaborate dengan instructors dan subject matter experts\n- Optimize content untuk berbagai platform",
                'requirements' => "- Minimal 1-2 tahun pengalaman sebagai Content Creator/Video Editor\n- Portfolio video yang impressive\n- Mahir Adobe Premiere Pro, After Effects, dan DaVinci Resolve\n- Skill dalam motion graphics dan animation\n- Pemahaman tentang storytelling dan educational content\n- Creative, proactive, dan detail-oriented\n- Good time management skills",
                'benefits' => "- Gaji kompetitif\n- Health insurance\n- Free access to all courses\n- Modern editing equipment\n- Flexible working arrangement\n- Creative freedom\n- Annual performance bonus\n- Friendly work environment",
                'employment_type' => 'full_time',
                'work_arrangement' => 'hybrid',
                'experience_level' => 'junior',
                'salary_min' => 6000000,
                'salary_max' => 10000000,
                'location' => 'Jakarta',
                'category' => 'Education & Training',
                'positions_available' => 2,
                'application_deadline' => Carbon::now()->addDays(30),
            ],
            [
                'company_name' => 'BuildPro Construction',
                'title' => 'Project Manager',
                'description' => "BuildPro Construction membuka kesempatan untuk posisi Project Manager yang akan memimpin proyek konstruksi skala besar.\n\nTanggung Jawab:\n- Mengelola project dari planning hingga completion\n- Koordinasi dengan contractors, suppliers, dan stakeholders\n- Monitoring budget, timeline, dan quality control\n- Risk management dan problem solving\n- Reporting progress kepada management",
                'requirements' => "- Lulusan S1 Teknik Sipil atau terkait\n- Minimal 5 tahun pengalaman di construction project management\n- Memiliki sertifikasi PMP (preferred)\n- Pemahaman yang kuat tentang construction methods\n- Leadership dan communication skills yang excellent\n- Mampu bekerja under pressure\n- Familiar dengan project management software",
                'benefits' => "- Salary package yang menarik\n- Project completion bonus\n- Health insurance untuk keluarga\n- Company car atau car allowance\n- Mobile phone allowance\n- Professional certification support\n- Career development program",
                'employment_type' => 'full_time',
                'work_arrangement' => 'on_site',
                'experience_level' => 'senior',
                'salary_min' => 18000000,
                'salary_max' => 30000000,
                'location' => 'Jakarta',
                'category' => 'Construction',
                'positions_available' => 1,
                'application_deadline' => Carbon::now()->addMonths(1),
            ],
            [
                'company_name' => 'FoodieNation',
                'title' => 'Restaurant Manager',
                'description' => "FoodieNation sedang expand dan membuka outlet baru! Kami mencari Restaurant Manager yang experienced untuk memimpin operasional restoran kami.\n\nTanggung Jawab:\n- Mengelola daily operations restoran\n- Managing dan training staff\n- Ensuring customer satisfaction\n- Inventory dan cost control\n- Maintaining quality standards dan food safety",
                'requirements' => "- Minimal 3 tahun pengalaman sebagai Restaurant Manager\n- Background di hospitality atau F&B industry\n- Leadership dan people management skills\n- Customer service oriented\n- Understanding of P&L dan cost management\n- Bersedia bekerja di weekend dan public holidays\n- Passionate tentang food dan culinary",
                'benefits' => "- Competitive salary + service charge\n- Performance bonus quarterly\n- Medical insurance\n- Staff meals\n- Employee discount\n- Career growth opportunities\n- Training programs",
                'employment_type' => 'full_time',
                'work_arrangement' => 'on_site',
                'experience_level' => 'mid',
                'salary_min' => 8000000,
                'salary_max' => 13000000,
                'location' => 'Bali',
                'category' => 'Hospitality & Tourism',
                'positions_available' => 2,
                'application_deadline' => Carbon::now()->addDays(40),
            ],
            [
                'company_name' => 'LogistikPro Indonesia',
                'title' => 'Warehouse Supervisor',
                'description' => "LogistikPro Indonesia mencari Warehouse Supervisor untuk memimpin operasional gudang dan memastikan kelancaran distribusi.\n\nTanggung Jawab:\n- Supervise warehouse operations dan team\n- Manage inventory control dan stock accuracy\n- Ensure warehouse safety standards\n- Coordinate dengan logistics dan delivery team\n- Optimize warehouse layout dan processes",
                'requirements' => "- Minimal 2-3 tahun pengalaman sebagai Warehouse Supervisor\n- Pemahaman tentang inventory management\n- Familiar dengan WMS (Warehouse Management System)\n- Leadership dan organizational skills\n- Good in problem solving\n- Dapat bekerja dalam shift\n- Bersedia ditempatkan di area Cikarang",
                'benefits' => "- Gaji pokok + shift allowance\n- BPJS dan insurance\n- Transportasi/shuttle provided\n- Meal allowance\n- Performance incentive\n- Overtime pay\n- Annual bonus",
                'employment_type' => 'full_time',
                'work_arrangement' => 'on_site',
                'experience_level' => 'mid',
                'salary_min' => 7000000,
                'salary_max' => 11000000,
                'location' => 'Tangerang',
                'category' => 'Logistics & Supply Chain',
                'positions_available' => 3,
                'application_deadline' => Carbon::now()->addDays(35),
            ],
            [
                'company_name' => 'SmartRetail Indonesia',
                'title' => 'Sales Associate',
                'description' => "SmartRetail membuka lowongan untuk Sales Associate di berbagai cabang toko kami. Join our team dan kembangkan karir di retail industry!\n\nTanggung Jawab:\n- Melayani customers dengan excellent service\n- Product demonstration dan sales\n- Merchandising dan display produk\n- Mencapai sales target yang ditetapkan\n- Handling customer complaints",
                'requirements' => "- Minimal lulusan SMA/SMK\n- Fresh graduate welcome to apply\n- Customer service oriented\n- Good communication dan interpersonal skills\n- Rapih, ramah, dan energik\n- Jujur dan bertanggung jawab\n- Bersedia bekerja shift dan weekend",
                'benefits' => "- Gaji pokok + sales commission\n- Medical insurance\n- Employee discount 20%\n- Meal allowance\n- Incentive bulanan\n- Training program\n- Career advancement opportunities",
                'employment_type' => 'full_time',
                'work_arrangement' => 'on_site',
                'experience_level' => 'entry',
                'salary_min' => 4500000,
                'salary_max' => 7000000,
                'location' => 'Surabaya',
                'category' => 'Manufacturing & Production',
                'positions_available' => 10,
                'application_deadline' => Carbon::now()->addDays(25),
            ],
            [
                'company_name' => 'Digital Marketing Pro',
                'title' => 'Digital Marketing Specialist',
                'description' => "Digital Marketing Pro sedang mencari Digital Marketing Specialist yang akan handle campaign untuk berbagai klien dari berbagai industri.\n\nTanggung Jawab:\n- Merencanakan dan execute digital marketing campaigns\n- Manage social media accounts untuk klien\n- SEO/SEM optimization\n- Content creation dan copywriting\n- Analytics dan reporting campaign performance",
                'requirements' => "- Minimal 1-2 tahun pengalaman di digital marketing\n- Pemahaman yang baik tentang Google Ads, Facebook Ads, Instagram Ads\n- Familiar dengan Google Analytics dan SEO tools\n- Good copywriting skills\n- Creative dan up-to-date dengan digital trends\n- Analytical thinking\n- Portfolio kampanye digital (nice to have)",
                'benefits' => "- Competitive salary\n- Health insurance\n- Modern workspace\n- Flexible working hours\n- WFH options\n- Training dan certification\n- Project bonus\n- Fun team culture",
                'employment_type' => 'full_time',
                'work_arrangement' => 'hybrid',
                'experience_level' => 'junior',
                'salary_min' => 6000000,
                'salary_max' => 10000000,
                'location' => 'Jakarta',
                'category' => 'Marketing & Sales',
                'positions_available' => 2,
                'application_deadline' => Carbon::now()->addMonth(),
            ],
        ];

        $createdCount = 0;

        foreach ($jobListings as $jobData) {
            // Find company by name
            $company = $companies->firstWhere('name', $jobData['company_name']);

            if (!$company) {
                $this->command->warn("Company '{$jobData['company_name']}' not found. Skipping job: {$jobData['title']}");
                continue;
            }

            // Find category by name
            $category = $jobCategories->firstWhere('name', $jobData['category']);

            if (!$category) {
                $this->command->warn("Category '{$jobData['category']}' not found. Skipping job: {$jobData['title']}");
                continue;
            }

            // Get company admin user
            $companyAdmin = $company->users()->where('role', 'company_admin')->first();

            // Create job listing
            JobListing::create([
                'company_id' => $company->id,
                'job_category_id' => $category->id,
                'created_by' => $companyAdmin?->id,
                'title' => $jobData['title'],
                'description' => $jobData['description'],
                'requirements' => $jobData['requirements'],
                'benefits' => $jobData['benefits'],
                'employment_type' => $jobData['employment_type'],
                'work_arrangement' => $jobData['work_arrangement'],
                'experience_level' => $jobData['experience_level'],
                'salary_min' => $jobData['salary_min'],
                'salary_max' => $jobData['salary_max'],
                'salary_currency' => 'IDR',
                'salary_negotiable' => false,
                'location' => $jobData['location'],
                'positions_available' => $jobData['positions_available'],
                'application_deadline' => $jobData['application_deadline'],
                'status' => 'published',
                'featured' => false,
                'views_count' => rand(50, 500),
                'applications_count' => 0,
            ]);

            $createdCount++;
        }

        $this->command->info("✓ {$createdCount} job listings have been seeded successfully!");
    }
}
