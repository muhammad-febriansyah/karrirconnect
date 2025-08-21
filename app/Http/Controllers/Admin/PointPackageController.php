<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\PointPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PointPackageController extends Controller
{
    public function index()
    {
        $packages = PointPackage::orderBy('price')->get()->map(function ($package) {
            return [
                'id' => $package->id,
                'name' => $package->name,
                'description' => $package->description,
                'points' => $package->points,
                'price' => $package->price,
                'bonus_points' => $package->bonus_points,
                'is_active' => $package->is_active,
                'is_featured' => $package->is_featured,
                'features' => $package->features,
                'total_points' => $package->total_points,
                'formatted_price' => $package->formatted_price,
                'created_at' => $package->created_at,
                'updated_at' => $package->updated_at,
            ];
        });

        return Inertia::render('admin/point-packages/index', [
            'packages' => $packages
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/point-packages/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'points' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'bonus_points' => 'integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'features' => 'array',
        ]);

        PointPackage::create($validated);

        return redirect()->route('admin.point-packages.index')
            ->with('success', 'Paket poin berhasil dibuat.');
    }

    public function show(PointPackage $pointPackage)
    {
        $pointPackage->load('pointTransactions.company');

        return Inertia::render('admin/point-packages/show', [
            'package' => $pointPackage
        ]);
    }

    public function edit(PointPackage $pointPackage)
    {
        return Inertia::render('admin/point-packages/edit', [
            'package' => $pointPackage
        ]);
    }

    public function update(Request $request, PointPackage $pointPackage)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'points' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'bonus_points' => 'integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'features' => 'array',
        ]);

        $pointPackage->update($validated);

        return redirect()->route('admin.point-packages.index')
            ->with('success', 'Paket poin berhasil diperbarui.');
    }

    public function destroy(PointPackage $pointPackage)
    {
        // Check if package has transactions
        if ($pointPackage->pointTransactions()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus paket yang sudah memiliki transaksi.');
        }

        $pointPackage->delete();

        return redirect()->route('admin.point-packages.index')
            ->with('success', 'Paket poin berhasil dihapus.');
    }

    public function toggleStatus(PointPackage $pointPackage)
    {
        $pointPackage->update(['is_active' => !$pointPackage->is_active]);

        $status = $pointPackage->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Paket poin berhasil {$status}.");
    }
}
