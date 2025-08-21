<?php

use App\Http\Controllers\Company\PointController;
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
    });
});

// Webhook route for Midtrans (no authentication needed)
Route::post('/webhook/midtrans', [PointController::class, 'webhook'])->name('webhook.midtrans');