<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            // EMPLOYER TEMPLATES
            [
                'name' => 'Employer - Registrasi Berhasil',
                'slug' => 'employer-registration-success',
                'subject' => 'Selamat Datang di KarirConnect - Verifikasi Perusahaan Anda',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; padding: 12px 30px; background: #2E4DF7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
        .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Selamat Datang di KarirConnect!</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{company_name}}</strong>,</p>

            <p>Terima kasih telah mendaftar di KarirConnect sebagai employer. Akun Anda telah berhasil dibuat!</p>

            <div class="highlight">
                <strong>Langkah Selanjutnya:</strong><br>
                Untuk mulai melakukan job pairing dan posting lowongan pekerjaan, silakan lakukan <strong>verifikasi perusahaan</strong> Anda terlebih dahulu.
            </div>

            <p>Dengan verifikasi perusahaan, Anda akan mendapatkan:</p>
            <ul>
                <li>✓ Badge perusahaan terverifikasi</li>
                <li>✓ Akses penuh untuk posting lowongan kerja</li>
                <li>✓ Fitur job invitation ke kandidat</li>
                <li>✓ Akses talent database</li>
                <li>✓ Prioritas dalam pencarian perusahaan</li>
            </ul>

            <center>
                <a href="{{verification_url}}" class="button">Verifikasi Perusahaan Sekarang</a>
            </center>

            <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim support kami.</p>

            <p>Salam hangat,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['company_name', 'verification_url'],
                'is_active' => true,
                'type' => 'transactional',
            ],

            [
                'name' => 'Employer - Notifikasi Pembayaran',
                'slug' => 'employer-payment-notification',
                'subject' => 'Pembayaran Berhasil - Poin Anda Telah Ditambahkan',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .success-box { background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center; }
        .transaction-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .transaction-details table { width: 100%; }
        .transaction-details td { padding: 8px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ Pembayaran Berhasil</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{company_name}}</strong>,</p>

            <div class="success-box">
                <h2 style="color: #28a745; margin: 0;">Pembayaran Anda Telah Berhasil!</h2>
                <p style="margin: 10px 0 0 0;">Poin telah ditambahkan ke akun Anda</p>
            </div>

            <div class="transaction-details">
                <h3>Detail Transaksi</h3>
                <table>
                    <tr>
                        <td><strong>ID Transaksi:</strong></td>
                        <td>{{transaction_id}}</td>
                    </tr>
                    <tr>
                        <td><strong>Paket:</strong></td>
                        <td>{{package_name}}</td>
                    </tr>
                    <tr>
                        <td><strong>Poin Diterima:</strong></td>
                        <td>{{points}} poin</td>
                    </tr>
                    <tr>
                        <td><strong>Total Pembayaran:</strong></td>
                        <td>Rp {{amount}}</td>
                    </tr>
                    <tr>
                        <td><strong>Tanggal:</strong></td>
                        <td>{{payment_date}}</td>
                    </tr>
                    <tr>
                        <td><strong>Saldo Poin Saat Ini:</strong></td>
                        <td><strong>{{current_balance}} poin</strong></td>
                    </tr>
                </table>
            </div>

            <p>Poin Anda sudah dapat digunakan untuk:</p>
            <ul>
                <li>Posting lowongan pekerjaan</li>
                <li>Mengirim job invitation ke kandidat</li>
                <li>Mengakses fitur premium lainnya</li>
            </ul>

            <p>Terima kasih atas kepercayaan Anda menggunakan KarirConnect!</p>

            <p>Salam hangat,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['company_name', 'transaction_id', 'package_name', 'points', 'amount', 'payment_date', 'current_balance'],
                'is_active' => true,
                'type' => 'transactional',
            ],

            [
                'name' => 'Employer - Lamaran Masuk',
                'slug' => 'employer-application-received',
                'subject' => 'Lamaran Baru untuk Posisi {{job_title}}',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .applicant-card { background: #f8f9fa; border-left: 4px solid #2E4DF7; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #2E4DF7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📨 Lamaran Baru Masuk</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{company_name}}</strong>,</p>

            <p>Anda mendapat lamaran baru untuk posisi <strong>{{job_title}}</strong>!</p>

            <div class="applicant-card">
                <h3 style="margin-top: 0;">Detail Pelamar</h3>
                <p><strong>Nama:</strong> {{applicant_name}}</p>
                <p><strong>Email:</strong> {{applicant_email}}</p>
                <p><strong>Telepon:</strong> {{applicant_phone}}</p>
                <p><strong>Tanggal Melamar:</strong> {{application_date}}</p>
            </div>

            <p>Segera review lamaran ini dan hubungi kandidat yang sesuai dengan kebutuhan Anda.</p>

            <center>
                <a href="{{application_url}}" class="button">Lihat Detail Lamaran</a>
            </center>

            <p>Salam,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['company_name', 'job_title', 'applicant_name', 'applicant_email', 'applicant_phone', 'application_date', 'application_url'],
                'is_active' => true,
                'type' => 'transactional',
            ],

            [
                'name' => 'Employer - Chat Masuk',
                'slug' => 'employer-chat-received',
                'subject' => 'Pesan Baru dari {{sender_name}}',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .message-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #2E4DF7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 Pesan Baru</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{company_name}}</strong>,</p>

            <p>Anda mendapat pesan baru dari <strong>{{sender_name}}</strong>:</p>

            <div class="message-box">
                <p style="margin: 0;"><strong>{{sender_name}}</strong> - {{message_time}}</p>
                <p style="margin: 10px 0 0 0;">{{message_preview}}</p>
            </div>

            <p>Balas pesan ini untuk membangun komunikasi yang baik dengan kandidat.</p>

            <center>
                <a href="{{chat_url}}" class="button">Buka Chat</a>
            </center>

            <p>Salam,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['company_name', 'sender_name', 'message_preview', 'message_time', 'chat_url'],
                'is_active' => true,
                'type' => 'transactional',
            ],

            [
                'name' => 'Employer - Job Invitation Diterima',
                'slug' => 'employer-invitation-accepted',
                'subject' => '{{candidate_name}} Menerima Undangan Interview Anda',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .success-box { background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #2E4DF7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Undangan Diterima!</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{company_name}}</strong>,</p>

            <div class="success-box">
                <h3 style="color: #28a745; margin-top: 0;">Kabar Baik!</h3>
                <p><strong>{{candidate_name}}</strong> telah menerima undangan interview Anda untuk posisi <strong>{{job_title}}</strong>!</p>
            </div>

            <p><strong>Detail Kandidat:</strong></p>
            <ul>
                <li>Nama: {{candidate_name}}</li>
                <li>Email: {{candidate_email}}</li>
                <li>Telepon: {{candidate_phone}}</li>
                <li>Tanggal Menerima: {{acceptance_date}}</li>
            </ul>

            <p>Segera hubungi kandidat untuk mengatur jadwal interview lebih lanjut.</p>

            <center>
                <a href="{{invitation_url}}" class="button">Lihat Detail Undangan</a>
            </center>

            <p>Salam,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['company_name', 'candidate_name', 'candidate_email', 'candidate_phone', 'job_title', 'acceptance_date', 'invitation_url'],
                'is_active' => true,
                'type' => 'transactional',
            ],

            [
                'name' => 'Employer - Reminder Verifikasi',
                'slug' => 'employer-verification-reminder',
                'subject' => 'Reminder: Segera Verifikasi Perusahaan Anda',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #2E4DF7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Reminder Verifikasi</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{company_name}}</strong>,</p>

            <div class="warning-box">
                <h3 style="margin-top: 0;">Verifikasi Perusahaan Anda Belum Selesai</h3>
                <p>Sudah {{days_since_registration}} hari sejak Anda mendaftar, namun verifikasi perusahaan belum diselesaikan.</p>
            </div>

            <p>Dengan melakukan verifikasi perusahaan, Anda dapat:</p>
            <ul>
                <li>✓ Posting lowongan pekerjaan tanpa batas</li>
                <li>✓ Mendapat badge perusahaan terverifikasi</li>
                <li>✓ Akses fitur job invitation</li>
                <li>✓ Meningkatkan kredibilitas perusahaan</li>
                <li>✓ Prioritas dalam hasil pencarian</li>
            </ul>

            <p><strong>Proses verifikasi sangat mudah dan cepat!</strong> Tim kami akan membantu Anda di setiap langkah.</p>

            <center>
                <a href="{{verification_url}}" class="button">Verifikasi Sekarang</a>
            </center>

            <p>Jika Anda memiliki pertanyaan tentang proses verifikasi, silakan hubungi tim support kami.</p>

            <p>Salam hangat,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['company_name', 'days_since_registration', 'verification_url'],
                'is_active' => true,
                'type' => 'marketing',
            ],

            // EMPLOYEE TEMPLATES
            [
                'name' => 'Employee - Registrasi Berhasil',
                'slug' => 'employee-registration-success',
                'subject' => 'Selamat Datang di KarirConnect - Mulai Cari Pekerjaan Impian Anda!',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .welcome-box { background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; padding: 12px 30px; background: #2E4DF7; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
        .tips-box { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Selamat Datang di KarirConnect!</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{user_name}}</strong>,</p>

            <div class="welcome-box">
                <h2 style="color: #2E4DF7; margin: 0;">Pendaftaran Anda Berhasil!</h2>
                <p>Selamat! Akun Anda telah aktif dan siap digunakan.</p>
            </div>

            <p>Dengan KarirConnect, Anda dapat:</p>
            <ul>
                <li>✓ Mencari ribuan lowongan pekerjaan dari perusahaan terverifikasi</li>
                <li>✓ Melamar pekerjaan dengan mudah dan cepat</li>
                <li>✓ Menerima undangan interview langsung dari perusahaan</li>
                <li>✓ Melacak status lamaran Anda secara real-time</li>
                <li>✓ Berkomunikasi langsung dengan recruiter</li>
            </ul>

            <div class="tips-box">
                <h3>💡 Tips Memulai:</h3>
                <ol>
                    <li>Lengkapi profil Anda untuk meningkatkan peluang ditemukan perusahaan</li>
                    <li>Upload CV terbaru Anda</li>
                    <li>Aktifkan notifikasi untuk mendapat update lowongan terbaru</li>
                    <li>Mulai explore lowongan yang sesuai dengan minat Anda</li>
                </ol>
            </div>

            <center>
                <a href="{{profile_url}}" class="button">Lengkapi Profil</a>
                <a href="{{jobs_url}}" class="button">Lihat Lowongan</a>
            </center>

            <p>Selamat berburu pekerjaan impian Anda!</p>

            <p>Salam hangat,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['user_name', 'profile_url', 'jobs_url'],
                'is_active' => true,
                'type' => 'transactional',
            ],

            [
                'name' => 'Employee - Status Lamaran',
                'slug' => 'employee-application-status',
                'subject' => 'Update Lamaran: {{job_title}} di {{company_name}}',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .status-box { background: #fff9e6; border: 2px solid #ffeb3b; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
        .application-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #2E4DF7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Update Status Lamaran</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{user_name}}</strong>,</p>

            <div class="status-box">
                <h2 style="color: #f57c00; margin: 0;">🎊 Selamat!</h2>
                <h3 style="margin: 10px 0;">Lamaran Anda Sedang Direview</h3>
            </div>

            <div class="application-details">
                <h3>Detail Lamaran</h3>
                <p><strong>Posisi:</strong> {{job_title}}</p>
                <p><strong>Perusahaan:</strong> {{company_name}}</p>
                <p><strong>Status:</strong> <span style="color: #ff9800; font-weight: bold;">{{status}}</span></p>
                <p><strong>Tanggal Melamar:</strong> {{application_date}}</p>
            </div>

            <p>Tim HR sedang meninjau lamaran Anda. Pastikan Anda tetap memeriksa email dan notifikasi untuk update selanjutnya.</p>

            <p><strong>Apa yang harus dilakukan selanjutnya?</strong></p>
            <ul>
                <li>Pastikan profil Anda sudah lengkap dan up-to-date</li>
                <li>Siapkan diri untuk kemungkinan interview</li>
                <li>Pantau terus status lamaran Anda di dashboard</li>
            </ul>

            <center>
                <a href="{{application_url}}" class="button">Lihat Detail Lamaran</a>
            </center>

            <p>Semoga sukses!</p>

            <p>Salam,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['user_name', 'job_title', 'company_name', 'status', 'application_date', 'application_url'],
                'is_active' => true,
                'type' => 'transactional',
            ],

            [
                'name' => 'Employee - Chat Masuk',
                'slug' => 'employee-chat-received',
                'subject' => 'Pesan Baru dari {{company_name}}',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .message-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #2E4DF7; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 Pesan Baru</h1>
        </div>
        <div class="content">
            <p>Halo <strong>{{user_name}}</strong>,</p>

            <p>Anda mendapat pesan baru dari <strong>{{company_name}}</strong>:</p>

            <div class="message-box">
                <p style="margin: 0;"><strong>{{company_name}}</strong> - {{message_time}}</p>
                <p style="margin: 10px 0 0 0;">{{message_preview}}</p>
            </div>

            <p>Ini bisa jadi kabar baik tentang lamaran Anda! Segera balas pesan ini.</p>

            <center>
                <a href="{{chat_url}}" class="button">Buka Chat</a>
            </center>

            <p>Semoga sukses!</p>

            <p>Salam,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['user_name', 'company_name', 'message_preview', 'message_time', 'chat_url'],
                'is_active' => true,
                'type' => 'transactional',
            ],

            [
                'name' => 'Employee - Undangan Interview',
                'slug' => 'employee-interview-invitation',
                'subject' => 'Undangan Interview dari {{company_name}}',
                'body' => '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E4DF7 0%, #203BE5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .highlight-box { background: #e8f4fd; border-left: 4px solid #2E4DF7; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .job-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .job-details h3 { margin-top: 0; color: #2E4DF7; }
        .info-box { background: #fff9e6; border: 1px solid #ffd54f; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 15px 40px; background: #2E4DF7; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .button:hover { background: #203BE5; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Undangan Interview</h1>
        </div>
        <div class="content">
            <p>Halo, <strong>{{user_name}}</strong></p>

            <div class="highlight-box">
                <h2 style="margin-top: 0; color: #2E4DF7;">UNDANGAN INTERVIEW</h2>
            </div>

            <div class="job-details">
                <h3>{{job_title}}</h3>
                <p><strong>Perusahaan:</strong> {{company_name}}</p>
                <p><strong>Lokasi:</strong> {{job_location}}</p>
                <p><strong>Tanggal Melamar:</strong> {{application_date}}</p>
            </div>

            <div class="info-box">
                <p style="margin: 0;"><strong>Anda dipanggil untuk interview:</strong></p>
                <p style="margin: 5px 0 0 0;">Selamat! Anda telah terpilih untuk posisi <strong>{{job_title}}</strong> di kami. Kami ke tahap interview.</p>
                <p style="margin: 10px 0 0 0;">Tim HRD kami akan menghubungi Anda segera untuk mengatur jadwal interview. Pastikan Anda memberikan email dan nomor telepon yang aktif sehingga kami dapat berkomunikasi dengan baik.</p>
                <p style="margin: 10px 0 0 0;"><strong>Tips:</strong> Siapkan diri Anda dengan baik, pelajari tentang perusahaan, dan berlatih menjawab pertanyaan interview umum.</p>
            </div>

            <center>
                <a href="{{invitation_url}}" class="button">Lihat Detail</a>
            </center>

            <p>Jika Anda memiliki pertanyaan, silakan hubungi kami melalui platform KarirConnect atau balas email ini.</p>

            <p>Salam,<br><strong>Tim KarirConnect</strong></p>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis dari platform KarirConnect.</p>
            <p>Jangan balas email ini, untuk pertanyaan, silakan hubungi kami melalui halaman <a href="{{contact_url}}" style="color: #2E4DF7;">bantuan</a>.</p>
            <p>&copy; 2025 KarirConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
                'variables' => ['user_name', 'job_title', 'company_name', 'job_location', 'application_date', 'invitation_url', 'contact_url'],
                'is_active' => true,
                'type' => 'transactional',
            ],
        ];

        foreach ($templates as $template) {
            EmailTemplate::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }

        $this->command->info('Email templates created successfully!');
    }
}
