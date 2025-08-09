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
            'yt' => 'nullable|string|max:255',
            'ig' => 'nullable|string|max:255',
            'fb' => 'nullable|string|max:255',
            'tiktok' => 'nullable|string|max:255',
            'fee' => 'nullable|integer|min:0',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $setting = Setting::first();

        if (!$setting) {
            $setting = Setting::create($validated);
        } else {
            // Remove file fields from validated data to prevent overwriting existing files
            unset($validated['logo']);
            unset($validated['thumbnail']);

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

            $setting->update($validated);
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
