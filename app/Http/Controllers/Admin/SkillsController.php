<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SkillsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Skill::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $skills = $query->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/skills/index', [
            'skills' => $skills,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/skills/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:skills,name',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        Skill::create($validated);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Skill $skill)
    {
        // Load related job listings with this skill
        $skill->load(['jobListings' => function($query) {
            $query->with(['company', 'category'])
                  ->orderBy('created_at', 'desc')
                  ->limit(10);
        }]);

        // Get users with this skill
        $usersWithSkill = $skill->users()
            ->with('profile')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('admin/skills/show', [
            'skill' => $skill,
            'usersWithSkill' => $usersWithSkill,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Skill $skill)
    {
        return Inertia::render('admin/skills/edit', [
            'skill' => $skill,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:skills,name,' . $skill->id,
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $skill->update($validated);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skill $skill)
    {
        // Check if skill is being used in job listings or by users
        $jobListingsCount = $skill->jobListings()->count();
        $usersCount = $skill->users()->count();

        if ($jobListingsCount > 0 || $usersCount > 0) {
            return back()->withErrors([
                'error' => "Skill tidak dapat dihapus karena sedang digunakan oleh {$jobListingsCount} lowongan dan {$usersCount} pengguna."
            ]);
        }

        $skill->delete();

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill berhasil dihapus!');
    }
}
