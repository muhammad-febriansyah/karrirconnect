<?php

namespace Database\Seeders;

use App\Models\News;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'super_admin')->first();
        
        if (!$admin) {
            $this->command->warn('Tidak ada user dengan role super_admin. Membuat user admin...');
            $admin = User::create([
                'name' => 'Super Admin',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]);
        }

        $newsData = [
            [
                'title' => 'Teknologi AI Terbaru untuk Rekrutmen Karyawan',
                'excerpt' => 'Perusahaan teknologi mulai menggunakan kecerdasan buatan untuk mempercepat proses rekrutmen dan menemukan kandidat terbaik.',
                'content' => "Teknologi kecerdasan buatan (AI) kini semakin banyak diadopsi oleh perusahaan-perusahaan untuk membantu proses rekrutmen karyawan. Dengan menggunakan algoritma machine learning, perusahaan dapat melakukan screening CV secara otomatis dan mengidentifikasi kandidat yang paling sesuai dengan kriteria yang diinginkan.\n\nBeberapa keuntungan penggunaan AI dalam rekrutmen antara lain:\n1. Menghemat waktu dalam proses screening\n2. Mengurangi bias dalam seleksi kandidat\n3. Meningkatkan akurasi dalam mencocokkan kandidat dengan posisi\n\nNamun, penggunaan teknologi ini juga perlu diimbangi dengan human touch agar tetap mempertimbangkan aspek soft skill dan cultural fit kandidat.",
                'status' => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Tips Interview Kerja di Era Remote Working',
                'excerpt' => 'Panduan lengkap untuk mempersiapkan diri menghadapi interview kerja secara virtual yang semakin populer di era remote working.',
                'content' => "Interview kerja secara virtual kini menjadi hal yang umum sejak pandemi. Berikut adalah beberapa tips untuk sukses dalam interview online:\n\n1. Persiapan Teknis\n- Pastikan koneksi internet stabil\n- Test kamera dan mikrofon sebelumnya\n- Siapkan backup plan jika ada masalah teknis\n\n2. Pengaturan Ruang\n- Pilih background yang profesional\n- Pastikan pencahayaan yang cukup\n- Minimalisir gangguan dari sekitar\n\n3. Persiapan Mental\n- Latihan berbicara di depan kamera\n- Siapkan jawaban untuk pertanyaan umum\n- Research tentang perusahaan dengan mendalam\n\n4. Etika Virtual\n- Dress code tetap profesional\n- Maintain eye contact dengan kamera\n- Prepare notes sebagai backup\n\nDengan persiapan yang matang, interview virtual dapat menjadi kesempatan yang sama baiknya dengan interview tatap muka.",
                'status' => 'published',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Tren Skill yang Dicari Perusahaan di 2024',
                'excerpt' => 'Analisis mendalam tentang keterampilan dan kompetensi yang paling dicari oleh perusahaan di tahun 2024.',
                'content' => "Dunia kerja terus berubah dan perusahaan mencari kandidat dengan skill yang sesuai dengan kebutuhan masa depan. Berikut adalah tren skill yang paling dicari di 2024:\n\n1. Technical Skills\n- Data Analysis dan Data Science\n- Cloud Computing (AWS, Azure, GCP)\n- Cybersecurity\n- AI/Machine Learning\n- Mobile Development\n\n2. Soft Skills\n- Adaptabilitas dan Fleksibilitas\n- Leadership dan Management\n- Problem Solving\n- Communication Skills\n- Emotional Intelligence\n\n3. Hybrid Skills\n- Digital Marketing dengan Analytics\n- Project Management dengan Agile\n- Sales dengan CRM Technology\n\nUntuk para job seeker, penting untuk terus mengembangkan kombinasi technical dan soft skills agar tetap kompetitif di pasar kerja yang dinamis ini.",
                'status' => 'draft',
                'published_at' => null,
            ],
        ];

        foreach ($newsData as $data) {
            News::create(array_merge($data, ['author_id' => $admin->id]));
        }

        $this->command->info('Sample news data berhasil dibuat!');
    }
}
