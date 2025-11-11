<?php

namespace App\Http\Middleware;

use App\Models\Company;
use App\Models\JobListing;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $settings = optional(Setting::first(), function ($setting) {
            $normalize = function (?string $path): ?string {
                if (! $path) {
                    return null;
                }
                if (preg_match('/^(https?:\/\/|\/storage\/)/', $path)) {
                    return $path;
                }
                return asset('storage/' . ltrim($path, '/'));
            };

            $setting->logo = $normalize($setting->logo);
            $setting->thumbnail = $normalize($setting->thumbnail);
            $setting->hero_image = $normalize($setting->hero_image);

            return $setting;
        });

        $realStats = Cache::remember('global_real_statistics', now()->addMinutes(5), function () {
            return [
                'total_jobs' => JobListing::published()->count(),
                'total_companies' => Company::where('is_active', true)->count(),
                'total_candidates' => User::where('role', 'user')->count(),
                'featured_jobs' => JobListing::published()->featured()->count(),
            ];
        });

        $statistics = $realStats;
        if ($settings && $settings->use_custom_stats) {
            $statistics = [
                'total_jobs' => $settings->custom_total_jobs ?? $realStats['total_jobs'],
                'total_companies' => $settings->custom_total_companies ?? $realStats['total_companies'],
                'total_candidates' => $settings->custom_total_candidates ?? $realStats['total_candidates'],
                'featured_jobs' => $realStats['featured_jobs'],
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user()?->load('profile'),
            ],
            // Global flash messages
            'flash' => fn () => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
                'data' => session('flash_data'),
            ],
            'settings' => $settings ?: new Setting(),
            'statistics' => $statistics,
            'recaptcha' => [
                'site_key' => config('captcha.sitekey'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
