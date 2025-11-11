<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SuccessStory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SuccessStoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 6);
        $perPage = max(3, min(12, $perPage));

        $storiesQuery = SuccessStory::query()->where('is_active', true);

        $successStories = (clone $storiesQuery)
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString()
            ->through(function (SuccessStory $story) {
                return [
                    'id' => $story->id,
                    'name' => $story->name,
                    'position' => $story->position,
                    'company' => $story->company,
                    'story' => $story->story,
                    'location' => $story->location,
                    'experience_years' => $story->experience_years,
                    'salary_increase_percentage' => $story->salary_increase_percentage,
                    'avatar_url' => $story->avatar_url,
                    'created_at' => $story->created_at?->toIso8601String(),
                ];
            });

        $stats = [
            'total_submissions' => SuccessStory::count(),
            'published_stories' => (clone $storiesQuery)->count(),
            'featured_stories' => (clone $storiesQuery)->where('is_featured', true)->count(),
        ];

        return Inertia::render('user/success-story/index', [
            'successStories' => $successStories,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('user/success-story/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'story' => 'required|string|max:100',
            'location' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'salary_before' => 'nullable|numeric|min:0',
            'salary_after' => 'nullable|numeric|min:0',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('success-stories', 'public');
        }

        // Success stories need admin approval before being displayed
        $validated['is_active'] = false;
        $validated['is_featured'] = false;
        $validated['sort_order'] = 999;

        SuccessStory::create($validated);

        $user = $request->user();
        $message = 'Kisah sukses Anda berhasil dikirim! Tim kami akan meninjau dan menerbitkannya segera.';

        // Redirect based on role: user -> user dashboard, admin -> admin dashboard
        if ($user && method_exists($user, 'isAdmin') && $user->isAdmin()) {
            return redirect()->route('admin.dashboard')->with('success', $message);
        }

        return redirect()->route('user.dashboard')->with('success', $message);
    }

    public function show(SuccessStory $successStory)
    {
        return Inertia::render('user/success-story/show', [
            'successStory' => $successStory
        ]);
    }
}
