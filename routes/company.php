<?php

use App\Http\Controllers\Company\PointController;
use App\Http\Controllers\JobInvitationMessageController;
use Illuminate\Support\Facades\Route;

// Company routes for point management
Route::middleware(['auth', 'verified', 'company.admin'])->prefix('company')->name('company.')->group(function () {
    
    // Point management for company admin
    Route::prefix('points')->name('points.')->group(function () {
        Route::get('/', [PointController::class, 'index'])->name('index');
        Route::get('/packages', [PointController::class, 'packages'])->name('packages');
        Route::post('/purchase', [PointController::class, 'purchase'])->name('purchase');
        Route::get('/payment/finish', [PointController::class, 'paymentFinish'])->name('payment.finish');
    });

    // Job management for company admin
    Route::prefix('jobs')->name('jobs.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Company\JobController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Company\JobController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Company\JobController::class, 'store'])->name('store');
        Route::get('/{job}', [\App\Http\Controllers\Company\JobController::class, 'show'])->name('show');
        Route::get('/{job}/edit', [\App\Http\Controllers\Company\JobController::class, 'edit'])->name('edit');
        Route::put('/{job}', [\App\Http\Controllers\Company\JobController::class, 'update'])->name('update');
        Route::delete('/{job}', [\App\Http\Controllers\Company\JobController::class, 'destroy'])->name('destroy');
        Route::post('/{job}/toggle-status', [\App\Http\Controllers\Company\JobController::class, 'toggleStatus'])->name('toggle-status');
        
        // API routes for job posting
        Route::get('/api/point-packages', [\App\Http\Controllers\Company\JobController::class, 'getPointPackages'])->name('api.point-packages');
        Route::get('/api/check-eligibility', [\App\Http\Controllers\Company\JobController::class, 'checkPostingEligibility'])->name('api.check-eligibility');
    });

    // Talent database and job invitations
    Route::get('/talent-database', [\App\Http\Controllers\Company\JobInvitationController::class, 'talentDatabase'])->name('talent-database');
    Route::get('/talent-database/{user}', [\App\Http\Controllers\Company\JobInvitationController::class, 'showTalentProfile'])->name('talent-database.show');

    Route::prefix('job-invitations')->name('job-invitations.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Company\JobInvitationController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\Company\JobInvitationController::class, 'store'])->name('store');

        // Job invitation messages
        Route::get('/{jobInvitation}/messages', [JobInvitationMessageController::class, 'index'])->name('messages.index');
        Route::post('/{jobInvitation}/messages', [JobInvitationMessageController::class, 'store'])->name('messages.store');
        Route::get('/messages/{message}/attachments/{attachmentIndex}', [JobInvitationMessageController::class, 'downloadAttachment'])->name('messages.download');
    });

    // Company profile management
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/edit', [\App\Http\Controllers\Company\CompanyProfileController::class, 'edit'])->name('edit');
        Route::put('/update', [\App\Http\Controllers\Company\CompanyProfileController::class, 'update'])->name('update');
    });

    // Company applications - redirect to admin for now
    Route::get('/applications', function() {
        return redirect('/admin/applications');
    })->name('applications');
});

