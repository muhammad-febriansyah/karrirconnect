<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SuccessStory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuccessStoryAdminController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status'); // pending|active|all

        $query = SuccessStory::query()
            ->when($status === 'pending', fn($q) => $q->where('is_active', false))
            ->when($status === 'active', fn($q) => $q->where('is_active', true))
            ->latest();

        $stories = $query->paginate(10)->withQueryString();

        $counts = [
            'all' => SuccessStory::count(),
            'pending' => SuccessStory::where('is_active', false)->count(),
            'active' => SuccessStory::where('is_active', true)->count(),
        ];

        return Inertia::render('admin/success-stories/index', [
            'stories' => $stories,
            'counts' => $counts,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function toggleStatus(SuccessStory $successStory)
    {
        $successStory->is_active = !$successStory->is_active;
        $successStory->save();

        return back()->with('success', 'Status kisah sukses diperbarui.');
    }

    public function toggleFeatured(SuccessStory $successStory)
    {
        $successStory->is_featured = !$successStory->is_featured;
        $successStory->save();

        return back()->with('success', 'Status featured diperbarui.');
    }

    public function show(SuccessStory $successStory)
    {
        // Provide additional computed fields
        $story = array_merge($successStory->toArray(), [
            'avatar_url' => $successStory->avatar_url,
            'salary_increase_percentage' => $successStory->salary_increase_percentage,
        ]);

        return Inertia::render('admin/success-stories/show', [
            'successStory' => $story,
        ]);
    }
}
