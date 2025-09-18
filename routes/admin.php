<?php

use App\Http\Controllers\Admin\AboutUsController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdvancedUserManagementController;
use App\Http\Controllers\Admin\ApplicationManagementController;
use App\Http\Controllers\Admin\CompanyManagementController;
use App\Http\Controllers\Admin\JobListingsController;
use App\Http\Controllers\Admin\EmailManagementController;
use App\Http\Controllers\Admin\JobCategoryManagementController;
use App\Http\Controllers\NotificationController;
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
use App\Http\Controllers\Admin\WhatsAppTemplateController;
use App\Http\Controllers\Admin\WhatsAppBroadcastController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\WaGatewayController;
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
    
    // Company Verification Review (Super Admin Only)
    Route::get('/companies/verification/review', [CompanyManagementController::class, 'verificationIndex'])->name('companies.verification.index');
    Route::post('/companies/{company}/verification/update', [CompanyManagementController::class, 'updateVerificationStatus'])->name('companies.verification.update');

    // Job Categories Management
    Route::post('/job-categories/{jobCategory}/toggle-status', [JobCategoryManagementController::class, 'toggleStatus'])->name('job-categories.toggle-status');
    Route::resource('job-categories', JobCategoryManagementController::class);

    // Skills Management
    Route::resource('skills', SkillController::class);
    Route::post('/skills/{skill}/toggle-status', [SkillController::class, 'toggleStatus'])->name('skills.toggle-status');

    // Job Listings - Both super admin and company admin can access index & show
    Route::get('/job-listings', [JobListingsController::class, 'index'])->name('job-listings.index');
    
    // Job Listings Create/Store - Company admin can create (MUST be before {jobListing} route)
    Route::get('/job-listings/create', [JobListingsController::class, 'create'])->name('job-listings.create');
    Route::post('/job-listings', [JobListingsController::class, 'store'])->name('job-listings.store');
    
    Route::get('/job-listings/{jobListing}', [JobListingsController::class, 'show'])->name('job-listings.show');

    // Applications - Super admin read-only access (index & show only)
    Route::get('/applications', [ApplicationManagementController::class, 'index'])->name('applications.index');
    Route::get('/applications/{application}', [ApplicationManagementController::class, 'show'])->name('applications.show');
    Route::get('/applications/{application}/download/resume', [ApplicationManagementController::class, 'downloadResume'])->name('applications.download.resume');
    Route::get('/applications/{application}/download/document/{index}', [ApplicationManagementController::class, 'downloadDocument'])->name('applications.download.document');
    Route::patch('/applications/{application}/status', [ApplicationManagementController::class, 'updateStatus'])->name('applications.update-status');

    // Transaction History - Both super_admin and company_admin can access
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::get('/transactions/export/csv', [TransactionController::class, 'export'])->name('transactions.export');

    // Notifications - For both super admin and company admin
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::post('/notifications', [NotificationController::class, 'store'])->name('notifications.store');


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

    // WhatsApp Gateway Testing - For both super admin and company admin
    Route::post('/whatsapp/test-connection', [WaGatewayController::class, 'testConnection'])->name('whatsapp.test-connection');
    Route::post('/whatsapp/send-notification/{notification}', [WaGatewayController::class, 'sendNotificationWhatsApp'])->name('whatsapp.send-notification');
    Route::post('/whatsapp/send-to-user/{notification}/{user}', [WaGatewayController::class, 'sendNotificationToUser'])->name('whatsapp.send-to-user');
    Route::post('/whatsapp/send-with-template', [WaGatewayController::class, 'sendWithTemplate'])->name('whatsapp.send-with-template');

    // WhatsApp Templates Management - For both super admin and company admin
    Route::resource('whatsapp-templates', WhatsAppTemplateController::class)->names('whatsapp.templates')->parameters(['whatsapp-templates' => 'template']);
    Route::post('/whatsapp-templates/{template}/toggle-status', [WhatsAppTemplateController::class, 'toggleStatus'])->name('whatsapp.templates.toggle-status');
    Route::post('/whatsapp-templates/{template}/preview', [WhatsAppTemplateController::class, 'preview'])->name('whatsapp.templates.preview');
    Route::post('/whatsapp-templates/{template}/test-send', [WhatsAppTemplateController::class, 'testSend'])->name('whatsapp.templates.test-send');

    // WhatsApp Broadcast Management - For both super admin and company admin
    Route::get('/whatsapp-broadcast', [WhatsAppBroadcastController::class, 'index'])->name('whatsapp.broadcast.index');
    Route::post('/whatsapp-broadcast/users-preview', [WhatsAppBroadcastController::class, 'getUsersPreview'])->name('whatsapp.broadcast.users-preview');
    Route::post('/whatsapp-broadcast/send', [WhatsAppBroadcastController::class, 'sendBroadcast'])->name('whatsapp.broadcast.send');
    Route::get('/whatsapp-broadcast/history', [WhatsAppBroadcastController::class, 'getBroadcastHistory'])->name('whatsapp.broadcast.history');
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
    
    // Notification statistics (super admin only)
    Route::get('/notifications/statistics', [NotificationController::class, 'getStatistics'])->name('notifications.statistics');
});

// Company Admin only routes - require company_admin role specifically  
Route::middleware(['auth', 'verified', 'company.admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Company Verification - Only for company admin
    Route::get('/company/verify', [CompanyManagementController::class, 'showVerificationForm'])->name('company.verify');
    Route::post('/company/verify', [CompanyManagementController::class, 'submitVerification'])->name('company.verify.submit');
    
    // Job Listings Management - Only for company admin (edit, update, delete, toggle operations)
    Route::get('/job-listings/{jobListing}/edit', [JobListingsController::class, 'edit'])->name('job-listings.edit');
    Route::put('/job-listings/{jobListing}', [JobListingsController::class, 'update'])->name('job-listings.update');
    Route::delete('/job-listings/{jobListing}', [JobListingsController::class, 'destroy'])->name('job-listings.destroy');
    Route::post('/job-listings/{jobListing}/toggle-status', [JobListingsController::class, 'toggleStatus'])->name('job-listings.toggle-status');

    // Applications Management - Only for company admin (update operations)
    Route::post('/applications/bulk-action', [ApplicationManagementController::class, 'bulkAction'])->name('applications.bulk-action');
});
