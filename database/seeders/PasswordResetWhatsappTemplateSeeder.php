<?php

namespace Database\Seeders;

use App\Models\WhatsappTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PasswordResetWhatsappTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WhatsappTemplate::updateOrCreate(
            ['type' => 'password_reset'],
            [
                'name' => 'Password Reset Notification',
                'message' => "*Reset Kata Sandi - {site_name}*\n\n" .
                           "Halo {user_name},\n\n" .
                           "Kami menerima permintaan untuk mereset kata sandi akun Anda ({user_email}).\n\n" .
                           "Klik tautan berikut untuk mereset kata sandi:\n" .
                           "{reset_url}\n\n" .
                           "Tautan ini akan kedaluarsa dalam 60 menit.\n\n" .
                           "Jika Anda tidak meminta reset kata sandi, abaikan pesan ini dan akun Anda akan tetap aman.\n\n" .
                           "Untuk keamanan akun Anda:\n" .
                           "- Jangan bagikan tautan ini kepada siapapun\n" .
                           "- Gunakan kata sandi yang kuat dan unik\n" .
                           "- Aktifkan autentikasi dua faktor jika tersedia\n\n" .
                           "Butuh bantuan? Hubungi tim support kami.\n\n" .
                           "Salam hangat,\n" .
                           "Tim {site_name}",
                'variables' => json_encode([
                    'user_name' => 'Nama pengguna',
                    'user_email' => 'Email pengguna', 
                    'reset_url' => 'URL reset password',
                    'site_name' => 'Nama website'
                ]),
                'is_active' => true,
                'description' => 'Template notifikasi WhatsApp untuk reset kata sandi pengguna'
            ]
        );
    }
}
