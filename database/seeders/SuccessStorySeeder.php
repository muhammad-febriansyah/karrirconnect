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
        $stories = [
            [
                'name' => 'Andi Prasetyo',
                'position' => 'Senior Software Engineer',
                'company' => 'Tokopedia',
                'story' => 'Setelah 3 bulan mencari kerja, akhirnya saya berhasil mendapatkan posisi impian sebagai Senior Software Engineer di Tokopedia. KarirConnect membantu saya menemukan peluang yang tepat dan mempersiapkan interview dengan baik. Gaji saya naik 150% dari pekerjaan sebelumnya!',
                'location' => 'Jakarta',
                'experience_years' => 5,
                'salary_before' => 8000000,
                'salary_after' => 20000000,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Siti Nurhaliza',
                'position' => 'Product Manager',
                'company' => 'Gojek',
                'story' => 'Transisi karir dari marketing ke product management bukanlah hal yang mudah. Tapi dengan bantuan tips dan panduan dari KarirConnect, saya berhasil membuktikan kemampuan saya dan diterima sebagai Product Manager di Gojek. Terima kasih KarirConnect!',
                'location' => 'Jakarta',
                'experience_years' => 4,
                'salary_before' => 12000000,
                'salary_after' => 18000000,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Budi Santoso',
                'position' => 'Data Scientist',
                'company' => 'Shopee',
                'story' => 'Sebagai fresh graduate, saya merasa kesulitan untuk mendapatkan pekerjaan di bidang data science. KarirConnect membantu saya menemukan perusahaan yang cocok dan memberikan tips untuk meningkatkan skill. Sekarang saya bekerja sebagai Data Scientist di Shopee!',
                'location' => 'Jakarta',
                'experience_years' => 1,
                'salary_before' => 0,
                'salary_after' => 15000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Maya Sari',
                'position' => 'UX Designer',
                'company' => 'Traveloka',
                'story' => 'Berkat platform KarirConnect, saya berhasil menemukan pekerjaan sebagai UX Designer di Traveloka. Proses apply yang mudah dan informasi lengkap tentang perusahaan sangat membantu saya dalam persiapan interview.',
                'location' => 'Jakarta',
                'experience_years' => 3,
                'salary_before' => 9000000,
                'salary_after' => 16000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Rizky Ramadhan',
                'position' => 'DevOps Engineer',
                'company' => 'Blibli',
                'story' => 'Saya sempat terjebak di pekerjaan yang tidak sesuai passion selama 2 tahun. KarirConnect membantu saya menemukan peluang karir yang tepat sebagai DevOps Engineer. Sekarang saya jauh lebih bahagia dan berkembang pesat!',
                'location' => 'Jakarta',
                'experience_years' => 4,
                'salary_before' => 10000000,
                'salary_after' => 17000000,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Dewi Lestari',
                'position' => 'Marketing Manager',
                'company' => 'Unilever',
                'story' => 'Setelah 5 tahun bekerja di startup, saya ingin beralih ke perusahaan multinasional. KarirConnect memberikan insight tentang culture dan ekspektasi perusahaan besar. Alhamdulillah berhasil diterima sebagai Marketing Manager di Unilever.',
                'location' => 'Jakarta',
                'experience_years' => 6,
                'salary_before' => 15000000,
                'salary_after' => 25000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Ahmad Fauzi',
                'position' => 'Frontend Developer',
                'company' => 'Bukalapak',
                'story' => 'Sebagai self-taught developer, saya awalnya ragu dengan kemampuan saya. KarirConnect membantu saya membangun confidence dan menemukan perusahaan yang menghargai skill daripada latar belakang pendidikan. Sekarang saya bekerja sebagai Frontend Developer di Bukalapak.',
                'location' => 'Jakarta',
                'experience_years' => 2,
                'salary_before' => 6000000,
                'salary_after' => 13000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'Linda Wijaya',
                'position' => 'Business Analyst',
                'company' => 'Bank Mandiri',
                'story' => 'Transisi dari konsultan ke corporate ternyata tidak mudah. KarirConnect membantu saya memahami industri perbankan dan mempersiapkan diri dengan baik. Sekarang saya bekerja sebagai Business Analyst di Bank Mandiri dengan work-life balance yang lebih baik.',
                'location' => 'Jakarta',
                'experience_years' => 5,
                'salary_before' => 14000000,
                'salary_after' => 19000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => 'Rendi Pratama',
                'position' => 'Mobile Developer',
                'company' => 'OVO',
                'story' => 'Dari web developer menjadi mobile developer bukanlah hal yang mustahil. KarirConnect memberikan informasi tentang skill yang dibutuhkan dan peluang karir di bidang mobile development. Sekarang saya menjadi Mobile Developer di OVO!',
                'location' => 'Jakarta',
                'experience_years' => 3,
                'salary_before' => 8500000,
                'salary_after' => 16500000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'name' => 'Putri Maharani',
                'position' => 'Content Strategist',
                'company' => 'Shopee',
                'story' => 'Passion saya di bidang content creation akhirnya tersalurkan dengan baik setelah bergabung dengan Shopee sebagai Content Strategist. KarirConnect membantu saya menemukan posisi yang sesuai dengan minat dan kemampuan saya. Sangat recommended!',
                'location' => 'Jakarta',
                'experience_years' => 3,
                'salary_before' => 7000000,
                'salary_after' => 14000000,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 10,
            ],
        ];

        foreach ($stories as $story) {
            SuccessStory::create($story);
        }
    }
}
