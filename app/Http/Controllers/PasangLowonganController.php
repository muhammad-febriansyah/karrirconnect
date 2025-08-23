<?php

namespace App\Http\Controllers;

use App\Models\PointPackage;
use App\Models\JobListing;
use App\Models\Company;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;
use Log;

class PasangLowonganController extends Controller
{
    /**
     * Display the job posting information page
     */
    public function index()
    {
        try {
            // Get active point packages for display with fallback
            $pointPackages = collect([]);
            
            try {
                $pointPackages = PointPackage::active()
                    ->orderBy('is_featured', 'desc')
                    ->orderBy('price')
                    ->get()
                    ->map(function ($package) {
                        return [
                            'id' => $package->id,
                            'name' => $package->name,
                            'description' => $package->description,
                            'points' => $package->points,
                            'price' => $package->price,
                            'bonus_points' => $package->bonus_points,
                            'is_featured' => $package->is_featured,
                            'features' => $package->features ?? [],
                            'total_points' => $package->total_points,
                            'formatted_price' => $package->formatted_price,
                        ];
                    });
            } catch (Exception $e) {
                Log::error('Error loading point packages: ' . $e->getMessage());
                // Fallback data if database doesn't exist yet
                $pointPackages = collect([
                    [
                        'id' => 1,
                        'name' => 'Paket Starter',
                        'description' => 'Cocok untuk perusahaan kecil yang baru memulai merekrut',
                        'points' => 5,
                        'price' => 50000,
                        'bonus_points' => 0,
                        'is_featured' => false,
                        'features' => ['5 credit posting lowongan', 'Berlaku 3 bulan'],
                        'total_points' => 5,
                        'formatted_price' => 'Rp 50.000',
                    ],
                    [
                        'id' => 2,
                        'name' => 'Paket Business',
                        'description' => 'Pilihan terpopuler untuk perusahaan menengah',
                        'points' => 15,
                        'price' => 135000,
                        'bonus_points' => 3,
                        'is_featured' => true,
                        'features' => ['15 credit posting lowongan', '3 bonus credit', 'Berlaku 6 bulan'],
                        'total_points' => 18,
                        'formatted_price' => 'Rp 135.000',
                    ],
                    [
                        'id' => 3,
                        'name' => 'Paket Enterprise',
                        'description' => 'Solusi lengkap untuk perusahaan besar',
                        'points' => 50,
                        'price' => 400000,
                        'bonus_points' => 10,
                        'is_featured' => false,
                        'features' => ['50 credit posting lowongan', '10 bonus credit', 'Berlaku 1 tahun'],
                        'total_points' => 60,
                        'formatted_price' => 'Rp 400.000',
                    ]
                ]);
            }

            // Get statistics for display with fallback
            $statistics = [
                'total_jobs' => 150,
                'total_companies' => 50,
                'total_candidates' => 1000,
            ];

            try {
                $statistics = [
                    'total_jobs' => JobListing::where('status', 'published')->count() ?: 150,
                    'total_companies' => Company::where('is_active', true)->count() ?: 50,
                    'total_candidates' => User::where('role', 'user')->count() ?: 1000,
                ];
            } catch (Exception $e) {
                Log::error('Error loading statistics: ' . $e->getMessage());
            }

            // Get site settings (same as HomeController)
            $settings = Setting::first();

            return Inertia::render('pasang-lowongan', [
                'pointPackages' => $pointPackages,
                'statistics' => $statistics,
                'settings' => $settings ? [
                    'site_name' => $settings->site_name,
                    'description' => $settings->description,
                    'email' => $settings->email,
                    'phone' => $settings->phone,
                    'address' => $settings->address,
                    'logo' => $settings->logo ? asset('storage/' . $settings->logo) : null,
                    'thumbnail' => $settings->thumbnail ? asset('storage/' . $settings->thumbnail) : null,
                    'social' => [
                        'facebook' => $settings->fb,
                        'instagram' => $settings->ig,
                        'youtube' => $settings->yt,
                        'tiktok' => $settings->tiktok,
                    ],
                    'keywords' => $settings->keyword,
                ] : null,
            ]);
            
        } catch (Exception $e) {
            Log::error('Error in PasangLowonganController: ' . $e->getMessage());
            
            // Return with minimal data if everything fails
            return Inertia::render('pasang-lowongan', [
                'pointPackages' => collect([]),
                'statistics' => [
                    'total_jobs' => 150,
                    'total_companies' => 50,
                    'total_candidates' => 1000,
                ],
                'settings' => [
                    'site_name' => 'KarirConnect',
                    'description' => 'Platform karir terpercaya yang menghubungkan talenta dengan peluang terbaik',
                    'email' => null,
                    'phone' => null,
                    'address' => null,
                    'logo' => null,
                    'thumbnail' => null,
                    'social' => [
                        'facebook' => '',
                        'instagram' => '',
                        'youtube' => '',
                        'tiktok' => '',
                    ],
                    'keywords' => null,
                ],
            ]);
        }
    }
}