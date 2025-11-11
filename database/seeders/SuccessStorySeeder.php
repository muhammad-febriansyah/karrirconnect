<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SuccessStory;

class SuccessStorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        SuccessStory::truncate();

        $stories = [
            [
                'name' => 'Andi Prasetyo',
                'position' => 'Senior Full Stack Developer',
                'company' => 'TechVision Indonesia',
                'story' => 'Setelah 3 bulan mencari kerja, akhirnya saya berhasil mendapatkan posisi impian sebagai Senior Full Stack Developer di TechVision Indonesia melalui KarirConnect. Platform ini membantu saya menemukan peluang yang tepat dan mempersiapkan interview dengan baik. Gaji saya naik 150% dari pekerjaan sebelumnya! Tim di TechVision sangat supportive dan environment-nya mendukung untuk terus berkembang.',
                'location' => 'Jakarta',
                'experience_years' => 5,
                'salary_before' => 10000000,
                'salary_after' => 25000000,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Siti Maharani',
                'position' => 'Financial Analyst',
                'company' => 'Global Finance Solutions',
                'story' => 'Transisi karir dari accounting ke financial analyst bukanlah hal yang mudah. Tapi dengan bantuan tips dan panduan dari KarirConnect, saya berhasil membuktikan kemampuan saya dan diterima sebagai Financial Analyst di Global Finance Solutions. Interview process-nya challenging tapi fair, dan sekarang saya bekerja dengan tim profesional yang luar biasa. Terima kasih KarirConnect!',
                'location' => 'Jakarta',
                'experience_years' => 4,
                'salary_before' => 8000000,
                'salary_after' => 16000000,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Budi Setiawan',
                'position' => 'UI/UX Designer',
                'company' => 'Creative Media Hub',
                'story' => 'Sebagai fresh graduate dari desain grafis, saya merasa kesulitan untuk mendapatkan pekerjaan di bidang UI/UX. KarirConnect membantu saya menemukan perusahaan yang cocok dan memberikan tips untuk meningkatkan portfolio. Sekarang saya bekerja sebagai UI/UX Designer di Creative Media Hub di Bandung! Suasana kerja sangat creative dan saya banyak belajar dari senior designer di sini.',
                'location' => 'Bandung',
                'experience_years' => 1,
                'salary_before' => 5000000,
                'salary_after' => 12000000,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Maya Kusuma',
                'position' => 'Staff Nurse',
                'company' => 'HealthCare Plus',
                'story' => 'Berkat platform KarirConnect, saya berhasil menemukan pekerjaan sebagai Staff Nurse di HealthCare Plus Hospital Surabaya. Proses apply yang mudah dan informasi lengkap tentang perusahaan sangat membantu saya dalam persiapan interview. Rumah sakit ini memiliki fasilitas modern dan sangat concern dengan development karyawan. Saya mendapat training rutin dan jenjang karir yang jelas.',
                'location' => 'Surabaya',
                'experience_years' => 2,
                'salary_before' => 4500000,
                'salary_after' => 7500000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Rizky Akbar',
                'position' => 'Content Creator & Video Editor',
                'company' => 'EduTech Academy',
                'story' => 'Saya sempat freelance selama 2 tahun dan ingin mendapat pekerjaan tetap yang sesuai passion. KarirConnect membantu saya menemukan peluang karir yang tepat sebagai Content Creator di EduTech Academy. Sekarang saya membuat konten edukatif yang bermanfaat dan mendapat fasilitas peralatan editing yang lengkap. Work-life balance juga sangat baik dengan flexible working hours!',
                'location' => 'Jakarta',
                'experience_years' => 3,
                'salary_before' => 7000000,
                'salary_after' => 10000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Dewi Anggraeni',
                'position' => 'Project Manager',
                'company' => 'BuildPro Construction',
                'story' => 'Setelah 5 tahun bekerja sebagai site engineer, saya ingin naik level menjadi project manager. KarirConnect memberikan insight tentang skill yang dibutuhkan dan membantu saya prepare untuk interview. Alhamdulillah berhasil diterima sebagai Project Manager di BuildPro Construction. Gaji naik signifikan dan tanggung jawab yang lebih besar memotivasi saya untuk terus berkembang.',
                'location' => 'Jakarta',
                'experience_years' => 6,
                'salary_before' => 15000000,
                'salary_after' => 28000000,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Ahmad Firdaus',
                'position' => 'Restaurant Manager',
                'company' => 'FoodieNation',
                'story' => 'Passion saya di bidang F&B akhirnya tersalurkan dengan bergabung di FoodieNation sebagai Restaurant Manager. KarirConnect membantu saya menemukan posisi yang sesuai dengan minat dan pengalaman saya. Working di Bali dengan company culture yang amazing dan menu yang healthy & sustainable membuat saya excited setiap hari bekerja!',
                'location' => 'Bali',
                'experience_years' => 4,
                'salary_before' => 7000000,
                'salary_after' => 12000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'Linda Permata',
                'position' => 'Warehouse Supervisor',
                'company' => 'LogistikPro Indonesia',
                'story' => 'Transisi dari admin gudang ke supervisor ternyata bisa terjadi lebih cepat dari yang saya bayangkan. KarirConnect membantu saya memahami requirement untuk posisi supervisor dan mempersiapkan diri dengan baik. Sekarang saya bekerja sebagai Warehouse Supervisor di LogistikPro dengan team yang solid dan sistem kerja yang terorganisir dengan baik.',
                'location' => 'Tangerang',
                'experience_years' => 3,
                'salary_before' => 5500000,
                'salary_after' => 10000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => 'Rendi Wijaya',
                'position' => 'Sales Associate',
                'company' => 'SmartRetail Indonesia',
                'story' => 'Sebagai fresh graduate yang baru lulus SMA, saya bersyukur bisa langsung dapat kerja sebagai Sales Associate di SmartRetail Indonesia melalui KarirConnect. Prosesnya cepat dan mudah. Perusahaan memberikan training yang lengkap dan ada jenjang karir yang jelas. Commission-nya juga menarik, saya bisa dapat penghasilan lebih dari Rp 7 juta per bulan!',
                'location' => 'Surabaya',
                'experience_years' => 1,
                'salary_before' => 0,
                'salary_after' => 6500000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'name' => 'Putri Andini',
                'position' => 'Digital Marketing Specialist',
                'company' => 'Digital Marketing Pro',
                'story' => 'Dari social media admin menjadi Digital Marketing Specialist adalah achievement yang saya banggakan. KarirConnect membantu saya menemukan peluang di Digital Marketing Pro yang memberikan kesempatan untuk handle campaign besar dari berbagai klien. Environment-nya sangat mendukung untuk learning dan ada mentor yang berpengalaman. Highly recommended untuk yang mau develop skill di digital marketing!',
                'location' => 'Jakarta',
                'experience_years' => 2,
                'salary_before' => 5000000,
                'salary_after' => 9000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 10,
            ],
        ];

        foreach ($stories as $story) {
            SuccessStory::create($story);
        }

        $this->command->info('✓ ' . count($stories) . ' success stories have been seeded successfully!');
    }
}
