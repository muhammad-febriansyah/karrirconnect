<?php

use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\JobInvitationController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\JobInvitationMessageController;
use Illuminate\Support\Facades\Route;

// User routes - for regular users (role: 'user')
Route::middleware(['auth', 'verified', 'user.role'])->prefix('user')->name('user.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update.patch');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    
    // Saved Jobs
    Route::get('/saved-jobs', [DashboardController::class, 'savedJobs'])->name('saved-jobs');

    // User Applications
    Route::get('/applications', [DashboardController::class, 'applications'])->name('applications');

    // Job invitations
    Route::get('/job-invitations', [JobInvitationController::class, 'index'])->name('job-invitations.index');
    Route::patch('/job-invitations/{jobInvitation}', [JobInvitationController::class, 'update'])->name('job-invitations.update');

    // Job invitation messages
    Route::get('/job-invitations/{jobInvitation}/messages', [JobInvitationMessageController::class, 'index'])->name('job-invitations.messages.index');
    Route::post('/job-invitations/{jobInvitation}/messages', [JobInvitationMessageController::class, 'store'])->name('job-invitations.messages.store');
    Route::get('/job-invitations/messages/{message}/attachments/{attachmentIndex}', [JobInvitationMessageController::class, 'downloadAttachment'])->name('job-invitations.messages.download');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::get('/notifications/count', [NotificationController::class, 'getUnreadCount'])->name('notifications.count');

    // Success Story routes
    Route::prefix('success-stories')->name('success-stories.')->group(function () {
        Route::get('/', [\App\Http\Controllers\User\SuccessStoryController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\User\SuccessStoryController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\User\SuccessStoryController::class, 'store'])->name('store');
        Route::get('/{successStory}', [\App\Http\Controllers\User\SuccessStoryController::class, 'show'])->name('show');
    });
});
