<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Show the form for editing the settings.
     */
    public function edit()
    {
        $setting = Setting::first() ?? new Setting();

        return Inertia::render('admin/settings/edit', [
            'setting' => $setting
        ]);
    }

    /**
     * Update the settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'nullable|string|max:255',
            'keyword' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'x' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'ig' => 'nullable|string|max:255',
            'fb' => 'nullable|string|max:255',
            'tiktok' => 'nullable|string|max:255',
            'fee' => 'nullable|integer|min:0',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'favicon' => 'nullable|image|mimes:ico,png,jpg,jpeg|max:1024',
            'hero_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:6144',
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string|max:500',
            'use_custom_stats' => 'boolean',
            'custom_total_jobs' => 'nullable|integer|min:0',
            'custom_total_companies' => 'nullable|integer|min:0',
            'custom_total_candidates' => 'nullable|integer|min:0',
        ]);

        $setting = Setting::first();

        if (!$setting) {
            $setting = Setting::create($validated);
        } else {
            // Remove file fields from validated data to prevent overwriting existing files
            unset($validated['logo']);
            unset($validated['thumbnail']);
            unset($validated['favicon']);
            unset($validated['hero_image']);

            // Handle logo upload if present
            if ($request->hasFile('logo')) {
                // Delete old logo if exists
                if ($setting->logo && Storage::disk('public')->exists($setting->logo)) {
                    Storage::disk('public')->delete($setting->logo);
                }

                // Store new logo
                $logoPath = $request->file('logo')->store('settings', 'public');
                $validated['logo'] = $logoPath;
            }

            // Handle thumbnail upload if present
            if ($request->hasFile('thumbnail')) {
                // Delete old thumbnail if exists
                if ($setting->thumbnail && Storage::disk('public')->exists($setting->thumbnail)) {
                    Storage::disk('public')->delete($setting->thumbnail);
                }

                // Store new thumbnail
                $thumbnailPath = $request->file('thumbnail')->store('settings', 'public');
                $validated['thumbnail'] = $thumbnailPath;
            }

            // Handle favicon upload if present
            if ($request->hasFile('favicon')) {
                // Delete old favicon if exists
                if ($setting->favicon && Storage::disk('public')->exists($setting->favicon)) {
                    Storage::disk('public')->delete($setting->favicon);
                }

                // Store new favicon
                $faviconPath = $request->file('favicon')->store('settings', 'public');
                $validated['favicon'] = $faviconPath;
            }

            // Handle hero_image upload if present
            if ($request->hasFile('hero_image')) {
                // Delete old hero_image if exists
                if ($setting->hero_image && Storage::disk('public')->exists($setting->hero_image)) {
                    Storage::disk('public')->delete($setting->hero_image);
                }

                // Store new hero_image
                $heroImagePath = $request->file('hero_image')->store('settings/hero', 'public');
                $validated['hero_image'] = $heroImagePath;
            }

            $setting->update($validated);
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
