<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    public function index(): Response
    {
        $skills = Skill::query()
            ->withCount('users')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%");
            })
            ->when(request('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->when(request('status'), function ($query, $status) {
                $query->where('is_active', $status === 'active' ? true : false);
            })
            ->orderBy('category')
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/skills/index', [
            'skills' => $skills,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/skills/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:skills',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        try {
            Skill::create([
                'name' => $request->name,
                'category' => 'General', // Default category
                'description' => $request->description,
                'is_active' => $request->boolean('is_active', true),
            ]);

            return redirect()->route('admin.skills.index')
                ->with('success', 'Skill berhasil ditambahkan!');
        } catch (\Exception $e) {
            \Log::error('Failed to create skill', [
                'error' => $e->getMessage(),
                'input' => $request->all()
            ]);
            
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal menambahkan skill. Silakan coba lagi.']);
        }
    }

    public function show(Skill $skill): Response
    {
        $skill->load('users');

        return Inertia::render('admin/skills/show', [
            'skill' => $skill,
        ]);
    }

    public function edit(Skill $skill): Response
    {
        return Inertia::render('admin/skills/edit', [
            'skill' => $skill,
        ]);
    }

    public function update(Request $request, Skill $skill): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:skills,name,' . $skill->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        try {
            $skill->update([
                'name' => $request->name,
                'description' => $request->description,
                'is_active' => $request->boolean('is_active'),
            ]);

            return redirect()->route('admin.skills.index')
                ->with('success', 'Skill berhasil diperbarui!');
        } catch (\Exception $e) {
            \Log::error('Failed to update skill', [
                'skill_id' => $skill->id,
                'error' => $e->getMessage(),
                'input' => $request->all()
            ]);
            
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal memperbarui skill. Silakan coba lagi.']);
        }
    }

    public function destroy(Skill $skill): RedirectResponse
    {
        try {
            // Check if skill is being used by users
            $usageCount = $skill->users()->count();
            
            if ($usageCount > 0) {
                return redirect()->back()
                    ->withErrors(['error' => "Skill ini tidak dapat dihapus karena sedang digunakan oleh {$usageCount} pengguna. Nonaktifkan skill ini sebagai gantinya."]);
            }

            $skill->delete();

            return redirect()->route('admin.skills.index')
                ->with('success', 'Skill berhasil dihapus!');
        } catch (\Exception $e) {
            \Log::error('Failed to delete skill', [
                'skill_id' => $skill->id,
                'error' => $e->getMessage()
            ]);
            
            return redirect()->back()
                ->withErrors(['error' => 'Gagal menghapus skill. Silakan coba lagi.']);
        }
    }

    public function toggleStatus(Skill $skill): RedirectResponse
    {
        try {
            $skill->update([
                'is_active' => !$skill->is_active
            ]);

            $status = $skill->is_active ? 'diaktifkan' : 'dinonaktifkan';
            
            return redirect()->back()
                ->with('success', "Skill berhasil {$status}!");
        } catch (\Exception $e) {
            \Log::error('Failed to toggle skill status', [
                'skill_id' => $skill->id,
                'error' => $e->getMessage()
            ]);
            
            return redirect()->back()
                ->withErrors(['error' => 'Gagal mengubah status skill. Silakan coba lagi.']);
        }
    }
}