<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production or when using ngrok
        if (config('app.env') !== 'local' || str_contains(config('app.url'), 'ngrok')) {
            URL::forceScheme('https');
        }
    }
}
