<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\Company;
use App\Services\EmailService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Send verification reminder to companies that haven't verified after 3 days
Schedule::call(function () {
    $companies = Company::where('verification_status', 'unverified')
        ->whereDate('created_at', '=', now()->subDays(3)->toDateString())
        ->get();

    foreach ($companies as $company) {
        try {
            EmailService::send('employer-verification-reminder', $company->email, [
                'company_name' => $company->name,
                'days_since_registration' => 3,
                'verification_url' => route('admin.dashboard'), // Company sees status in dashboard
            ]);

            \Log::info("Verification reminder sent to company: {$company->name}");
        } catch (\Exception $e) {
            \Log::error("Failed to send verification reminder to {$company->name}: " . $e->getMessage());
        }
    }
})->daily()->at('09:00')->name('send-verification-reminders');
