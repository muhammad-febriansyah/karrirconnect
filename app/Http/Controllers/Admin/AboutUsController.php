<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutUs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutUsController extends Controller
{
    public function edit()
    {
        $aboutUs = AboutUs::first();

        if (!$aboutUs) {
            $aboutUs = AboutUs::create([
                'title' => 'KarirConnect',
                'description' => '',
                'vision' => '',
                'mission' => '',
                'values' => [],
                'features' => [],
                'stats' => [],
                'team' => [],
                'contact' => ['email' => [], 'phone' => [], 'address' => []],
                'cta_title' => '',
                'cta_description' => '',
                'is_active' => true,
            ]);
        }

        return Inertia::render('admin/about-us/edit', [
            'aboutUs' => $aboutUs,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'vision' => 'required|string',
            'mission' => 'required|string',
            'values' => 'nullable|array',
            'features' => 'nullable|array',
            'stats' => 'nullable|array',
            'team' => 'nullable|array',
            'contact' => 'nullable|array',
            'cta_title' => 'nullable|string|max:255',
            'cta_description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $aboutUs = AboutUs::first();

        if (!$aboutUs) {
            $aboutUs = new AboutUs();
        }

        $data = $request->except(['_token', '_method']);

        // Ensure arrays exist
        $data['values'] = $data['values'] ?? [];
        $data['features'] = $data['features'] ?? [];
        $data['stats'] = $data['stats'] ?? [];
        $data['team'] = $data['team'] ?? [];
        $data['contact'] = $data['contact'] ?? ['email' => [], 'phone' => [], 'address' => []];

        // Handle SVG uploads for values
        if (isset($data['values']) && is_array($data['values'])) {
            foreach ($data['values'] as $index => $value) {
                if ($request->hasFile("values.{$index}.icon")) {
                    $file = $request->file("values.{$index}.icon");
                    $filename = 'values_' . $index . '_' . time() . '.svg';
                    $path = $file->storeAs('about-us/icons', $filename, 'public');
                    $data['values'][$index]['icon'] = $path;
                } elseif (is_string($value['icon'] ?? null)) {
                    // Keep existing path if no new file uploaded
                    $data['values'][$index]['icon'] = $value['icon'];
                }
            }
        }

        // Stats icons are now handled as strings (Lucide icon names), no file upload needed

        // Handle image uploads for team members
        if (isset($data['team']) && is_array($data['team'])) {
            foreach ($data['team'] as $index => $member) {
                if ($request->hasFile("team.{$index}.image")) {
                    $file = $request->file("team.{$index}.image");
                    $extension = $file->getClientOriginalExtension();
                    $filename = 'team_' . $index . '_' . time() . '.' . $extension;
                    $path = $file->storeAs('about-us/team', $filename, 'public');
                    $data['team'][$index]['image'] = $path;
                } elseif (is_string($member['image'] ?? null)) {
                    // Keep existing path if no new file uploaded
                    $data['team'][$index]['image'] = $member['image'];
                }
            }
        }

        $aboutUs->update($data);

        return redirect()->route('admin.about-us.edit')
            ->with('success', 'Informasi tentang kami berhasil diperbarui.');
    }
}
