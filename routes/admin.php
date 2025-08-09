<?php

use App\Http\Controllers\Admin\AboutUsController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CompanyManagementController;
use App\Http\Controllers\Admin\JobCategoryManagementController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PrivacyPolicyController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TermsOfServiceController;
use App\Http\Controllers\Admin\UserAgreementController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use Illuminate\Support\Facades\Route;

// Admin routes - require authentication and admin role
Route::middleware(['auth', 'verified', App\Http\Middleware\EnsureUserIsAdmin::class])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    // Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    // Admin Profile
    Route::get('/profile', [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [AdminProfileController::class, 'update'])->name('profile.update');

    // Users Management
    Route::resource('users', UserManagementController::class);
    Route::post('/users/{user}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('users.toggle-status');

    // Companies Management
    Route::resource('companies', CompanyManagementController::class);
    Route::post('/companies/{company}/toggle-verification', [CompanyManagementController::class, 'toggleVerification'])->name('companies.toggle-verification');
    Route::post('/companies/{company}/toggle-status', [CompanyManagementController::class, 'toggleStatus'])->name('companies.toggle-status');

    // Job Categories Management
    Route::post('/job-categories/{jobCategory}/toggle-status', [JobCategoryManagementController::class, 'toggleStatus'])->name('job-categories.toggle-status');
    Route::resource('job-categories', JobCategoryManagementController::class);

    // Job Listings Management - Removed from super admin (should be company admin only)

    // Applications Management - Keep in AdminController for dashboard-like functionality
    Route::get('/applications', [AdminController::class, 'applications'])->name('applications.index');
    Route::patch('/applications/{jobApplication}/status', [AdminController::class, 'updateApplicationStatus'])->name('applications.update-status');

    // Settings Management
    Route::get('/settings', [SettingsController::class, 'edit'])->name('settings.edit');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');

    // News/Blog Management
    Route::resource('news', NewsController::class);

    // About Us Management
    Route::get('/about-us', [AboutUsController::class, 'edit'])->name('about-us.edit');
    Route::post('/about-us', [AboutUsController::class, 'update'])->name('about-us.update');

    // Privacy Policy Management
    Route::get('/privacy-policy', [PrivacyPolicyController::class, 'edit'])->name('privacy-policy.edit');
    Route::post('/privacy-policy', [PrivacyPolicyController::class, 'update'])->name('privacy-policy.update');

    // Terms of Service Management
    Route::get('/terms-of-service', [TermsOfServiceController::class, 'edit'])->name('terms-of-service.edit');
    Route::post('/terms-of-service', [TermsOfServiceController::class, 'update'])->name('terms-of-service.update');

    // User Agreement Management
    Route::get('/user-agreement', [UserAgreementController::class, 'edit'])->name('user-agreement.edit');
    Route::post('/user-agreement', [UserAgreementController::class, 'update'])->name('user-agreement.update');
});
