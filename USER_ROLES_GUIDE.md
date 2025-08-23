# User Roles & Navigation Guide

Aplikasi ini sekarang mendukung sistem role-based navigation yang membedakan pengalaman pengguna berdasarkan role mereka.

## Role Types

### 1. **Regular User (role: 'user')**
- Pengguna umum/employee yang mencari pekerjaan
- Setelah login/register akan diarahkan ke `/user/dashboard`
- Dapat akses fitur: melihat lowongan, melamar kerja, menyimpan lowongan, mengelola profil

### 2. **Admin Users (role: 'super_admin' atau 'company_admin')**
- Admin yang mengelola sistem
- Setelah login/register akan diarahkan ke `/admin/dashboard`
- Dapat akses panel admin untuk mengelola sistem

## Navigation Changes

### Navbar Dropdown Menu
Berdasarkan role user, menu dropdown akan menampilkan:

**For Regular Users (role: 'user'):**
- "Dashboard Saya" → `/user/dashboard`
- "Profil Saya" → `/user/profile`

**For Admin Users:**
- "Admin Dashboard" → `/admin/dashboard`
- "Settings" → `/settings/profile`

### After Login/Register Redirect
- **Regular Users:** Diarahkan ke `/user/dashboard`
- **Admin Users:** Diarahkan ke `/admin/dashboard`

## New Routes

### User Routes (`/user/*`)
```
GET /user/dashboard          - Dashboard untuk regular users
GET /user/profile           - Edit profile page
PATCH /user/profile         - Update profile
PATCH /user/profile/password - Update password
```

### Middleware Protection
- Route `/user/*` dilindungi middleware `user.role` yang memastikan hanya user dengan role `'user'` yang bisa akses
- Admin yang coba akses route user akan di-redirect ke admin dashboard
- User regular yang coba akses route admin akan di-redirect sesuai role mereka

## User Dashboard Features

Dashboard user regular berisi:

### Statistics Cards
- Total Lamaran
- Pekerjaan Disimpan  
- Menunggu Respon
- Interview

### Recent Activities
- 5 lamaran terbaru dengan status
- 5 pekerjaan yang disimpan
- Link untuk melihat detail setiap item

### Quick Actions
- Edit Profil
- Cari Pekerjaan
- Jelajahi Perusahaan

## User Profile Management

User dapat mengelola:
- Informasi dasar (nama, email, telepon)
- Informasi personal (bio, lokasi, posisi saat ini)
- Social links (portfolio, LinkedIn, GitHub)
- Password

## Files Modified/Created

### Controllers
- `app/Http/Controllers/User/DashboardController.php` - User dashboard
- `app/Http/Controllers/User/ProfileController.php` - User profile management
- `app/Http/Controllers/Auth/AuthenticatedSessionController.php` - Role-based login redirect
- `app/Http/Controllers/Auth/RegisteredUserController.php` - Role-based register redirect

### Middleware
- `app/Http/Middleware/EnsureUserIsRegularUser.php` - Proteksi route user

### Routes
- `routes/user.php` - User-specific routes

### Frontend Pages
- `resources/js/pages/user/dashboard.tsx` - User dashboard
- `resources/js/pages/user/profile/edit.tsx` - User profile edit

### Components
- Updated `resources/js/components/modern-navbar.tsx` - Role-based navigation

### Configuration
- `bootstrap/app.php` - Added user routes and middleware alias

## Testing Role-Based Navigation

### Test Regular User Flow:
1. Register dengan role 'user' (default)
2. Seharusnya diarahkan ke `/user/dashboard`
3. Check navbar dropdown - seharusnya tampil "Dashboard Saya" dan "Profil Saya"
4. Click "Dashboard Saya" → ke `/user/dashboard`
5. Click "Profil Saya" → ke `/user/profile`

### Test Admin User Flow:
1. Login sebagai user dengan role 'super_admin' atau 'company_admin'
2. Seharusnya diarahkan ke `/admin/dashboard`  
3. Check navbar dropdown - seharusnya tampil "Admin Dashboard" dan "Settings"
4. Click "Admin Dashboard" → ke `/admin/dashboard`

### Test Access Protection:
1. Login sebagai regular user, coba akses `/admin/dashboard` → should redirect
2. Login sebagai admin, coba akses `/user/dashboard` → should redirect

## Default Role Assignment

Saat register baru, user secara default akan mendapat role `'user'` sesuai dengan form register yang dibuat untuk employee.

## Migration Requirements

Jika database belum memiliki role kolom atau ada user existing tanpa role, perlu update:

```sql
UPDATE users SET role = 'user' WHERE role IS NULL OR role = '';
```