<?php

namespace Database\Seeders;

use App\Models\AboutUs;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AboutUsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AboutUs::create([
            'title' => 'KarirConnect',
            'description' => 'Platform job fair digital terdepan di Indonesia yang menghubungkan talenta terbaik dengan perusahaan berkualitas untuk menciptakan masa depan karir yang gemilang.',
            'vision' => 'Menjadi platform job fair digital nomor satu di Indonesia yang menjembatani talenta terbaik dengan perusahaan berkualitas, menciptakan ekosistem karir yang berkelanjutan dan berdampak positif bagi kemajuan bangsa.',
            'mission' => 'Menyediakan akses mudah ke peluang karir berkualitas, membantu perusahaan menemukan talenta yang tepat, dan memberikan pengalaman job fair yang inovatif.',
            'values' => [
                [
                    'title' => 'Kepedulian',
                    'description' => 'Kami peduli dengan masa depan karir setiap individu dan kesuksesan setiap perusahaan.',
                    'icon' => 'heart'
                ],
                [
                    'title' => 'Kolaborasi',
                    'description' => 'Membangun jembatan antara talenta terbaik dengan perusahaan yang tepat.',
                    'icon' => 'users'
                ],
                [
                    'title' => 'Fokus Hasil',
                    'description' => 'Berkomitmen memberikan hasil terbaik untuk pencari kerja dan perekrut.',
                    'icon' => 'target'
                ],
                [
                    'title' => 'Inovasi',
                    'description' => 'Menggunakan teknologi terdepan untuk memberikan pengalaman yang luar biasa.',
                    'icon' => 'globe'
                ]
            ],
            'features' => [
                'Pencarian kerja yang mudah dan cepat',
                'Profile perusahaan yang lengkap',
                'Sistem aplikasi yang terintegrasi',
                'Notifikasi lowongan terbaru',
                'Analytics untuk perekrut',
                'Dukungan customer service 24/7'
            ],
            'stats' => [
                [
                    'number' => '1000+',
                    'label' => 'Perusahaan Terdaftar',
                    'icon' => 'building'
                ],
                [
                    'number' => '50K+',
                    'label' => 'Pencari Kerja Aktif',
                    'icon' => 'users'
                ],
                [
                    'number' => '25K+',
                    'label' => 'Lowongan Pekerjaan',
                    'icon' => 'briefcase'
                ],
                [
                    'number' => '15K+',
                    'label' => 'Berhasil Ditempatkan',
                    'icon' => 'award'
                ]
            ],
            'team' => [
                [
                    'name' => 'Ahmad Ramadhani',
                    'position' => 'CEO & Founder',
                    'bio' => 'Berpengalaman 15 tahun dalam industri HR dan teknologi.',
                    'image' => '/images/team/ceo.jpg'
                ],
                [
                    'name' => 'Sari Wijayanti',
                    'position' => 'CTO',
                    'bio' => 'Expert dalam pengembangan platform digital dan AI.',
                    'image' => '/images/team/cto.jpg'
                ],
                [
                    'name' => 'Budi Santoso',
                    'position' => 'Head of Business Development',
                    'bio' => 'Spesialis dalam pengembangan kemitraan strategis.',
                    'image' => '/images/team/bd.jpg'
                ]
            ],
            'contact' => [
                'email' => [
                    'info@karirconnect.id',
                    'support@karirconnect.id'
                ],
                'phone' => [
                    '+62 21 1234 5678',
                    '+62 811 2345 6789'
                ],
                'address' => [
                    'Jl. Sudirman No. 123',
                    'Jakarta Pusat, 10220'
                ]
            ],
            'cta_title' => 'Siap Memulai Perjalanan Karir Anda?',
            'cta_description' => 'Bergabunglah dengan ribuan profesional dan perusahaan yang telah mempercayai KarirConnect',
            'is_active' => true,
        ]);
    }
}
