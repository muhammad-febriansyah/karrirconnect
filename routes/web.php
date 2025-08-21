<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/about', [App\Http\Controllers\AboutController::class, 'index'])->name('about');

Route::get('/jobs', [App\Http\Controllers\JobController::class, 'index'])->name('jobs');
Route::get('/jobs/{job}', [App\Http\Controllers\JobController::class, 'show'])->name('jobs.show');

Route::get('/companies', [App\Http\Controllers\CompanyController::class, 'index'])->name('companies');
Route::get('/companies/{company}', [App\Http\Controllers\CompanyController::class, 'show'])->name('companies.show');

Route::get('/blog', [App\Http\Controllers\BlogController::class, 'index'])->name('blog');
Route::get('/blog/{post}', [App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');

Route::get('/contact', [App\Http\Controllers\ContactController::class, 'index'])->name('contact');
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

Route::get('/privacy-policy', [App\Http\Controllers\PrivacyPolicyController::class, 'index'])->name('privacy-policy');
Route::get('/terms-of-service', [App\Http\Controllers\TermsOfServiceController::class, 'index'])->name('terms-of-service');

Route::get('/company', function () {
    return Inertia::render('company/index');
})->name('company');

Route::get('/debug', function () {
    return Inertia::render('debug');
})->name('debug');

// Favicon fallback
Route::get('/favicon.ico', function () {
    $setting = \App\Models\Setting::first();
    if ($setting && $setting->logo) {
        return redirect(asset('storage/' . $setting->logo));
    }
    return redirect(asset('favicon.svg'));
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
