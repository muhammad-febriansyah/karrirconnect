<?php

use App\Http\Controllers\Admin\AboutUsController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdvancedUserManagementController;
use App\Http\Controllers\Admin\ApplicationManagementController;
use App\Http\Controllers\Admin\CompanyManagementController;
use App\Http\Controllers\Admin\JobListingsController;
use App\Http\Controllers\Admin\EmailManagementController;
use App\Http\Controllers\Admin\JobCategoryManagementController;
use App\Http\Controllers\Admin\ModerationController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PrivacyPolicyController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TermsOfServiceController;
use App\Http\Controllers\Admin\UserAgreementController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\PointPackageController;
use App\Http\Controllers\Admin\TransactionController;
use Illuminate\Support\Facades\Route;

// Admin routes - require authentication and admin role (both super_admin and company_admin)
Route::middleware(['auth', 'verified', 'admin.role'])->prefix('admin')->name('admin.')->group(function () {

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

    // Job Listings - Super admin read-only access (index & show only)
    Route::get('/job-listings', [JobListingsController::class, 'index'])->name('job-listings.index');
    Route::get('/job-listings/{jobListing}', [JobListingsController::class, 'show'])->name('job-listings.show');

    // Applications - Super admin read-only access (index & show only)
    Route::get('/applications', [ApplicationManagementController::class, 'index'])->name('applications.index');
    Route::get('/applications/{application}', [ApplicationManagementController::class, 'show'])->name('applications.show');

    // Transaction History - Both super_admin and company_admin can access
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::get('/transactions/export/csv', [TransactionController::class, 'export'])->name('transactions.export');


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

    // Contact Messages Management
    Route::resource('contact-messages', \App\Http\Controllers\Admin\ContactMessageController::class)->only(['index', 'show', 'destroy']);
    Route::patch('/contact-messages/{contactMessage}/status', [\App\Http\Controllers\Admin\ContactMessageController::class, 'updateStatus'])->name('contact-messages.update-status');
});

// Super Admin only routes - require super_admin role specifically
Route::middleware(['auth', 'verified', App\Http\Middleware\EnsureUserIsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    
    // Advanced User Management (Super Admin Only)
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/verification', [AdvancedUserManagementController::class, 'verification'])->name('verification');
        Route::patch('/{user}/verification', [AdvancedUserManagementController::class, 'updateVerification'])->name('update-verification');
        Route::post('/bulk-actions', [AdvancedUserManagementController::class, 'bulkActions'])->name('bulk-actions');
        Route::get('/activity-logs', [AdvancedUserManagementController::class, 'activityLogs'])->name('activity-logs');
        Route::get('/export', [AdvancedUserManagementController::class, 'export'])->name('export');
    });

    // Content Moderation (Super Admin Only)
    Route::prefix('moderation')->name('moderation.')->group(function () {
        Route::get('/job-listings', [ModerationController::class, 'jobListings'])->name('job-listings');
        Route::patch('/job-listings/{jobListing}/moderate', [ModerationController::class, 'moderateJobListing'])->name('moderate-job');
        Route::post('/job-listings/bulk-moderate', [ModerationController::class, 'bulkModerateJobs'])->name('bulk-moderate-jobs');
        Route::get('/reports', [ModerationController::class, 'reports'])->name('reports');
        Route::patch('/reports/{report}/resolve', [ModerationController::class, 'resolveReport'])->name('resolve-report');
    });

    // Email & Notification Management (Super Admin Only)
    Route::prefix('email')->name('email.')->group(function () {
        // Email Templates
        Route::get('/templates', [EmailManagementController::class, 'templates'])->name('templates');
        Route::get('/templates/create', [EmailManagementController::class, 'createTemplate'])->name('create-template');
        Route::post('/templates', [EmailManagementController::class, 'storeTemplate'])->name('store-template');
        Route::get('/templates/{template}/edit', [EmailManagementController::class, 'editTemplate'])->name('edit-template');
        Route::patch('/templates/{template}', [EmailManagementController::class, 'updateTemplate'])->name('update-template');

        // Email Campaigns
        Route::get('/campaigns', [EmailManagementController::class, 'campaigns'])->name('campaigns');
        Route::get('/campaigns/create', [EmailManagementController::class, 'createCampaign'])->name('create-campaign');
        Route::post('/campaigns', [EmailManagementController::class, 'storeCampaign'])->name('store-campaign');
        Route::post('/campaigns/{campaign}/send', [EmailManagementController::class, 'sendCampaign'])->name('send-campaign');

        // Notification Settings
        Route::get('/notification-settings', [EmailManagementController::class, 'notificationSettings'])->name('notification-settings');
        Route::get('/notification-settings/create', [EmailManagementController::class, 'createNotificationSetting'])->name('create-notification-setting');
        Route::post('/notification-settings', [EmailManagementController::class, 'storeNotificationSetting'])->name('store-notification-setting');
        Route::patch('/notification-settings/{setting}', [EmailManagementController::class, 'updateNotificationSetting'])->name('update-notification-setting');
    });

    // Point Package Management (Super Admin Only)
    Route::resource('point-packages', PointPackageController::class);
    Route::post('/point-packages/{pointPackage}/toggle-status', [PointPackageController::class, 'toggleStatus'])->name('point-packages.toggle-status');
});

// Company Admin only routes - require company_admin role specifically  
Route::middleware(['auth', 'verified', App\Http\Middleware\EnsureUserIsCompanyAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    
    // Job Listings Management - Only for company admin (CRUD operations)
    Route::get('/job-listings/create', [JobListingsController::class, 'create'])->name('job-listings.create');
    Route::post('/job-listings', [JobListingsController::class, 'store'])->name('job-listings.store');
    Route::get('/job-listings/{jobListing}/edit', [JobListingsController::class, 'edit'])->name('job-listings.edit');
    Route::put('/job-listings/{jobListing}', [JobListingsController::class, 'update'])->name('job-listings.update');
    Route::delete('/job-listings/{jobListing}', [JobListingsController::class, 'destroy'])->name('job-listings.destroy');
    Route::post('/job-listings/{jobListing}/toggle-status', [JobListingsController::class, 'toggleStatus'])->name('job-listings.toggle-status');

    // Applications Management - Only for company admin (update operations)
    Route::patch('/applications/{application}/status', [ApplicationManagementController::class, 'updateStatus'])->name('applications.update-status');
    Route::post('/applications/bulk-action', [ApplicationManagementController::class, 'bulkAction'])->name('applications.bulk-action');
});
