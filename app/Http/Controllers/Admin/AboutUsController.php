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
            'values' => 'required|array',
            'features' => 'required|array',
            'stats' => 'required|array',
            'team' => 'required|array',
            'contact' => 'required|array',
            'cta_title' => 'nullable|string|max:255',
            'cta_description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $aboutUs = AboutUs::first();

        if (!$aboutUs) {
            $aboutUs = new AboutUs();
        }

        $aboutUs->update($request->all());

        return redirect()->route('admin.about-us.edit')
            ->with('success', 'Informasi tentang kami berhasil diperbarui.');
    }
}
