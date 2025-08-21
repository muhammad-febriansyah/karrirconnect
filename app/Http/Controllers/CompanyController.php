<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::where('is_active', true);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Location filter
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Industry filter
        if ($request->filled('industry')) {
            $query->where('industry', $request->industry);
        }

        // Size filter
        if ($request->filled('size')) {
            $query->where('size', $request->size);
        }

        // Add job counts
        $query->withCount([
            'jobListings as active_jobs_count' => function($q) {
                $q->where('status', 'published')
                  ->where(function($subQ) {
                      $subQ->whereNull('application_deadline')
                           ->orWhere('application_deadline', '>=', now());
                  });
            }
        ]);

        $companies = $query->orderBy('is_verified', 'desc')
                          ->orderBy('active_jobs_count', 'desc')
                          ->paginate(12)
                          ->withQueryString();

        // Featured companies (verified companies with most active jobs)
        $featuredCompanies = Company::where('is_active', true)
            ->where('is_verified', true)
            ->withCount([
                'jobListings as active_jobs_count' => function($q) {
                    $q->where('status', 'published')
                      ->where(function($subQ) {
                          $subQ->whereNull('application_deadline')
                               ->orWhere('application_deadline', '>=', now());
                      });
                }
            ])
            ->having('active_jobs_count', '>', 0)
            ->orderBy('active_jobs_count', 'desc')
            ->limit(9)
            ->get();

        // Get distinct industries
        $industries = Company::where('is_active', true)
            ->whereNotNull('industry')
            ->distinct()
            ->pluck('industry')
            ->sort()
            ->values();

        // Company sizes
        $companySizes = ['startup', 'small', 'medium', 'large', 'enterprise'];

        // Total companies count
        $totalCompanies = Company::where('is_active', true)->count();

        return Inertia::render('companies/index', [
            'companies' => $companies,
            'industries' => $industries,
            'companySizes' => $companySizes,
            'filters' => $request->only(['search', 'location', 'industry', 'size']),
            'totalCompanies' => $totalCompanies,
            'featuredCompanies' => $featuredCompanies
        ]);
    }

    public function show(Company $company)
    {
        $company->load(['jobListings' => function($query) {
            $query->where('status', 'published')
                  ->where(function($q) {
                      $q->whereNull('application_deadline')
                        ->orWhere('application_deadline', '>=', now());
                  })
                  ->with('category')
                  ->orderBy('created_at', 'desc');
        }]);

        return Inertia::render('companies/show', [
            'company' => $company
        ]);
    }
}