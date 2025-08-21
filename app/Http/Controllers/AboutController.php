<?php

namespace App\Http\Controllers;

use App\Models\AboutUs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        $aboutUs = AboutUs::where('is_active', true)->first();
        
        // If no active about us data found, create default structure
        if (!$aboutUs) {
            $aboutUs = [
                'title' => 'Tentang KarirConnect',
                'description' => 'Platform terpercaya untuk menghubungkan talenta terbaik dengan perusahaan-perusahaan leading di Indonesia.',
                'vision' => 'Menjadi platform karir terdepan yang menghubungkan talenta dengan opportunity terbaik.',
                'mission' => 'Memudahkan pencarian kerja dan rekrutmen dengan teknologi dan layanan terpercaya.',
                'values' => [
                    [
                        'title' => 'Integritas',
                        'description' => 'Kami berkomitmen pada transparansi dan kejujuran dalam setiap layanan.'
                    ],
                    [
                        'title' => 'Inovasi',
                        'description' => 'Selalu menghadirkan solusi terdepan untuk kebutuhan karir dan rekrutmen.'
                    ],
                    [
                        'title' => 'Excellence',
                        'description' => 'Memberikan pengalaman terbaik bagi job seekers dan perusahaan.'
                    ]
                ],
                'features' => [
                    [
                        'title' => 'Smart Matching',
                        'description' => 'Algorithm cerdas untuk mencocokkan kandidat dengan posisi yang tepat.',
                        'icon' => 'target'
                    ],
                    [
                        'title' => 'Verified Companies',
                        'description' => 'Hanya perusahaan terverifikasi yang dapat posting lowongan.',
                        'icon' => 'shield-check'
                    ],
                    [
                        'title' => 'Career Guidance',
                        'description' => 'Tips dan panduan karir dari para ahli industri.',
                        'icon' => 'graduation-cap'
                    ]
                ],
                'stats' => [
                    [
                        'number' => '10,000+',
                        'label' => 'Active Job Seekers'
                    ],
                    [
                        'number' => '500+',
                        'label' => 'Partner Companies'
                    ],
                    [
                        'number' => '95%',
                        'label' => 'Success Rate'
                    ],
                    [
                        'number' => '24/7',
                        'label' => 'Support Available'
                    ]
                ],
                'team' => [
                    [
                        'name' => 'John Doe',
                        'position' => 'CEO & Founder',
                        'description' => 'Visionary leader dengan pengalaman 15+ tahun di industri HR Tech.',
                        'image' => null
                    ],
                    [
                        'name' => 'Jane Smith',
                        'position' => 'CTO',
                        'description' => 'Expert teknologi yang memimpin inovasi platform kami.',
                        'image' => null
                    ],
                    [
                        'name' => 'Mike Johnson',
                        'position' => 'Head of Operations',
                        'description' => 'Memastikan operasional berjalan lancar dan efisien.',
                        'image' => null
                    ]
                ],
                'contact' => [
                    'email' => 'info@karirconnect.com',
                    'phone' => '+62 21 1234 5678',
                    'address' => 'Jakarta, Indonesia',
                    'social' => [
                        'linkedin' => '#',
                        'twitter' => '#',
                        'instagram' => '#'
                    ]
                ],
                'cta_title' => 'Siap Memulai Karir Impian Anda?',
                'cta_description' => 'Bergabunglah dengan ribuan profesional yang telah mempercayai platform kami untuk mengembangkan karir mereka.',
                'is_active' => true
            ];
        }

        return Inertia::render('about', [
            'aboutUs' => $aboutUs
        ]);
    }
}