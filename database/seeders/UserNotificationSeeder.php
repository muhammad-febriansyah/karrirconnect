<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserNotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a sample user (role = 'user')
        $user = User::where('role', 'user')->first();
        
        if (!$user) {
            $this->command->warn('No user found with role "user". Please create a user first.');
            return;
        }

        $notifications = [
            [
                'title' => 'Selamat Datang di KarirConnect!',
                'message' => 'Terima kasih telah bergabung dengan KarirConnect. Lengkapi profil Anda untuk mendapatkan rekomendasi pekerjaan yang lebih baik.',
                'type' => 'success',
                'target_roles' => ['user'],
                'action_url' => '/user/profile',
                'priority' => 'medium',
                'is_global' => false,
                'is_active' => true,
                'data' => [
                    'action_text' => 'Lengkapi Profil'
                ]
            ],
            [
                'title' => 'Status Lamaran Kerja',
                'message' => 'Lamaran Anda untuk posisi Software Developer di PT. Tech Innovation telah diterima dan sedang dalam tahap review.',
                'type' => 'job_application',
                'target_roles' => ['user'],
                'action_url' => '/user/applications',
                'priority' => 'high',
                'is_global' => false,
                'is_active' => true,
                'data' => [
                    'job_title' => 'Software Developer',
                    'company_name' => 'PT. Tech Innovation',
                    'status' => 'under_review'
                ]
            ],
            [
                'title' => 'Profile Tidak Lengkap',
                'message' => 'Profil Anda belum lengkap. Lengkapi data pendidikan dan pengalaman kerja untuk meningkatkan peluang diterima bekerja.',
                'type' => 'warning',
                'target_roles' => ['user'],
                'action_url' => '/user/profile',
                'priority' => 'medium',
                'read_at' => now()->subHours(2),
                'is_global' => false,
                'is_active' => true,
                'data' => [
                    'missing_fields' => ['education', 'experience'],
                    'completion_percentage' => 65
                ]
            ],
            [
                'title' => 'Pelatihan Gratis: Web Development',
                'message' => 'Ikuti pelatihan gratis Web Development yang akan dimulai minggu depan. Daftar sekarang dan tingkatkan skill Anda!',
                'type' => 'info',
                'target_roles' => ['user'],
                'action_url' => '/training/web-development',
                'priority' => 'low',
                'is_global' => true,
                'is_active' => true,
                'data' => [
                    'training_title' => 'Web Development Bootcamp',
                    'start_date' => now()->addDays(7)->format('Y-m-d')
                ]
            ],
            [
                'title' => 'Lowongan Kerja Baru Tersedia',
                'message' => 'Ada 5 lowongan kerja baru yang sesuai dengan profil Anda di bidang IT. Lihat dan lamar sekarang!',
                'type' => 'job_application',
                'target_roles' => ['user'],
                'action_url' => '/jobs?category=it',
                'priority' => 'medium',
                'read_at' => now()->subDays(1),
                'is_global' => false,
                'is_active' => true,
                'data' => [
                    'job_count' => 5,
                    'category' => 'Information Technology'
                ]
            ]
        ];

        // Create global notifications for all users
        $globalNotifications = [
            [
                'title' => 'Maintenance Sistem Terjadwal',
                'message' => 'Sistem akan menjalani maintenance pada hari Minggu, 10 September 2025 pukul 02.00-04.00 WIB. Mohon maaf atas ketidaknyamanannya.',
                'type' => 'system',
                'target_roles' => ['user', 'company_admin', 'admin'],
                'action_url' => '/maintenance-info',
                'priority' => 'urgent',
                'is_global' => true,
                'is_active' => true,
                'data' => [
                    'maintenance_date' => '2025-09-10 02:00:00',
                    'duration' => '2 hours'
                ]
            ]
        ];

        // Insert user-specific notifications
        foreach ($notifications as $notification) {
            Notification::create(array_merge($notification, [
                'created_at' => now()->subDays(rand(0, 7))->subHours(rand(0, 23)),
                'updated_at' => now()
            ]));
        }

        // Insert global notifications
        foreach ($globalNotifications as $notification) {
            Notification::create(array_merge($notification, [
                'created_at' => now()->subDays(rand(0, 3))->subHours(rand(0, 23)),
                'updated_at' => now()
            ]));
        }

        $this->command->info('User notifications seeded successfully!');
    }
}