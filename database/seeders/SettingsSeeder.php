<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('settings')->insert([
            'site_name' => 'KarirConnect',
            'keyword' => 'job fair, karir, lowongan kerja, bursa kerja',
            'email' => 'info@karirconnect.com',
            'address' => 'Jakarta, Indonesia',
            'phone' => '+62-21-1234567',
            'description' => 'KarirConnect adalah platform job fair online yang menghubungkan pencari kerja dengan perusahaan terbaik. Temukan karir impian Anda bersama kami.',
            'yt' => 'karirconnect',
            'ig' => 'karirconnect',
            'fb' => 'karirconnect',
            'tiktok' => 'karirconnect',
            'fee' => 0,
            'logo' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
