# Fix Email Template Variable Replacement

## Masalah

Email template yang dikirim tidak melakukan replacement variabel, sehingga variabel seperti `{{ nama }}` tetap muncul sebagai literal text di email yang diterima, bukan diganti dengan nilai sebenarnya.

## Penyebab

1. **EmailManagementController.php line 178** - Menggunakan `Mail::raw()` yang mengirim plain text tanpa proses HTML rendering dan variable replacement
2. Tidak ada mekanisme untuk replace variabel `{{ variable }}` sebelum email dikirim

## Solusi yang Diimplementasikan

### 1. Email Service Helper (`app/Services/EmailService.php`)

Dibuat service helper untuk mempermudah pengiriman email dengan variable replacement otomatis:

```php
use App\Services\EmailService;

// Kirim email dengan template
EmailService::send('employee-registration-success', 'user@example.com', [
    'user_name' => 'John Doe',
    'profile_url' => route('user.profile.edit'),
    'jobs_url' => route('jobs.index'),
]);
```

**Fitur EmailService:**
- ✅ Otomatis replace variabel `{{ variable }}` dan `{{variable}}`
- ✅ Support HTML email template
- ✅ Logging untuk debugging
- ✅ Error handling
- ✅ Method `sendTest()` untuk testing
- ✅ Method `preview()` untuk preview template

### 2. Update EmailManagementController

**Sebelum:**
```php
Mail::raw($campaign->content, function ($message) use ($campaign, $recipient) {
    $message->to($recipient->email)
            ->subject($campaign->subject);
});
```

**Sesudah:**
```php
// Prepare data for variable replacement
$data = [
    'nama' => $recipient->name,
    'email' => $recipient->email,
    'name' => $recipient->name,
    'user_name' => $recipient->name,
    'company_name' => $recipient->company->name ?? 'N/A',
];

// Replace variables in content
$body = $campaign->content;
foreach ($data as $key => $value) {
    $patterns = [
        '/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/',  // {{ variable }}
        '/\{\{' . preg_quote($key, '/') . '\}\}/',         // {{variable}}
    ];
    foreach ($patterns as $pattern) {
        $body = preg_replace($pattern, (string) $value, $body);
    }
}

// Send as HTML email
Mail::html($body, function ($message) use ($campaign, $recipient) {
    $message->to($recipient->email)
            ->subject($campaign->subject);
});
```

### 3. Update EmailTemplateController

Menambahkan logging dan memastikan method `replaceVariables` menangani format variabel dengan baik.

## Cara Menggunakan

### A. Menggunakan EmailService (Recommended)

```php
use App\Services\EmailService;

// 1. Kirim email registrasi user
EmailService::send('employee-registration-success', $user->email, [
    'user_name' => $user->name,
    'profile_url' => route('user.profile.edit'),
    'jobs_url' => route('jobs.index'),
]);

// 2. Kirim email registrasi perusahaan
EmailService::send('employer-registration-success', $company->email, [
    'company_name' => $company->name,
    'verification_url' => route('admin.companies.verify', $company->id),
]);

// 3. Kirim email notifikasi pembayaran
EmailService::send('employer-payment-notification', $company->email, [
    'company_name' => $company->name,
    'transaction_id' => $transaction->id,
    'package_name' => $package->name,
    'points' => $package->points,
    'amount' => number_format($transaction->amount, 0, ',', '.'),
    'payment_date' => $transaction->created_at->format('d M Y H:i'),
    'current_balance' => $company->point_balance,
]);

// 4. Kirim email test
EmailService::sendTest('employee-registration-success', 'test@example.com', [
    'user_name' => 'Test User'
]);
```

### B. Manual Variable Replacement

```php
use App\Models\EmailTemplate;
use App\Services\EmailService;
use Illuminate\Support\Facades\Mail;

// Get template
$template = EmailTemplate::where('slug', 'your-template-slug')->first();

// Prepare data
$data = [
    'nama' => 'John Doe',
    'email' => 'john@example.com',
];

// Replace variables
$body = EmailService::replaceVariables($template->body, $data);
$subject = EmailService::replaceVariables($template->subject, $data);

// Send email
Mail::html($body, function($message) use ($recipient, $subject) {
    $message->to($recipient)
        ->subject($subject);
});
```

## Template Variables yang Tersedia

### Employer Templates

**employer-registration-success:**
- `company_name`
- `verification_url`

**employer-payment-notification:**
- `company_name`
- `transaction_id`
- `package_name`
- `points`
- `amount`
- `payment_date`
- `current_balance`

**employer-application-received:**
- `company_name`
- `job_title`
- `applicant_name`
- `applicant_email`
- `applicant_phone`
- `application_date`
- `application_url`

**employer-chat-received:**
- `company_name`
- `sender_name`
- `message_preview`
- `message_time`
- `chat_url`

**employer-invitation-accepted:**
- `company_name`
- `candidate_name`
- `candidate_email`
- `candidate_phone`
- `job_title`
- `acceptance_date`
- `invitation_url`

### Employee Templates

**employee-registration-success:**
- `user_name`
- `profile_url`
- `jobs_url`

**employee-application-status:**
- `user_name`
- `job_title`
- `company_name`
- `status`
- `application_date`
- `application_url`

**employee-chat-received:**
- `user_name`
- `company_name`
- `message_preview`
- `message_time`
- `chat_url`

## Testing

### 1. Test Variable Replacement

```bash
php artisan tinker
```

```php
use App\Services\EmailService;

// Test variable replacement
$template = \App\Models\EmailTemplate::where('slug', 'employee-registration-success')->first();

$data = [
    'user_name' => 'John Doe',
    'profile_url' => 'https://karirconnect.id/profile',
    'jobs_url' => 'https://karirconnect.id/jobs'
];

$body = EmailService::replaceVariables($template->body, $data);
$subject = EmailService::replaceVariables($template->subject, $data);

echo "Subject: {$subject}\n";
echo "Contains {{user_name}}: " . (strpos($body, '{{user_name}}') !== false ? 'YES (ERROR!)' : 'NO (Good!)') . "\n";
echo "Contains John Doe: " . (strpos($body, 'John Doe') !== false ? 'YES (Good!)' : 'NO (ERROR!)') . "\n";
```

### 2. Test Sending (jika SMTP sudah dikonfigurasi)

```bash
php artisan tinker
```

```php
use App\Services\EmailService;

EmailService::sendTest('employee-registration-success', 'your-email@example.com', [
    'user_name' => 'Test User',
    'profile_url' => 'https://karirconnect.id/profile',
    'jobs_url' => 'https://karirconnect.id/jobs'
]);
```

### 3. Test dari Admin Panel

1. Login sebagai admin
2. Buka `/admin/email-templates`
3. Klik template yang ingin ditest
4. Klik tombol "Send Test"
5. Masukkan email Anda
6. Check inbox untuk verifikasi bahwa variabel sudah diganti dengan benar

## Troubleshooting

### Email tidak terkirim

**Error:** `Connection could not be established with host "ssl://mail.karirconnect.id:465"`

**Solusi:**
1. Pastikan SMTP server `mail.karirconnect.id` bisa diakses
2. Check firewall settings untuk port 465
3. Test koneksi manual:
   ```bash
   telnet mail.karirconnect.id 465
   ```
4. Alternatif: Gunakan `MAIL_MAILER=log` di `.env` untuk testing tanpa SMTP

### Variabel tidak terganti

**Cek:**
1. Pastikan nama variabel di template sesuai dengan data yang dikirim
2. Format variabel harus `{{ variable }}` atau `{{variable}}`
3. Pastikan menggunakan `EmailService::send()` atau `Mail::html()` bukan `Mail::raw()`
4. Check logs di `storage/logs/laravel.log`

### Template tidak ditemukan

```bash
# Seed ulang template
php artisan db:seed --class=EmailTemplateSeeder

# Check di database
php artisan tinker
\App\Models\EmailTemplate::all();
```

## Migration Guide

### Untuk Email yang Sudah Ada

Jika ada code yang sudah mengirim email, update dengan cara:

**Sebelum:**
```php
Mail::send('emails.welcome', $data, function($message) use ($user) {
    $message->to($user->email)->subject('Welcome!');
});
```

**Sesudah:**
```php
use App\Services\EmailService;

EmailService::send('employee-registration-success', $user->email, [
    'user_name' => $user->name,
    'profile_url' => route('user.profile.edit'),
    'jobs_url' => route('jobs.index'),
]);
```

## Files Changed

1. ✅ `app/Services/EmailService.php` - **NEW** Helper service
2. ✅ `app/Http/Controllers/Admin/EmailManagementController.php` - Updated `sendCampaign()` method
3. ✅ `app/Http/Controllers/Admin/EmailTemplateController.php` - Added logging
4. ✅ `database/seeders/EmailTemplateSeeder.php` - Already exists

## Next Steps

1. ✅ **EmailService created** - Helper service untuk variable replacement
2. ✅ **Controllers updated** - EmailManagementController dan EmailTemplateController
3. ✅ **Templates seeded** - Email templates sudah ada di database
4. ✅ **Variable replacement tested** - Berhasil replace `{{ nama }}` menjadi value
5. ⚠️  **SMTP configuration** - Perlu dikonfigurasi untuk email sebenarnya terkirim
6. 📋 **Implementation** - Implement EmailService di:
   - RegisteredUserController (user registration)
   - CompanyRegistrationController (company registration)
   - PaymentController (payment confirmation)
   - JobApplicationController (application notifications)
   - JobInvitationController (invitation notifications)

## Kesimpulan

✅ **Masalah SOLVED!**

Variable replacement sekarang berfungsi dengan baik. Email template akan otomatis replace `{{ variable }}` dengan nilai yang sesuai saat dikirim.

Jika masih melihat `{{ nama }}` di email yang diterima, kemungkinan:
1. Email tersebut dikirim sebelum fix ini diimplementasikan
2. Code yang mengirim email masih menggunakan `Mail::raw()` bukan `Mail::html()`
3. Tidak menggunakan `EmailService` atau method `replaceVariables()`

Pastikan semua controller yang mengirim email sudah menggunakan `EmailService::send()` atau manual replacement dengan `EmailService::replaceVariables()`.
