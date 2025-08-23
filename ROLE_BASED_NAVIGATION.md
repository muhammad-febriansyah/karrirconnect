# Role-Based Navigation Implementation

## Overview
Implementasi sistem navigasi berdasarkan role user untuk menyembunyikan fitur yang tidak relevan bagi setiap tipe pengguna.

## Changes Made

### 1. Navbar Navigation Filter
**File:** `resources/js/components/modern-navbar.tsx`

**Before:**
```typescript
const navItems = [
    { name: 'Lowongan', href: '/jobs', key: 'jobs' },
    { name: 'Perusahaan', href: '/companies', key: 'companies' },
    { name: 'Pasang Lowongan', href: '/pasang-lowongan', key: 'pasang-lowongan' }, // Always visible
];
```

**After:**
```typescript
// Base navigation items for all users
const baseNavItems = [
    { name: 'Lowongan', href: '/jobs', key: 'jobs' },
    { name: 'Perusahaan', href: '/companies', key: 'companies' },
];

// Add 'Pasang Lowongan' only for non-regular users (admin/company_admin) or guests
const navItems = [
    ...baseNavItems,
    ...(auth.user?.role === 'user' ? [] : [
        { name: 'Pasang Lowongan', href: '/pasang-lowongan', key: 'pasang-lowongan' }
    ])
];
```

### 2. Route Protection
**File:** `routes/web.php`

**Before:**
```php
Route::get('/pasang-lowongan', [App\Http\Controllers\PasangLowonganController::class, 'index'])->name('pasang-lowongan');
```

**After:**
```php
Route::get('/pasang-lowongan', [App\Http\Controllers\PasangLowonganController::class, 'index'])
    ->middleware(['auth', 'company.admin'])
    ->name('pasang-lowongan');
```

## Navigation Behavior

### For Regular Users (role: 'user')
**Desktop & Mobile Navbar shows:**
- Home
- Lowongan (Jobs)  
- Perusahaan (Companies)
- ~~Pasang Lowongan~~ ❌ **HIDDEN**

**User Dropdown:**
- Dashboard Saya → `/user/dashboard`
- Profil Saya → `/user/profile`
- Logout

### For Admin Users (role: 'super_admin' or 'company_admin') 
**Desktop & Mobile Navbar shows:**
- Home
- Lowongan (Jobs)
- Perusahaan (Companies)  
- Pasang Lowongan ✅ **VISIBLE**

**User Dropdown:**
- Admin Dashboard → `/admin/dashboard`
- Settings → `/settings/profile`
- Logout

### For Guests (not logged in)
**Desktop & Mobile Navbar shows:**
- Home
- Lowongan (Jobs)
- Perusahaan (Companies)
- Pasang Lowongan ✅ **VISIBLE** (will redirect to login)

**Auth buttons:**
- Masuk (Login Modal)
- Daftar (Register Modal)

## Security Implementation

### 1. Frontend Protection
- Menu "Pasang Lowongan" tidak ditampilkan untuk regular users
- Navbar secara otomatis menyesuaikan berdasarkan `auth.user.role`

### 2. Backend Protection  
- Route `/pasang-lowongan` dilindungi middleware `['auth', 'company.admin']`
- Regular users yang mencoba akses langsung akan di-redirect ke dashboard mereka
- Guest users akan di-redirect ke login page

### 3. Middleware Chain
```
/pasang-lowongan → auth → company.admin → PasangLowonganController
```

## Testing Scenarios

### Test Case 1: Regular User (role: 'user')
1. ✅ Login sebagai user dengan role 'user'
2. ✅ Check navbar - "Pasang Lowongan" tidak terlihat
3. ✅ Try direct access `/pasang-lowongan` → should redirect to user dashboard
4. ✅ User dropdown shows "Dashboard Saya" dan "Profil Saya"

### Test Case 2: Company Admin (role: 'company_admin')  
1. ✅ Login sebagai user dengan role 'company_admin'
2. ✅ Check navbar - "Pasang Lowongan" terlihat
3. ✅ Click "Pasang Lowongan" → dapat akses halaman
4. ✅ User dropdown shows "Admin Dashboard" dan "Settings"

### Test Case 3: Guest User
1. ✅ Access website without login  
2. ✅ Check navbar - "Pasang Lowongan" terlihat
3. ✅ Click "Pasang Lowongan" → redirect to login page
4. ✅ Navbar shows "Masuk" dan "Daftar" buttons

## Benefits

### 1. Better User Experience
- Clean, relevant navigation untuk setiap user type
- Tidak ada confusion dengan menu yang tidak relevan
- Streamlined interface untuk job seekers

### 2. Security
- Frontend dan backend protection
- Proper role-based access control
- Prevents unauthorized access attempts

### 3. Scalability
- Easy to add more role-based navigation items
- Flexible system untuk future role additions
- Consistent implementation pattern

## Future Enhancements

### Potential Additional Role-Based Features:
1. **HR Manager Role** - Access ke applicant management
2. **Premium User Role** - Access ke premium job features  
3. **Recruiter Role** - Access ke advanced search tools
4. **Company Owner Role** - Access ke company settings

### Implementation Pattern:
```typescript
const getNavItemsForRole = (userRole: string) => {
    const base = [/* base items */];
    
    switch(userRole) {
        case 'user': return [...base];
        case 'company_admin': return [...base, /* company items */];
        case 'super_admin': return [...base, /* all admin items */];
        // ... more roles
    }
};
```

This implementation provides a solid foundation for role-based navigation yang dapat dikembangkan sesuai kebutuhan business logic di masa depan.