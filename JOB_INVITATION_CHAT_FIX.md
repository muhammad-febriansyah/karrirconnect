# Job Invitation Chat - Perbaikan Halaman Kosong

## Masalah
- Button chat di job invitation (dari sisi pencari kerja dan company) mengarah ke halaman kosong
- Ketika diklik, halaman chat tidak menampilkan konten apapun

## Perbaikan yang Dilakukan

### 1. **Controller Enhancement**
File: `app/Http/Controllers/JobInvitationMessageController.php`

**Perubahan:**
- ✅ Menambahkan error handling dengan try-catch
- ✅ Memperbaiki authorization check yang lebih robust
- ✅ Mengubah format data yang dikirim ke frontend (explicit array structure)
- ✅ Mengubah order messages dari desc ke asc untuk chronological order
- ✅ Menambahkan logging untuk debugging

**Sebelum:**
```php
return Inertia::render('JobInvitationMessages/Index', [
    'jobInvitation' => $jobInvitation->load(['company', 'jobListing', 'candidate', 'sender']),
    'messages' => $messages,
]);
```

**Sesudah:**
```php
return Inertia::render('JobInvitationMessages/Index', [
    'jobInvitation' => [
        'id' => $jobInvitation->id,
        'status' => $jobInvitation->status,
        'message' => $jobInvitation->message,
        'created_at' => $jobInvitation->created_at,
        'company' => [...],
        'job_listing' => [...],
        'candidate' => [...],
        'sender' => [...],
    ],
    'messages' => $messages,
]);
```

### 2. **Routes Verification**
Routes sudah benar di kedua sisi:

**User Side** (`routes/user.php`):
```php
Route::get('/job-invitations/{jobInvitation}/messages', [JobInvitationMessageController::class, 'index'])
    ->name('job-invitations.messages.index');
```

**Company Side** (`routes/company.php`):
```php
Route::get('/{jobInvitation}/messages', [JobInvitationMessageController::class, 'index'])
    ->name('messages.index');
```

### 3. **Frontend Components**
Frontend components sudah benar dan tidak perlu diubah:
- ✅ User side: `resources/js/pages/user/job-invitations/index.tsx`
- ✅ Company side: `resources/js/pages/company/job-invitations/index.tsx`
- ✅ Chat page: `resources/js/pages/JobInvitationMessages/Index.tsx`

### 4. **Database Cleanup Command**
Membuat command untuk membersihkan dummy data:

```bash
php artisan db:clean-dummy
```

File: `app/Console/Commands/CleanDummyData.php`

Command ini akan menghapus:
- Users (kecuali admin@karirconnect.com)
- Companies
- Job listings
- Job applications
- Job invitations
- News/blog
- Success stories
- Notifications
- Dll

Tapi mempertahankan:
- Settings
- Job Categories
- Skills
- Point Packages
- WhatsApp Templates

### 5. **Test Data Seeder**
Membuat seeder untuk test data:

```bash
php artisan db:seed --class=TestJobInvitationSeeder
```

File: `database/seeders/TestJobInvitationSeeder.php`

**Credentials untuk testing:**
- Company Admin: `company@test.com` / `password`
- Candidate: `candidate@test.com` / `password`

Seeder ini membuat:
- 1 company admin user
- 1 company (verified)
- 1 job listing (Senior Software Engineer)
- 1 candidate user dengan profile
- 1 job invitation dengan status "accepted" (agar button chat aktif)
- 1 job category (IT & Software)

## Cara Testing

### Step 1: Prepare Test Data
```bash
# Bersihkan data lama (opsional)
php artisan db:clean-dummy

# Seed test data
php artisan db:seed --class=TestJobInvitationSeeder

# Build frontend
npm run build
```

### Step 2: Test dari Sisi Candidate (User)
1. Login sebagai candidate: `candidate@test.com` / `password`
2. Navigasi ke menu "Job Invitations" di navbar
3. Lihat job invitation yang ada
4. Klik button "Chat dengan Perusahaan" (warna biru)
5. Halaman chat seharusnya muncul dengan:
   - Header menampilkan info job & company
   - Area chat kosong (belum ada pesan)
   - Form input untuk mengirim pesan
   - Indikator "Anda chatting sebagai Kandidat" (warna biru)

### Step 3: Test dari Sisi Company
1. Logout dan login sebagai company admin: `company@test.com` / `password`
2. Navigasi ke menu "Job Invitations" di sidebar
3. Lihat job invitation yang ada
4. Klik button "Chat dengan Kandidat" (warna hijau)
5. Halaman chat seharusnya muncul dengan:
   - Header menampilkan info job & candidate
   - Area chat kosong (belum ada pesan)
   - Form input untuk mengirim pesan
   - Indikator "Anda chatting sebagai Perusahaan" (warna hijau)

### Step 4: Test Chat Functionality
1. Kirim pesan dari salah satu sisi
2. Pesan seharusnya muncul dengan:
   - Background biru (jika dari user) atau hijau (jika dari company) untuk pesan sendiri
   - Background putih/abu untuk pesan lawan bicara
   - Nama pengirim
   - Badge role (Kandidat/Perusahaan)
   - Timestamp
3. Login dari sisi lain dan cek apakah pesan diterima
4. Balas pesan
5. Coba attach file (opsional)

## Perbaikan Production Error - Null Reference

### ⚠️ Critical Fix: "Cannot read properties of null (reading 'title')"

**Masalah di Production:**
```
Uncaught TypeError: Cannot read properties of null (reading 'title')
```

**Root Cause:**
Code mengakses properties tanpa null check, misalnya:
```typescript
// ❌ SALAH - akan crash jika job_listing null
{jobInvitation.job_listing.title}
{jobInvitation.company.name}
{auth.user.role}
```

**Solusi yang Diterapkan:**
Menambahkan optional chaining (`?.`) dan fallback values di semua property access:

```typescript
// ✅ BENAR - safe dari null/undefined
{jobInvitation?.job_listing?.title || 'Chat'}
{jobInvitation?.company?.name || 'Company'}
{auth?.user?.role === 'company_admin'}
```

**Properties yang Diperbaiki:**
1. ✅ `jobInvitation.job_listing.title` → `jobInvitation?.job_listing?.title || 'Chat'`
2. ✅ `jobInvitation.company.name` → `jobInvitation?.company?.name || 'Company'`
3. ✅ `jobInvitation.company.logo` → `jobInvitation?.company?.logo`
4. ✅ `auth.user.role` → `auth?.user?.role` (di 10+ tempat)
5. ✅ `auth.user.id` → `auth?.user?.id`
6. ✅ `message.sender.name` → `message?.sender?.name || 'Unknown'`

**Total 15+ null checks ditambahkan** untuk mencegah production crash.

## Perbaikan CSRF Token Mismatch

### Masalah CSRF Token
Jika muncul error "CSRF token mismatch" saat mengirim pesan, sudah diperbaiki dengan:

1. **Created Axios Config File** (`resources/js/lib/axios.ts`):
   - Auto-include CSRF token dari meta tag
   - Set X-Requested-With header
   - Configured globally untuk semua request

2. **Updated Chat Component**:
   - Changed dari `fetch()` ke `axios` (yang lebih reliable)
   - Better error handling untuk status 419 (CSRF error)
   - User-friendly error messages dalam Bahasa Indonesia

3. **Error Handling**:
   ```typescript
   if (error.response?.status === 419) {
       toast.error('Session Anda telah berakhir. Silakan refresh halaman dan login kembali.');
   }
   ```

### Solusi Jika Masih Muncul CSRF Error:

1. **Refresh Page** - Session mungkin expired, refresh halaman
2. **Clear Cache**:
   ```bash
   php artisan cache:clear
   php artisan config:clear
   ```
3. **Rebuild Frontend**:
   ```bash
   npm run build
   ```
4. **Login Ulang** - Session mungkin sudah expired

## Troubleshooting

### Jika Halaman Masih Blank:

1. **Check Browser Console**
   ```
   Buka Developer Tools > Console
   Lihat apakah ada error JavaScript
   ```

2. **Check Network Tab**
   ```
   Developer Tools > Network
   Klik button chat
   Lihat response dari request ke /job-invitations/{id}/messages
   Pastikan status 200 OK dan data jobInvitation & messages ada
   ```

3. **Check Laravel Log**
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. **Clear Cache**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan view:clear
   ```

5. **Rebuild Frontend**
   ```bash
   npm run build
   ```

### Jika Button Chat Disabled:

Button chat hanya aktif jika status invitation adalah "accepted". Pastikan:
```php
// Dalam seeder atau manual di database
$invitation->status = 'accepted';
$invitation->responded_at = now();
$invitation->save();
```

## File yang Diubah

1. `app/Http/Controllers/JobInvitationMessageController.php` - Controller enhancement
2. `app/Console/Commands/CleanDummyData.php` - New cleanup command
3. `database/seeders/TestJobInvitationSeeder.php` - New test data seeder
4. `resources/js/pages/JobInvitationMessages/Index.tsx` - **MAJOR FIX**:
   - Fixed CSRF token handling dengan axios
   - **Fixed null reference errors** (production crash fix)
   - Added optional chaining untuk semua property access
5. `resources/js/lib/axios.ts` - **NEW** Axios configuration dengan CSRF token auto-include

## File yang Tidak Diubah (Sudah Benar)

1. `routes/user.php` - Routes sudah benar
2. `routes/company.php` - Routes sudah benar
3. `resources/js/pages/JobInvitationMessages/Index.tsx` - Frontend sudah benar
4. `resources/js/pages/user/job-invitations/index.tsx` - Button & routing sudah benar
5. `resources/js/pages/company/job-invitations/index.tsx` - Button & routing sudah benar
6. `app/Models/JobInvitation.php` - Relations sudah benar
7. `app/Models/JobInvitationMessage.php` - Model sudah benar

## Kesimpulan

Masalah yang diperbaiki:

### 1. **Halaman Kosong**
- **Penyebab:** Data tidak ter-serialize dengan benar
- **Fix:** Explicit array structure di controller

### 2. **CSRF Token Mismatch**
- **Penyebab:** Manual fetch() tidak auto-include CSRF token
- **Fix:** Ganti ke axios dengan auto-configured CSRF

### 3. **Production Crash - Null Reference Error** ⚠️ CRITICAL
- **Penyebab:** Properties diakses tanpa null check (`jobInvitation.job_listing.title`)
- **Fix:** Optional chaining di 15+ tempat (`jobInvitation?.job_listing?.title || 'Chat'`)
- **Impact:** Mencegah crash di production saat data incomplete

### 4. **Tidak Ada Test Data**
- **Penyebab:** Semua data dummy sudah dihapus
- **Fix:** TestJobInvitationSeeder untuk create test data

Dengan perubahan ini, fitur chat seharusnya:
✅ Tidak crash di production
✅ Handle missing data dengan graceful
✅ CSRF token bekerja dengan baik
✅ Berfungsi dari kedua sisi (user & company)

## Next Steps (Opsional)

1. ✅ Test real-time updates dengan Pusher/WebSockets
2. ✅ Implementasi read receipts (sudah ada di code)
3. ✅ Notification untuk new messages (sudah ada di code)
4. ✅ File upload/attachment (sudah ada di code)
5. ✅ Message pagination untuk conversation panjang
