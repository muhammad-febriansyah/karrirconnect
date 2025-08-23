# reCAPTCHA Setup Guide

Aplikasi ini sudah dikonfigurasi untuk menggunakan Google reCAPTCHA v2 pada form login dan register employee.

## Setup Steps

### 1. Dapatkan reCAPTCHA Keys dari Google

1. Buka [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin)
2. Klik "Create" atau "+ Add New Site"
3. Isi form:
   - **Label**: Nama aplikasi Anda (contoh: KarirConnect)
   - **reCAPTCHA type**: pilih "reCAPTCHA v2" dan "I'm not a robot Checkbox"
   - **Domains**: Tambahkan domain Anda (contoh: localhost, karirconnect.com)
4. Setujui Terms of Service
5. Klik "Submit"
6. Copy **Site Key** dan **Secret Key**

### 2. Konfigurasi Environment Variables

Edit file `.env` dan update bagian reCAPTCHA:

```env
# reCAPTCHA Configuration
NOCAPTCHA_SECRET=your-actual-secret-key-here
NOCAPTCHA_SITEKEY=your-actual-site-key-here

# Frontend Environment Variables (accessible in JavaScript)  
VITE_RECAPTCHA_SITE_KEY=your-actual-site-key-here
```

**Penting**: Ganti `your-actual-secret-key-here` dan `your-actual-site-key-here` dengan keys yang didapat dari Google reCAPTCHA Console.

### 3. Clear Cache (Optional)

Setelah mengubah konfigurasi, jalankan:

```bash
php artisan config:clear
php artisan cache:clear
```

### 4. Testing

1. Akses aplikasi di browser
2. Klik tombol "Masuk" atau "Daftar" di navbar
3. reCAPTCHA seharusnya muncul di form
4. Isi form dan centang "I'm not a robot"
5. Submit form untuk test validasi

## Troubleshooting

### reCAPTCHA Tidak Muncul

1. **Check Environment Variables**: Pastikan `NOCAPTCHA_SITEKEY` sudah diset dengan benar di `.env`
2. **Check Domain Configuration**: Pastikan domain/localhost sudah ditambahkan di Google reCAPTCHA Console
3. **Check Browser Console**: Lihat apakah ada error JavaScript
4. **Check Network Tab**: Pastikan script reCAPTCHA berhasil dimuat dari googleapis.com

### Error "Invalid Site Key"

1. Pastikan Site Key di `.env` sama dengan yang di Google Console
2. Pastikan domain yang digunakan sudah terdaftar di Google Console
3. Untuk development, pastikan `localhost` dan `127.0.0.1` sudah ditambahkan

### Error Validation "Silakan verifikasi bahwa Anda bukan robot"

1. Pastikan `NOCAPTCHA_SECRET` di `.env` sudah benar
2. Pastikan user sudah mencentang reCAPTCHA sebelum submit form
3. Check log Laravel untuk error detail: `php artisan log:tail` atau check `storage/logs/laravel.log`

## Test Keys (Development Only)

Untuk testing di development, Google menyediakan test keys:

```env
# Test keys - jangan gunakan di production!
NOCAPTCHA_SECRET=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
NOCAPTCHA_SITEKEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**Warning**: Test keys ini hanya untuk development. Jangan gunakan di production!

## File yang Termodifikasi

1. `app/Http/Controllers/Auth/RegisteredUserController.php` - Added reCAPTCHA validation
2. `app/Http/Requests/Auth/LoginRequest.php` - Added reCAPTCHA validation  
3. `app/Http/Middleware/HandleInertiaRequests.php` - Share site key ke frontend
4. `resources/js/components/auth/login-modal.tsx` - Added reCAPTCHA component
5. `resources/js/components/auth/register-modal.tsx` - Added reCAPTCHA component
6. `resources/js/components/ui/recaptcha.tsx` - reCAPTCHA React component
7. `resources/js/types/index.d.ts` - Added reCAPTCHA to SharedData type
8. `config/captcha.php` - reCAPTCHA configuration