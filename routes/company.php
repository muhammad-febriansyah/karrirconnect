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
});

// Webhook route for Midtrans (no authentication needed)
Route::post('/webhook/midtrans', [PointController::class, 'webhook'])->name('webhook.midtrans');