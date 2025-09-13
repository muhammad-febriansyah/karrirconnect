<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WhatsappTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'User Registration',
                'slug' => 'user-registration',
                'title' => 'Selamat Datang, {user_name}!',
                'message' => 'Halo {user_name}! 👋\n\nSelamat datang di KarirConnect! Akun Anda telah berhasil didaftarkan dan siap digunakan.\n\nMulai jelajahi berbagai peluang karir menarik yang tersedia untuk Anda.',
                'type' => 'notification',
                'variables' => ['user_name'],
                'description' => 'Template untuk notifikasi registrasi user baru',
                'use_emoji' => true,
                'include_timestamp' => true,
                'include_signature' => true,
            ],
            [
                'name' => 'Company Registration',
                'slug' => 'company-registration',
                'title' => 'Verifikasi Perusahaan',
                'message' => 'Perusahaan "{company_name}" telah mengajukan pendaftaran dan memerlukan verifikasi.\n\nSilakan login ke dashboard admin untuk melakukan review dan verifikasi.',
                'type' => 'notification',
                'variables' => ['company_name'],
                'description' => 'Template untuk notifikasi registrasi perusahaan baru',
                'use_emoji' => true,
                'include_timestamp' => true,
                'include_signature' => true,
            ],
            [
                'name' => 'Job Application',
                'slug' => 'job-application',
                'title' => 'Lamaran Kerja Baru',
                'message' => 'Ada lamaran baru untuk posisi "{job_title}"!\n\n👤 Pelamar: {user_name}\n📅 Tanggal: {application_date}\n\nSilakan cek dashboard untuk review lebih detail.',
                'type' => 'notification',
                'variables' => ['job_title', 'user_name', 'application_date'],
                'description' => 'Template untuk notifikasi lamaran kerja baru',
                'use_emoji' => true,
                'include_timestamp' => true,
                'include_signature' => true,
            ],
            [
                'name' => 'System Update',
                'slug' => 'system-update',
                'title' => 'Pembaruan Sistem',
                'message' => 'Sistem KarirConnect telah berhasil diperbarui ke versi {version}.\n\n✅ Status: Berhasil\n🔧 Fitur Baru: {description}',
                'type' => 'system',
                'variables' => ['version', 'description'],
                'description' => 'Template untuk notifikasi update sistem',
                'use_emoji' => true,
                'include_timestamp' => true,
                'include_signature' => true,
            ],
            [
                'name' => 'Marketing Broadcast',
                'slug' => 'marketing-broadcast',
                'title' => 'Promo Spesial KarirConnect',
                'message' => 'Dapatkan kesempatan emas untuk berkarir! 🚀\n\nManfaatkan fitur premium kami dengan diskon khusus.\n\n💯 Promo terbatas, jangan sampai terlewat!',
                'type' => 'marketing',
                'variables' => [],
                'description' => 'Template untuk broadcast marketing',
                'use_emoji' => true,
                'include_timestamp' => true,
                'include_signature' => true,
            ],
            [
                'name' => 'Alert Notification',
                'slug' => 'alert-notification',
                'title' => 'Peringatan Sistem',
                'message' => 'Terjadi aktivitas yang memerlukan perhatian segera:\n\n{alert_message}\n\nSilakan segera ambil tindakan yang diperlukan.',
                'type' => 'alert',
                'variables' => ['alert_message'],
                'description' => 'Template untuk notifikasi alert/peringatan',
                'use_emoji' => true,
                'include_timestamp' => true,
                'include_signature' => true,
            ]
        ];

        foreach ($templates as $template) {
            \App\Models\WhatsappTemplate::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }
    }
}
