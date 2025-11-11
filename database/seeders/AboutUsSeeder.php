<?php

namespace Database\Seeders;

use App\Models\AboutUs;
use Illuminate\Database\Seeder;

class AboutUsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete existing data first
        AboutUs::truncate();

        // Create comprehensive About Us data
        AboutUs::create([
            'title' => 'Tentang KarirConnect',
            'description' => 'KarirConnect adalah platform karir terpercaya yang menghubungkan talenta terbaik dengan perusahaan-perusahaan terkemuka di Indonesia. Dengan teknologi canggih dan layanan profesional, kami memudahkan pencari kerja menemukan peluang karir yang tepat, serta membantu perusahaan merekrut kandidat berkualitas dengan efisien.',

            'vision' => 'Menjadi platform karir nomor satu di Indonesia yang memberdayakan setiap talenta untuk mencapai potensi maksimal mereka, sekaligus menjadi mitra strategis bagi perusahaan dalam membangun tim yang solid dan kompeten.',

            'mission' => 'Menyediakan ekosistem karir yang inklusif, transparan, dan inovatif dengan memanfaatkan teknologi terkini untuk mempertemukan talenta dengan peluang yang sesuai, memberikan panduan karir profesional, dan mendukung pertumbuhan berkelanjutan bagi job seekers maupun employers.',

            'values' => [
                [
                    'title' => 'Integritas',
                    'description' => 'Kami berkomitmen penuh pada transparansi, kejujuran, dan etika profesional dalam setiap aspek layanan kami.',
                    'icon' => 'handshake'
                ],
                [
                    'title' => 'Inovasi',
                    'description' => 'Terus berinovasi dengan menghadirkan fitur-fitur terbaru yang mempermudah proses rekrutmen dan pencarian kerja.',
                    'icon' => 'lightbulb'
                ],
                [
                    'title' => 'Keunggulan',
                    'description' => 'Memberikan pengalaman terbaik dengan standar kualitas tinggi untuk pencari kerja dan perusahaan.',
                    'icon' => 'trophy'
                ],
                [
                    'title' => 'Kepedulian',
                    'description' => 'Memahami kebutuhan setiap individu dan memberikan dukungan personal untuk kesuksesan karir mereka.',
                    'icon' => 'heart'
                ],
                [
                    'title' => 'Kolaborasi',
                    'description' => 'Membangun kemitraan yang kuat dengan perusahaan dan institusi untuk menciptakan ekosistem karir yang lebih baik.',
                    'icon' => 'users'
                ],
                [
                    'title' => 'Pertumbuhan',
                    'description' => 'Mendorong pengembangan berkelanjutan bagi talenta melalui pelatihan, mentoring, dan peluang karir.',
                    'icon' => 'trending-up'
                ],
                [
                    'title' => 'Keamanan',
                    'description' => 'Melindungi data pribadi pengguna dengan sistem keamanan berlapis dan enkripsi tingkat tinggi.',
                    'icon' => 'shield'
                ],
                [
                    'title' => 'Profesionalisme',
                    'description' => 'Menjaga standar profesional tertinggi dalam setiap interaksi dan layanan yang kami berikan.',
                    'icon' => 'briefcase'
                ]
            ],

            'features' => [
                [
                    'title' => 'Smart Job Matching',
                    'description' => 'Algoritma AI yang mencocokkan profil kandidat dengan lowongan pekerjaan yang paling sesuai berdasarkan skills, pengalaman, dan preferensi.',
                    'icon' => 'target'
                ],
                [
                    'title' => 'Perusahaan Terverifikasi',
                    'description' => 'Semua perusahaan partner melalui proses verifikasi ketat untuk memastikan kredibilitas dan legitimasi lowongan kerja.',
                    'icon' => 'shield'
                ],
                [
                    'title' => 'Panduan Karir Expert',
                    'description' => 'Akses ke artikel, tips, dan panduan karir dari praktisi HR dan career counselor berpengalaman.',
                    'icon' => 'graduation-cap'
                ],
                [
                    'title' => 'Pencarian Cepat & Akurat',
                    'description' => 'Filter pencarian canggih berdasarkan lokasi, industri, posisi, gaji, dan berbagai kriteria lainnya.',
                    'icon' => 'search'
                ],
                [
                    'title' => 'Database Talenta Luas',
                    'description' => 'Akses ke database ribuan kandidat berkualitas dari berbagai latar belakang dan keahlian.',
                    'icon' => 'database'
                ],
                [
                    'title' => 'Notifikasi Real-time',
                    'description' => 'Dapatkan pemberitahuan instan untuk lowongan baru, update aplikasi, dan undangan interview.',
                    'icon' => 'zap'
                ],
                [
                    'title' => 'Mobile Friendly',
                    'description' => 'Platform yang dioptimalkan untuk semua perangkat, memudahkan akses kapan saja dan dimana saja.',
                    'icon' => 'smartphone'
                ],
                [
                    'title' => 'Analitik Rekrutmen',
                    'description' => 'Dashboard analitik lengkap untuk perusahaan memantau performa posting lowongan dan kualitas kandidat.',
                    'icon' => 'trending-up'
                ],
                [
                    'title' => 'Support 24/7',
                    'description' => 'Tim customer support yang siap membantu Anda melalui berbagai channel komunikasi setiap saat.',
                    'icon' => 'message-circle'
                ]
            ],

            'stats' => [
                [
                    'number' => '50000+',
                    'label' => 'Pencari Kerja Aktif'
                ],
                [
                    'number' => '2500+',
                    'label' => 'Perusahaan Partner'
                ],
                [
                    'number' => '15000+',
                    'label' => 'Lowongan Tersedia'
                ],
                [
                    'number' => '98%',
                    'label' => 'Tingkat Kepuasan'
                ]
            ],

            'team' => [
                [
                    'name' => 'Budi Santoso',
                    'position' => 'CEO & Co-Founder',
                    'description' => 'Visionary leader dengan pengalaman 20+ tahun di industri HR Technology dan rekrutmen. Alumni Stanford University dengan track record memimpin beberapa startup sukses.',
                    'image' => null
                ],
                [
                    'name' => 'Siti Nurhaliza',
                    'position' => 'Chief Technology Officer',
                    'description' => 'Expert teknologi dengan spesialisasi AI dan Machine Learning. Lulusan MIT yang telah mengembangkan berbagai platform teknologi inovatif.',
                    'image' => null
                ],
                [
                    'name' => 'Ahmad Dhani',
                    'position' => 'Chief Operating Officer',
                    'description' => 'Profesional berpengalaman dalam operasional dan strategi bisnis. Memastikan efisiensi operasional dan pertumbuhan berkelanjutan perusahaan.',
                    'image' => null
                ],
                [
                    'name' => 'Rina Wijaya',
                    'position' => 'Head of Product',
                    'description' => 'Product manager handal dengan fokus pada user experience dan product innovation. Ahli dalam mengidentifikasi kebutuhan pasar dan mengembangkan solusi yang tepat.',
                    'image' => null
                ],
                [
                    'name' => 'Hendra Gunawan',
                    'position' => 'Head of Marketing',
                    'description' => 'Marketing strategist dengan keahlian dalam digital marketing dan brand building. Memimpin tim untuk meningkatkan brand awareness dan user acquisition.',
                    'image' => null
                ],
                [
                    'name' => 'Dewi Lestari',
                    'position' => 'Head of Customer Success',
                    'description' => 'Passionate tentang customer satisfaction dengan pengalaman luas dalam customer relationship management. Memastikan setiap user mendapat pengalaman terbaik.',
                    'image' => null
                ]
            ],

            'contact' => [
                'email' => 'info@karirconnect.com',
                'phone' => '+62 21 5082 9000',
                'address' => 'Menara Mandiri II, Jl. Jenderal Sudirman Kav. 54-55, Jakarta Selatan 12190',
                'social' => [
                    'linkedin' => 'https://linkedin.com/company/karirconnect',
                    'twitter' => 'https://twitter.com/karirconnect',
                    'instagram' => 'https://instagram.com/karirconnect',
                    'facebook' => 'https://facebook.com/karirconnect'
                ]
            ],

            'cta_title' => 'Siap Memulai Karir Impian Anda?',
            'cta_description' => 'Bergabunglah dengan puluhan ribu profesional yang telah mempercayai KarirConnect sebagai partner karir mereka. Daftar sekarang gratis dan temukan peluang terbaik untuk masa depan Anda!',

            'is_active' => true
        ]);

        $this->command->info('✓ About Us data has been seeded successfully!');
    }
}
