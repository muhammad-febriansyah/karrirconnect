<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CompanyManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::withCount(['jobListings', 'users'])
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->verification_status, function ($q, $verified) {
                if ($verified === 'verified') {
                    $q->where('is_verified', true);
                } elseif ($verified === 'unverified') {
                    $q->where('is_verified', false);
                }
            })
            ->when($request->status, function ($q, $status) {
                $q->where('is_active', $status === 'active');
            });

        $perPage = $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 15, 25, 50]) ? $perPage : 10;
        
        $companies = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('admin/companies/index', [
            'companies' => $companies,
            'filters' => $request->only(['search', 'verification_status', 'status'])
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/companies/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'industry' => 'nullable|string|max:255',
            'company_size' => 'nullable|in:startup,small,medium,large,enterprise',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
        ]);

        Company::create($request->all());

        return redirect()->route('admin.companies.index')
            ->with('success', 'Perusahaan berhasil dibuat.');
    }

    public function show(Company $company)
    {
        $company->load(['users', 'jobListings']);

        return Inertia::render('admin/companies/show', [
            'company' => $company,
        ]);
    }

    public function edit(Company $company)
    {
        return Inertia::render('admin/companies/edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'industry' => 'nullable|string|max:255',
            'company_size' => 'nullable|in:startup,small,medium,large,enterprise',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $company->update($request->all());

        return redirect()->route('admin.companies.index')
            ->with('success', 'Perusahaan berhasil diperbarui.');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('admin.companies.index')
            ->with('success', 'Perusahaan berhasil dihapus.');
    }

    public function toggleVerification(Company $company)
    {
        $company->update(['is_verified' => !$company->is_verified]);

        return back()->with('success', $company->is_verified ? 'Perusahaan berhasil diverifikasi.' : 'Verifikasi perusahaan berhasil dibatalkan.');
    }

    public function toggleStatus(Company $company)
    {
        $company->update(['is_active' => !$company->is_active]);

        return back()->with('success', $company->is_active ? 'Perusahaan berhasil diaktifkan.' : 'Perusahaan berhasil dinonaktifkan.');
    }
}
