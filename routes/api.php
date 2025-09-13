<?php

use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JobCategoryController;
use App\Http\Controllers\Api\JobListingController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Company\PointController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Webhook routes (no authentication needed)  
Route::post('webhook/midtrans', [PointController::class, 'webhook'])->name('api.webhook.midtrans');
Route::post('webhook/midtrans/', [PointController::class, 'webhook'])->name('api.webhook.midtrans.slash'); // Handle trailing slash

// Public API routes
Route::group(['prefix' => 'v1'], function () {
    // Job Listings - Public endpoints
    Route::get('jobs', [JobListingController::class, 'index']);
    Route::get('jobs/{jobListing}', [JobListingController::class, 'show']);
    
    // Job Categories
    Route::get('job-categories', [JobCategoryController::class, 'index']);
    Route::get('job-categories/{jobCategory}', [JobCategoryController::class, 'show']);
    
    // Skills
    Route::get('skills', [SkillController::class, 'index']);
    Route::get('skills/{skill}', [SkillController::class, 'show']);
    
    // Companies - Public endpoints
    Route::get('companies', [CompanyController::class, 'index'])->name('api.companies.index');
    Route::get('companies/{company}', [CompanyController::class, 'show'])->name('api.companies.show');
    Route::get('companies/{company}/jobs', [CompanyController::class, 'jobs'])->name('api.companies.jobs');
    
    // Protected routes requiring authentication
    Route::middleware('auth:sanctum')->group(function () {
        // Job Applications
        Route::post('jobs/{jobListing}/apply', [JobListingController::class, 'apply']);
        Route::post('jobs/{jobListing}/save', [JobListingController::class, 'toggleSave']);
        Route::apiResource('applications', JobApplicationController::class)->except(['store']);
        
        // User's saved jobs and applications
        Route::get('my/saved-jobs', function (Request $request) {
            return $request->user()->savedJobs()->with(['company', 'category'])->paginate(15);
        });
        
        Route::get('my/applications', function (Request $request) {
            return $request->user()->jobApplications()
                ->with(['jobListing.company', 'jobListing.category'])
                ->paginate(15);
        });
        
        // Company admin routes
        Route::middleware('can:manage-company')->group(function () {
            Route::apiResource('jobs', JobListingController::class)->except(['index', 'show']);
            Route::get('company/applications', [JobApplicationController::class, 'companyApplications']);
            Route::patch('applications/{jobApplication}/status', [JobApplicationController::class, 'updateStatus']);
        });
        
        // Admin routes
        Route::middleware('can:access-admin')->group(function () {
            Route::apiResource('admin/companies', CompanyController::class);
            Route::apiResource('admin/job-categories', JobCategoryController::class);
            Route::apiResource('admin/skills', SkillController::class);
            Route::patch('admin/companies/{company}/verify', [CompanyController::class, 'toggleVerification']);
            Route::patch('admin/jobs/{jobListing}/feature', [JobListingController::class, 'toggleFeatured']);
        });
    });
});