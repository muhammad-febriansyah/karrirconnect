# Dashboard Charts Documentation

## Overview
Dashboard ini menggunakan Chart.js untuk menampilkan visualisasi data yang berbeda berdasarkan role user:

## Super Admin Dashboard Charts

### 1. **Pertumbuhan Pengguna** (Line Chart)
- Menampilkan tren pertambahan user baru per bulan
- Data: 12 bulan terakhir
- Warna: Biru (#3b82f6)

### 2. **Pengguna per Role** (Doughnut Chart)
- Distribusi user berdasarkan role (User, Company Admin, Super Admin)
- Data: Real-time count per role
- Warna: Biru, Hijau, Amber, Merah

### 3. **Lowongan per Kategori** (Horizontal Bar Chart)
- Top 10 kategori dengan lowongan terbanyak
- Data: Count berdasarkan job category
- Warna: Purple (#9333ea)

### 4. **Status Lamaran** (Doughnut Chart)
- Distribusi lamaran berdasarkan status
- Status: Pending, Under Review, Accepted, Rejected
- Warna: Amber, Hijau, Merah, Abu-abu

### 5. **Pertumbuhan Perusahaan** (Bar Chart)
- Tren registrasi perusahaan baru per bulan
- Data: 12 bulan terakhir
- Warna: Indigo (#6366f1)

## Company Admin Dashboard Charts

### 1. **Status Lowongan** (Doughnut Chart)
- Distribusi lowongan berdasarkan status
- Status: Aktif, Expired
- Warna: Hijau (Aktif), Merah (Expired)

### 2. **Status Lamaran** (Doughnut Chart)
- Distribusi lamaran untuk lowongan perusahaan
- Status: Pending, Diterima, Ditolak
- Warna: Amber, Hijau, Merah

### 3. **Lowongan Bulanan** (Line Chart)
- Tren posting lowongan per bulan
- Data: 12 bulan terakhir
- Warna: Purple (#9333ea)

### 4. **Lamaran per Lowongan** (Horizontal Bar Chart)
- Top 10 lowongan dengan lamaran terbanyak
- Data: Count aplikasi per job title
- Warna: Orange (#fb923c)

### 5. **Tren Lamaran Bulanan** (Bar Chart)
- Tren jumlah lamaran masuk per bulan
- Data: 12 bulan terakhir
- Warna: Indigo (#6366f1)

## Technical Implementation

### Dependencies
```bash
npm install chart.js react-chartjs-2
```

### Files Created/Modified
1. `resources/js/components/dashboard-charts.tsx` - Main chart component
2. `resources/js/pages/admin/dashboard.tsx` - Updated dashboard page
3. `app/Http/Controllers/Admin/AdminController.php` - Added chart data methods

### Chart Configuration
- Responsive design
- Animation on load
- Consistent color scheme
- Y-axis starts from zero
- Proper legends and tooltips

### Data Structure

**Super Admin Data:**
```php
[
    'usersStats' => [
        'total' => int,
        'monthly' => array,
        'byRole' => array
    ],
    'companiesStats' => [...],
    'jobsStats' => [...],
    'applicationsStats' => [...]
]
```

**Company Admin Data:**
```php
[
    'companyJobsStats' => [
        'total' => int,
        'active' => int,
        'expired' => int,
        'monthly' => array
    ],
    'companyApplicationsStats' => [...]
]
```

## Performance Considerations
- Data is cached for 12 months lookback
- Queries are optimized with proper indexing
- Charts use lazy loading
- Responsive design adapts to screen size

## Usage
The charts automatically render based on user role when `chartData` prop is provided to the dashboard page.

## Customization
Colors, chart types, and time ranges can be modified in the `DashboardCharts` component.