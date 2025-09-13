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
                        'description' => 'Kami berkomitmen pada transparansi dan kejujuran dalam setiap layanan.',
                        'icon' => 'handshake'
                    ],
                    [
                        'title' => 'Inovasi',
                        'description' => 'Selalu menghadirkan solusi terdepan untuk kebutuhan karir dan rekrutmen.',
                        'icon' => 'lightbulb'
                    ],
                    [
                        'title' => 'Excellence',
                        'description' => 'Memberikan pengalaman terbaik bagi job seekers dan perusahaan.',
                        'icon' => 'trophy'
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
        } else {
            // If data exists from database, convert to array for processing
            $aboutUs = $aboutUs->toArray();
            
            // Process values from database
            if (isset($aboutUs['values']) && is_array($aboutUs['values'])) {
                foreach ($aboutUs['values'] as $index => &$value) {
                    // Ensure all required fields exist
                    if (!isset($value['title'])) $value['title'] = 'Nilai ' . ($index + 1);
                    if (!isset($value['description'])) $value['description'] = '';
                    
                    // Handle icon field - prioritize database icon value
                    if (!empty($value['icon'])) {
                        // If it's an image path, convert to Lucide icon name
                        if (str_contains($value['icon'], '/')) {
                            // Map common values to appropriate icons
                            $title = strtolower($value['title'] ?? '');
                            if (str_contains($title, 'integritas') || str_contains($title, 'integrity')) {
                                $value['icon'] = 'handshake';
                            } elseif (str_contains($title, 'inovasi') || str_contains($title, 'innovation')) {
                                $value['icon'] = 'lightbulb';
                            } elseif (str_contains($title, 'excellence') || str_contains($title, 'keunggulan')) {
                                $value['icon'] = 'trophy';
                            } elseif (str_contains($title, 'kepedulian') || str_contains($title, 'care')) {
                                $value['icon'] = 'heart';
                            } elseif (str_contains($title, 'professional') || str_contains($title, 'profesional')) {
                                $value['icon'] = 'briefcase';
                            } else {
                                // Fallback based on index
                                $defaultIcons = ['handshake', 'lightbulb', 'trophy', 'heart', 'diamond', 'rocket', 'shield', 'star'];
                                $value['icon'] = $defaultIcons[$index % count($defaultIcons)];
                            }
                        }
                        // If it's already a Lucide icon name, keep it as is
                    } else {
                        // No icon set, use fallback
                        $defaultIcons = ['handshake', 'lightbulb', 'trophy', 'heart', 'diamond', 'rocket', 'shield', 'star'];
                        $value['icon'] = $defaultIcons[$index % count($defaultIcons)];
                    }
                }
            }
            
            // Process features from database
            if (isset($aboutUs['features']) && is_array($aboutUs['features'])) {
                foreach ($aboutUs['features'] as $index => &$feature) {
                    // Ensure all required fields exist
                    if (!isset($feature['title'])) $feature['title'] = 'Fitur ' . ($index + 1);
                    if (!isset($feature['description'])) $feature['description'] = '';
                    
                    // Handle icon field - prioritize database icon value
                    if (!empty($feature['icon'])) {
                        // If it's an image path, convert to Lucide icon name
                        if (str_contains($feature['icon'], '/')) {
                            // Map common features to appropriate icons
                            $title = strtolower($feature['title'] ?? '');
                            if (str_contains($title, 'matching') || str_contains($title, 'algoritma')) {
                                $feature['icon'] = 'target';
                            } elseif (str_contains($title, 'verified') || str_contains($title, 'verifikasi')) {
                                $feature['icon'] = 'shield';
                            } elseif (str_contains($title, 'guidance') || str_contains($title, 'panduan')) {
                                $feature['icon'] = 'graduation-cap';
                            } elseif (str_contains($title, 'search') || str_contains($title, 'pencarian')) {
                                $feature['icon'] = 'search';
                            } elseif (str_contains($title, 'company') || str_contains($title, 'perusahaan')) {
                                $feature['icon'] = 'building-2';
                            } else {
                                // Fallback based on index
                                $defaultIcons = ['target', 'shield', 'graduation-cap', 'search', 'building-2', 'users', 'globe', 'star'];
                                $feature['icon'] = $defaultIcons[$index % count($defaultIcons)];
                            }
                        }
                        // If it's already a Lucide icon name, keep it as is
                    } else {
                        // No icon set, use fallback
                        $defaultIcons = ['target', 'shield', 'graduation-cap', 'search', 'building-2', 'users', 'globe', 'star'];
                        $feature['icon'] = $defaultIcons[$index % count($defaultIcons)];
                    }
                }
            } else {
                // If no features in database, use default
                $aboutUs['features'] = [
                    [
                        'title' => 'Smart Matching',
                        'description' => 'Algorithm cerdas untuk mencocokkan kandidat dengan posisi yang tepat.',
                        'icon' => 'target'
                    ],
                    [
                        'title' => 'Verified Companies',
                        'description' => 'Hanya perusahaan terverifikasi yang dapat posting lowongan.',
                        'icon' => 'shield'
                    ],
                    [
                        'title' => 'Career Guidance',
                        'description' => 'Tips dan panduan karir dari para ahli industri.',
                        'icon' => 'graduation-cap'
                    ]
                ];
            }
        }

        return Inertia::render('about', [
            'aboutUs' => $aboutUs
        ]);
    }
}