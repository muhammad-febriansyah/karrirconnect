# Point-Based Job Posting System - Setup Guide

## 🎯 System Overview

Sistem point-based job posting yang memungkinkan company admin untuk membeli poin dan menggunakannya untuk posting lowongan pekerjaan, dengan integrasi payment gateway Midtrans.

## 🚀 Setup Instructions

### 1. Environment Configuration

Tambahkan konfigurasi berikut ke file `.env`:

```env
# Midtrans Payment Gateway Configuration
MIDTRANS_SERVER_KEY=your_midtrans_server_key_here
MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true

# Frontend Environment Variables (accessible in JavaScript)
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
VITE_MIDTRANS_IS_PRODUCTION=false
```

**Cara mendapatkan Midtrans credentials:**
1. Daftar di [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Buat merchant account
3. Ambil Server Key dan Client Key dari Settings > Access Keys
4. Untuk testing, gunakan Sandbox keys
5. Untuk production, gunakan Production keys dan set `MIDTRANS_IS_PRODUCTION=true`

### 2. Database Migration

Migration sudah dijalankan, tapi jika perlu manual:

```bash
php artisan migrate
```

### 3. Seed Data

```bash
# Seed point packages
php artisan db:seed --class=PointPackageSeeder

# Update existing companies with default points
php artisan db:seed --class=UpdateCompaniesWithPointsSeeder
```

### 4. Routes Registration

Routes sudah terdaftar di `bootstrap/app.php`. Pastikan file `routes/company.php` dan `routes/admin.php` ter-load dengan benar.

## 🧪 Testing Guide

### 1. Test User Setup

Gunakan user dengan role `company_admin` yang sudah memiliki `company_id`. 

**Default test user:**
- Email: `company@admin.com` 
- Password: `password`
- Role: `company_admin`

### 2. Test Flow

#### A. Login sebagai Company Admin

1. Login dengan akun company admin
2. Navigasi ke sidebar "Billing & Poin" > "Poin Saya"
3. Cek point balance (default: 5 poin)

#### B. Test Point Purchase

1. Klik "Beli Poin" atau navigasi ke "Billing & Poin" > "Beli Poin"
2. Pilih salah satu paket (contoh: Paket Business)
3. Klik "Beli Sekarang"
4. Akan redirect ke halaman payment Midtrans
5. Gunakan test card numbers untuk testing:

**Midtrans Test Cards:**
```
# Success Payment
Card Number: 4811 1111 1111 1114
CVV: 123
Exp: 01/25

# Failed Payment  
Card Number: 4911 1111 1111 1113
CVV: 123
Exp: 01/25

# Pending Payment
Card Number: 4411 1111 1111 1118
CVV: 123
Exp: 01/25
```

#### C. Test Job Creation with Points

1. Setelah berhasil beli poin, navigasi ke "Recruitment" > "Lowongan"
2. Klik "Buat Lowongan" 
3. Pastikan sidebar menampilkan point balance
4. Isi form dan submit
5. Poin akan berkurang 1 setelah berhasil buat lowongan

#### D. Test Point Limit

1. Gunakan semua poin dengan membuat lowongan
2. Coba buat lowongan lagi ketika poin = 0
3. Sistem akan redirect ke halaman "Beli Poin" dengan pesan error

### 3. Admin Testing

#### A. Login sebagai Super Admin

1. Login dengan akun super admin
2. Navigasi ke "Sistem & Billing" > "Paket Poin"

#### B. Test Package Management

1. Lihat daftar paket poin
2. Test create paket baru
3. Test edit paket existing
4. Test toggle status paket (aktif/nonaktif)

## 📊 Key Features

### For Company Admin:
- ✅ Dashboard poin dengan statistik lengkap
- ✅ Purchase poin dengan berbagai paket
- ✅ Payment integration dengan Midtrans
- ✅ Point balance tracking
- ✅ Transaction history
- ✅ Job creation point deduction
- ✅ Point limit validation
- ✅ Low balance warnings

### For Super Admin:
- ✅ Point package management (CRUD)
- ✅ Package status control
- ✅ Transaction monitoring
- ✅ System oversight

### Payment Integration:
- ✅ Midtrans Snap integration
- ✅ Multiple payment methods (Credit Card, Bank Transfer, E-wallets)
- ✅ Webhook handling untuk auto point credit
- ✅ Payment status tracking
- ✅ Transaction audit trail

## 🔧 Troubleshooting

### Common Issues:

#### 1. Payment Popup Tidak Muncul
```javascript
// Check browser console untuk error
// Pastikan VITE_MIDTRANS_CLIENT_KEY sudah diset di .env
// Pastikan script Midtrans ter-load
```

#### 2. Points Tidak Bertambah Setelah Payment
```bash
# Check webhook URL accessible
# Check server logs untuk webhook errors
# Test webhook manual:
curl -X POST http://your-domain.com/webhook/midtrans \
  -H "Content-Type: application/json" \
  -d '{"order_id":"test-order","transaction_status":"settlement"}'
```

#### 3. Job Creation Tidak Mengurangi Points
```bash
# Check log untuk error di store method
# Pastikan user memiliki company_id
# Check point balance sebelum dan sesudah
```

### Development Tips:

1. **Testing Webhook Locally:**
   ```bash
   # Gunakan ngrok untuk expose local server
   ngrok http 8000
   # Set webhook URL di Midtrans dashboard ke ngrok URL
   ```

2. **Debug Payment Flow:**
   ```javascript
   // Enable console logging di payment.tsx
   console.log('Snap token:', snapToken);
   console.log('Payment result:', result);
   ```

3. **Check Database State:**
   ```sql
   SELECT * FROM companies WHERE id = 1;
   SELECT * FROM point_transactions WHERE company_id = 1;
   SELECT * FROM point_packages WHERE is_active = 1;
   ```

## 🚀 Production Deployment

### 1. Environment Setup
```env
MIDTRANS_IS_PRODUCTION=true
VITE_MIDTRANS_IS_PRODUCTION=true
# Use production keys dari Midtrans
```

### 2. Webhook Configuration
Set webhook URL di Midtrans dashboard:
```
https://your-domain.com/webhook/midtrans
```

### 3. SSL Certificate
Pastikan HTTPS aktif untuk payment security.

### 4. Server Requirements
- PHP 8.1+
- Laravel 11
- MySQL/PostgreSQL
- Redis (optional, untuk caching)

## 📈 Monitoring

Track metrics berikut untuk sistem health:
- Payment success rate
- Point consumption patterns  
- Package popularity
- Company churn rate
- Revenue per package

## 🎉 Success!

Sistem point-based job posting sudah siap digunakan! 🚀

Sistem ini memberikan kontrol penuh kepada admin untuk mengelola monetisasi platform, while providing seamless experience untuk company admin dalam membeli dan menggunakan poin untuk posting lowongan.