<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PointPackage;

class PointPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Paket Starter',
                'description' => 'Cocok untuk perusahaan kecil yang baru memulai merekrut. Dapatkan 5 poin untuk posting lowongan dengan harga terjangkau.',
                'points' => 5,
                'price' => 50000,
                'bonus_points' => 0,
                'validity_days' => 90,
                'is_active' => true,
                'is_featured' => false,
                'features' => [
                    '5 credit posting lowongan',
                    'Berlaku 3 bulan',
                    'Support email',
                ]
            ],
            [
                'name' => 'Paket Business',
                'description' => 'Pilihan terpopuler untuk perusahaan menengah. Dapatkan 15 poin + 3 bonus poin untuk kebutuhan rekrutmen rutin.',
                'points' => 15,
                'price' => 135000,
                'bonus_points' => 3,
                'validity_days' => 180,
                'is_active' => true,
                'is_featured' => true,
                'features' => [
                    '15 credit posting lowongan',
                    '3 bonus credit',
                    'Berlaku 6 bulan',
                    'Support prioritas',
                    'Analytics basic',
                ]
            ],
            [
                'name' => 'Paket Enterprise',
                'description' => 'Solusi lengkap untuk perusahaan besar dengan kebutuhan rekrutmen tinggi. Dapatkan value terbaik dengan 50 poin + 10 bonus.',
                'points' => 50,
                'price' => 400000,
                'bonus_points' => 10,
                'validity_days' => 365,
                'is_active' => true,
                'is_featured' => false,
                'features' => [
                    '50 credit posting lowongan',
                    '10 bonus credit',
                    'Berlaku 1 tahun',
                    'Priority support 24/7',
                    'Advanced analytics',
                    'Dedicated account manager',
                    'Custom branding',
                ]
            ],
            [
                'name' => 'Paket Unlimited',
                'description' => 'Paket khusus untuk enterprise dengan kebutuhan unlimited. Posting lowongan tanpa batas selama periode berlangganan.',
                'points' => 999,
                'price' => 2000000,
                'bonus_points' => 0,
                'validity_days' => 365,
                'is_active' => true,
                'is_featured' => false,
                'features' => [
                    'Unlimited posting lowongan',
                    'Berlaku 1 tahun',
                    'White-label solution',
                    'API access',
                    'Custom integrations',
                    'Dedicated infrastructure',
                    'SLA guarantee',
                ]
            ]
        ];

        foreach ($packages as $package) {
            PointPackage::create($package);
        }
    }
}