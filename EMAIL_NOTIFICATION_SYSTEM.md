# Email Notification System - KarirConnect

## Overview
Sistem email notification telah berhasil diimplementasikan dengan fitur lengkap untuk mengelola template email dari admin panel.

## Konfigurasi Email

Email sudah dikonfigurasi di `.env` dengan detail berikut:
```env
MAIL_MAILER=smtp
MAIL_HOST=mail.karirconnect.id
MAIL_PORT=465
MAIL_USERNAME=noreply@karirconnect.id
MAIL_PASSWORD=KarirConnect245245*
MAIL_ENCRYPTION=ssl
```

## Template Email Yang Tersedia

### For Employers (Company Admin)

1. **Employer - Registrasi Berhasil** (`employer-registration-success`)
   - Dikirim saat perusahaan berhasil mendaftar
   - Berisi: Ucapan selamat datang dan informasi untuk verifikasi perusahaan
   - Variables: `company_name`, `verification_url`

2. **Employer - Notifikasi Pembayaran** (`employer-payment-notification`)
   - Dikirim saat pembayaran poin berhasil
   - Berisi: Detail transaksi dan saldo poin
   - Variables: `company_name`, `transaction_id`, `package_name`, `points`, `amount`, `payment_date`, `current_balance`

3. **Employer - Lamaran Masuk** (`employer-application-received`)
   - Dikirim setiap ada lamaran baru masuk
   - Berisi: Detail pelamar dan link untuk melihat lamaran
   - Variables: `company_name`, `job_title`, `applicant_name`, `applicant_email`, `applicant_phone`, `application_date`, `application_url`

4. **Employer - Chat Masuk** (`employer-chat-received`)
   - Dikirim saat ada pesan baru dari kandidat
   - Berisi: Preview pesan dan link ke chat
   - Variables: `company_name`, `sender_name`, `message_preview`, `message_time`, `chat_url`

5. **Employer - Job Invitation Diterima** (`employer-invitation-accepted`)
   - Dikirim saat kandidat menerima undangan interview
   - Berisi: Detail kandidat yang menerima undangan
   - Variables: `company_name`, `candidate_name`, `candidate_email`, `candidate_phone`, `job_title`, `acceptance_date`, `invitation_url`

6. **Employer - Reminder Verifikasi** (`employer-verification-reminder`)
   - Dikirim 3 hari setelah registrasi jika belum verifikasi
   - Berisi: Reminder untuk verifikasi dan manfaatnya
   - Variables: `company_name`, `days_since_registration`, `verification_url`

### For Employees (Job Seekers)

1. **Employee - Registrasi Berhasil** (`employee-registration-success`)
   - Dikirim saat user berhasil mendaftar
   - Berisi: Ucapan selamat datang dan tips memulai
   - Variables: `user_name`, `profile_url`, `jobs_url`

2. **Employee - Status Lamaran** (`employee-application-status`)
   - Dikirim saat status lamaran berubah
   - Berisi: Update status lamaran (sedang direview, dll)
   - Variables: `user_name`, `job_title`, `company_name`, `status`, `application_date`, `application_url`

3. **Employee - Chat Masuk** (`employee-chat-received`)
   - Dikirim saat ada pesan baru dari perusahaan
   - Berisi: Preview pesan dan link ke chat
   - Variables: `user_name`, `company_name`, `message_preview`, `message_time`, `chat_url`

## Struktur File

### Backend
- **Model**: `app/Models/EmailTemplate.php`
- **Migration**: `database/migrations/2025_08_10_113144_create_email_templates_table.php`
- **Seeder**: `database/seeders/EmailTemplateSeeder.php`
- **Controller**: `app/Http/Controllers/Admin/EmailTemplateController.php`
- **Routes**: `routes/admin.php` (prefix: `/admin/email-templates`)

### Frontend
- **Admin Panel View**: `resources/js/pages/admin/email-templates/index.tsx`

## Admin Panel Features

Admin dapat mengakses email templates di: `/admin/email-templates`

### Fitur yang tersedia:
1. **View All Templates** - Lihat semua template dikelompokkan berdasarkan tipe
2. **Create Template** - Buat template baru
3. **Edit Template** - Edit template yang ada
4. **Delete Template** - Hapus template
5. **Toggle Active/Inactive** - Aktifkan/nonaktifkan template
6. **Send Test Email** - Kirim test email untuk testing
7. **Preview** - Preview template dengan sample data

## Cara Menggunakan Template

### 1. Dari Controller

```php
use App\Models\EmailTemplate;
use Illuminate\Support\Facades\Mail;

// Get template
$template = EmailTemplate::where('slug', 'employer-registration-success')->first();

// Prepare data
$data = [
    'company_name' => $company->name,
    'verification_url' => route('company.verification'),
];

// Replace variables
$body = $this->replaceVariables($template->body, $data);
$subject = $this->replaceVariables($template->subject, $data);

// Send email
Mail::html($body, function($message) use ($company, $subject) {
    $message->to($company->email)
        ->subject($subject);
});

// Helper function
private function replaceVariables(string $template, array $data): string
{
    foreach ($data as $key => $value) {
        $template = str_replace('{{' . $key . '}}', $value, $template);
    }
    return $template;
}
```

### 2. Menggunakan Helper Service (Recommended)

Buat file `app/Services/EmailService.php`:

```php
<?php

namespace App\Services;

use App\Models\EmailTemplate;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    public static function send(string $slug, string $to, array $data)
    {
        $template = EmailTemplate::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $body = self::replaceVariables($template->body, $data);
        $subject = self::replaceVariables($template->subject, $data);

        Mail::html($body, function($message) use ($to, $subject) {
            $message->to($to)->subject($subject);
        });
    }

    private static function replaceVariables(string $template, array $data): string
    {
        foreach ($data as $key => $value) {
            $template = str_replace('{{' . $key . '}}', $value, $template);
        }
        return $template;
    }
}
```

Kemudian gunakan di controller:

```php
use App\Services\EmailService;

// Send employer registration email
EmailService::send('employer-registration-success', $company->email, [
    'company_name' => $company->name,
    'verification_url' => route('company.verification'),
]);

// Send application received email
EmailService::send('employer-application-received', $company->email, [
    'company_name' => $company->name,
    'job_title' => $application->jobListing->title,
    'applicant_name' => $application->user->name,
    'applicant_email' => $application->user->email,
    'applicant_phone' => $application->user->profile->phone ?? '-',
    'application_date' => $application->created_at->format('d M Y'),
    'application_url' => route('company.applications.show', $application->id),
]);
```

## Implementasi di Controllers

### 1. Company Registration (CompanyRegistrationController)

```php
// After successful company registration
use App\Services\EmailService;

EmailService::send('employer-registration-success', $company->email, [
    'company_name' => $company->name,
    'verification_url' => route('admin.companies.verify', $company->id),
]);
```

### 2. Payment Success (PaymentController)

```php
// After successful payment
EmailService::send('employer-payment-notification', $company->email, [
    'company_name' => $company->name,
    'transaction_id' => $transaction->id,
    'package_name' => $package->name,
    'points' => $package->points,
    'amount' => number_format($transaction->amount, 0, ',', '.'),
    'payment_date' => $transaction->created_at->format('d M Y H:i'),
    'current_balance' => $company->point_balance,
]);
```

### 3. Application Received (JobApplicationController)

```php
// After job application is submitted
$application->load(['jobListing.company', 'user']);

EmailService::send('employer-application-received', $application->jobListing->company->email, [
    'company_name' => $application->jobListing->company->name,
    'job_title' => $application->jobListing->title,
    'applicant_name' => $application->user->name,
    'applicant_email' => $application->user->email,
    'applicant_phone' => $application->user->profile->phone ?? '-',
    'application_date' => $application->created_at->format('d M Y'),
    'application_url' => route('company.applications.show', $application),
]);

// Also send to employee
EmailService::send('employee-application-status', $application->user->email, [
    'user_name' => $application->user->name,
    'job_title' => $application->jobListing->title,
    'company_name' => $application->jobListing->company->name,
    'status' => 'Sedang Direview',
    'application_date' => $application->created_at->format('d M Y'),
    'application_url' => route('user.applications.show', $application),
]);
```

### 4. Chat Message (ChatController)

```php
// When new chat message is received
EmailService::send('employer-chat-received', $company->email, [
    'company_name' => $company->name,
    'sender_name' => $sender->name,
    'message_preview' => Str::limit($message->content, 100),
    'message_time' => $message->created_at->format('d M Y H:i'),
    'chat_url' => route('company.chats.show', $chat->id),
]);
```

### 5. Job Invitation Accepted (JobInvitationController)

```php
// When candidate accepts invitation
EmailService::send('employer-invitation-accepted', $invitation->company->email, [
    'company_name' => $invitation->company->name,
    'candidate_name' => $invitation->user->name,
    'candidate_email' => $invitation->user->email,
    'candidate_phone' => $invitation->user->profile->phone ?? '-',
    'job_title' => $invitation->jobListing->title,
    'acceptance_date' => now()->format('d M Y'),
    'invitation_url' => route('company.invitations.show', $invitation),
]);
```

### 6. User Registration (RegisteredUserController)

```php
// After successful user registration
EmailService::send('employee-registration-success', $user->email, [
    'user_name' => $user->name,
    'profile_url' => route('user.profile.edit'),
    'jobs_url' => route('jobs.index'),
]);
```

## Scheduled Task untuk Verification Reminder

Tambahkan di `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    // Send verification reminder to companies that haven't verified after 3 days
    $schedule->call(function () {
        $companies = \App\Models\Company::where('verification_status', 'pending')
            ->whereDate('created_at', '=', now()->subDays(3)->toDateString())
            ->get();

        foreach ($companies as $company) {
            \App\Services\EmailService::send('employer-verification-reminder', $company->email, [
                'company_name' => $company->name,
                'days_since_registration' => 3,
                'verification_url' => route('admin.companies.verify', $company->id),
            ]);
        }
    })->daily();
}
```

## Testing

### Test Email Configuration
```bash
php artisan tinker

# Test send email
Mail::raw('Test email', function($message) {
    $message->to('your-email@example.com')
        ->subject('Test Email from KarirConnect');
});
```

### Test Template Email from Admin Panel
1. Login sebagai admin
2. Buka `/admin/email-templates`
3. Klik tombol "Send" pada template yang ingin ditest
4. Masukkan email tujuan
5. Klik "Send Test"

## Next Steps

1. **Create EmailService.php** - Buat helper service untuk mengirim email
2. **Implement di Controllers** - Tambahkan EmailService ke semua controller yang relevan
3. **Setup Cron Job** - Setup cron job untuk verification reminder
4. **Test** - Test semua email notifications
5. **Monitor** - Monitor email delivery dan error logs

## Troubleshooting

### Email tidak terkirim
1. Check konfigurasi `.env`
2. Check firewall untuk port 465
3. Check email logs: `storage/logs/laravel.log`
4. Test koneksi SMTP secara manual

### Template tidak muncul
1. Pastikan seeder sudah dijalankan: `php artisan db:seed --class=EmailTemplateSeeder`
2. Check database table `email_templates`

### Variables tidak terganti
1. Pastikan nama variable sesuai dengan yang di template
2. Check format variable menggunakan `{{variable_name}}`
