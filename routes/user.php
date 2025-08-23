<?php

use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\ProfileController;
use Illuminate\Support\Facades\Route;

// User routes - for regular users (role: 'user')
Route::middleware(['auth', 'verified', 'user.role'])->prefix('user')->name('user.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
});