# Troubleshooting: Hero Section Form Tidak Muncul

## Status Saat Ini
✅ Code sudah ditambahkan ke `edit.tsx` (1333 lines)
✅ Code sudah ter-compile ke `edit-27V6wAm6.js`
✅ Manifest sudah update
✅ "Hero Section Homepage" ada di compiled file
✅ Build berhasil tanpa error
✅ Laravel cache sudah di-clear

## Langkah-langkah Troubleshooting

### 1. **Hard Refresh Browser (WAJIB!)**
```
Chrome/Edge: Ctrl + Shift + R (Windows/Linux) atau Cmd + Shift + R (Mac)
Firefox: Ctrl + F5 (Windows/Linux) atau Cmd + Shift + R (Mac)
Safari: Cmd + Option + R
```

### 2. **Buka Browser DevTools dan Check Console**
1. Tekan F12 untuk buka DevTools
2. Pergi ke tab "Console"
3. Refresh halaman
4. Lihat apakah ada error merah
5. Screenshot error jika ada

### 3. **Check Network Tab**
1. Buka DevTools (F12)
2. Pergi ke tab "Network"
3. Refresh halaman (Ctrl+R)
4. Cari file `edit-27V6wAm6.js` di list
5. Pastikan status code 200 (hijau)
6. Jika 304 (cache), klik kanan → "Clear browser cache" → refresh lagi

### 4. **Disable Browser Cache Saat Development**
1. Buka DevTools (F12)
2. Pergi ke tab "Network"
3. ✅ Centang "Disable cache"
4. Biarkan DevTools tetap terbuka
5. Refresh halaman

### 5. **Private/Incognito Mode Test**
```
Chrome: Ctrl + Shift + N
Firefox: Ctrl + Shift + P
Safari: Cmd + Shift + N
```
- Login ke admin di private window
- Pergi ke /admin/settings
- Jika muncul di private window → masalah browser cache
- Jika tidak muncul → ada masalah lain

### 6. **Check File Manifest**
```bash
cat public/build/manifest.json | grep "admin/settings/edit"
```
Output harus:
```json
"resources/js/pages/admin/settings/edit.tsx": {
    "file": "assets/edit-27V6wAm6.js",
    ...
}
```

### 7. **Verify Hero Section in Compiled JS**
```bash
grep "Hero Section Homepage" public/build/assets/edit-27V6wAm6.js
```
Harus return: `Hero Section Homepage`

### 8. **Force Browser to Load New Version**
Tambahkan query string saat akses:
```
http://127.0.0.1:8000/admin/settings?v=2
```

### 9. **Check PHP Session**
```bash
php artisan session:clear
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### 10. **Restart Everything**
```bash
# Stop server (Ctrl+C)
# Clear everything
php artisan optimize:clear
rm -rf public/build
npm run build

# Start server lagi
php artisan serve
```

## Jika Masih Tidak Muncul

### Debug di Browser Console
Jalankan di Console (F12 → Console tab):
```javascript
// Check if heroImagePreview state exists
console.log(document.querySelector('[id="hero_title"]'));
console.log(document.querySelector('[id="hero_subtitle"]'));

// Search for "Hero Section" text in page
console.log(document.body.innerText.includes('Hero Section Homepage'));
```

### Manual Verification
1. View Page Source (Ctrl+U)
2. Search (Ctrl+F) untuk: `edit-27V6wAm6.js`
3. Pastikan file yang di-load adalah yang terbaru

### Check Browser Console Errors
Jika ada error seperti:
- `Uncaught SyntaxError` → Ada syntax error di JS
- `Cannot read property` → Variable tidak terdefinisi
- `Module not found` → Import error

Screenshot error dan share untuk debugging lebih lanjut.

## Yang Harus Muncul

Setelah semua langkah di atas, Anda harus melihat:

```
┌─────────────────────────────────────────┐
│ 📷 Hero Section Homepage                │
│ Gambar dan teks yang tampil di bagian  │
│ hero section halaman utama (berbeda    │
│ dari thumbnail untuk login/register)   │
├─────────────────────────────────────────┤
│ [Hero Image Upload Area]               │
│                                         │
│ Hero Title (Opsional)                   │
│ [_________________________________]      │
│                                         │
│ Hero Subtitle (Opsional)                │
│ [_________________________________]      │
│ [_________________________________]      │
│ [_________________________________]      │
│                                         │
│ ℹ️ Hero image akan tampil di sebelah    │
│ kanan hero section halaman utama.       │
│ Sedangkan thumbnail untuk login/        │
│ register tetap terpisah.                │
└─────────────────────────────────────────┘

[Simpan Pengaturan]
```

Lokasi: Scroll ke bawah di `/admin/settings`, sebelum tombol "Simpan Pengaturan"

## Contact for Support
Jika setelah semua langkah masih tidak muncul:
1. Screenshot halaman `/admin/settings`
2. Screenshot browser console (F12 → Console)
3. Screenshot network tab dengan file `edit-*.js`
4. Share untuk debugging lebih lanjut
