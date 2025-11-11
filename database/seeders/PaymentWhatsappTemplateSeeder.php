<?php

namespace Database\Seeders;

use App\Models\WhatsappTemplate;
use Illuminate\Database\Seeder;

class PaymentWhatsappTemplateSeeder extends Seeder
{
    public function run(): void
    {
        // Payment Success Template
        WhatsappTemplate::updateOrCreate(
            ['slug' => 'payment-success'],
            [
                'name' => 'Pembayaran Berhasil',
                'title' => 'PEMBAYARAN BERHASIL',
                'type' => 'notification',
                'message' => '*{company_name}*

*Detail Pembelian:*
• Paket: {package_name}
• Poin: {package_points} poin
• Harga: Rp {amount}
• Order ID: {order_id}

*Poin telah ditambahkan ke akun Anda!*
Total poin sekarang: {total_points} poin

Silakan login ke dashboard untuk menggunakan poin Anda:
{dashboard_url}

Terima kasih telah menggunakan KarirConnect!',
                'variables' => [
                    'company_name',
                    'package_name', 
                    'package_points',
                    'amount',
                    'order_id',
                    'total_points',
                    'dashboard_url'
                ],
                'description' => 'Template notifikasi WhatsApp untuk pembayaran paket poin yang berhasil',
                'is_active' => true,
                'use_emoji' => false,
                'include_timestamp' => true,
                'include_signature' => true,
                'signature_text' => '_Pesan otomatis dari KarirConnect_'
            ]
        );

        // Payment Failed Template  
        WhatsappTemplate::updateOrCreate(
            ['slug' => 'payment-failed'],
            [
                'name' => 'Pembayaran Gagal',
                'title' => 'PEMBAYARAN GAGAL',
                'type' => 'alert',
                'message' => '*{company_name}*

*Detail Pembelian:*
• Paket: {package_name}
• Poin: {package_points} poin  
• Harga: Rp {amount}
• Order ID: {order_id}

*Pembayaran tidak berhasil atau dibatalkan*

Anda dapat mencoba lagi dengan:
1. Pastikan saldo mencukupi
2. Periksa koneksi internet
3. Gunakan metode pembayaran lain

Coba lagi di:
{retry_url}

Jika masalah berlanjut, hubungi customer service kami.',
                'variables' => [
                    'company_name',
                    'package_name',
                    'package_points', 
                    'amount',
                    'order_id',
                    'retry_url'
                ],
                'description' => 'Template notifikasi WhatsApp untuk pembayaran paket poin yang gagal',
                'is_active' => true,
                'use_emoji' => false,
                'include_timestamp' => true,
                'include_signature' => true,
                'signature_text' => '_Pesan otomatis dari KarirConnect_'
            ]
        );
    }
}
