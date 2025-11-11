<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyProfileController extends Controller
{
    public function edit()
    {
        $company = Auth::user()->company;

        if (!$company) {
            return redirect()->route('company.dashboard')
                ->with('error', 'Company profile not found.');
        }

        // Transform logo to full asset URL for display
        if ($company->logo) {
            $company->logo_url = asset('storage/' . $company->logo);
        }

        return Inertia::render('company/profile/edit', [
            'company' => $company
        ]);
    }

    public function update(Request $request)
    {
        $company = Auth::user()->company;

        if (!$company) {
            return redirect()->route('company.dashboard')
                ->with('error', 'Company profile not found.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'industry' => 'nullable|string|max:255',
            'size' => 'nullable|in:startup,small,medium,large,enterprise',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'founded_year' => 'nullable|integer|min:1800|max:' . date('Y'),
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($company->logo && Storage::exists('public/' . $company->logo)) {
                Storage::delete('public/' . $company->logo);
            }

            // Store new logo
            $logoPath = $request->file('logo')->store('company-logos', 'public');
            $validated['logo'] = $logoPath;
        }

        // Update company profile
        $company->update($validated);

        return redirect()->route('company.profile.edit')
            ->with('success', 'Profil perusahaan berhasil diperbarui!');
    }
}