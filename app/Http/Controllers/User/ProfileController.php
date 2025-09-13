<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(): Response
    {
        $user = auth()->user();
        $profile = $user->userProfile;
        $userSkills = $user->skills()->get();
        $allSkills = Skill::where('is_active', true)->get();
        
        return Inertia::render('user/profile/edit', [
            'user' => $user,
            'profile' => $profile,
            'userSkills' => $userSkills,
            'allSkills' => $allSkills,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        try {
            $user = auth()->user();
            
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'bio' => 'nullable|string|max:1000',
                'location' => 'nullable|string|max:255',
                'current_position' => 'nullable|string|max:255',
                'portfolio_url' => 'nullable|url|max:255',
                'linkedin_url' => 'nullable|url|max:255',
                'github_url' => 'nullable|url|max:255',
                'expected_salary_min' => 'nullable|numeric|min:0',
                'expected_salary_max' => 'nullable|numeric|min:0',
                'salary_currency' => 'nullable|string|max:3',
                'open_to_work' => 'boolean',
                'experience' => 'nullable|array',
                'experience.*.company' => 'required_with:experience.*|string|max:255',
                'experience.*.position' => 'required_with:experience.*|string|max:255',
                'experience.*.start_date' => 'required_with:experience.*|date',
                'experience.*.end_date' => 'nullable|date|after:experience.*.start_date',
                'experience.*.is_current' => 'boolean',
                'experience.*.description' => 'nullable|string',
                'education' => 'nullable|array',
                'education.*.institution' => 'required_with:education.*|string|max:255',
                'education.*.degree' => 'required_with:education.*|string|max:255',
                'education.*.field_of_study' => 'required_with:education.*|string|max:255',
                'education.*.start_date' => 'required_with:education.*|date',
                'education.*.end_date' => 'nullable|date|after:education.*.start_date',
                'education.*.is_current' => 'boolean',
                'education.*.description' => 'nullable|string',
                'skills' => 'nullable|array',
                'skills.*.skill_id' => 'required_with:skills.*|exists:skills,id',
                'skills.*.proficiency_level' => 'required_with:skills.*|in:Beginner,Intermediate,Advanced,Expert',
                'skills.*.years_of_experience' => 'required_with:skills.*|integer|min:0',
                'avatar' => 'nullable|file|image|max:2048',
                'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Profile update validation failed', [
                'user_id' => auth()->id(),
                'errors' => $e->errors(),
                'input' => $request->except(['avatar', 'resume'])
            ]);
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Profile update validation exception', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->withErrors(['general' => 'Terjadi kesalahan saat validasi data.']);
        }

        try {
            // Update user basic info
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            // Handle file uploads
            $profileData = $request->only([
                'first_name', 'last_name', 'phone', 'bio', 'location',
                'current_position', 'portfolio_url', 'linkedin_url', 'github_url',
                'expected_salary_min', 'expected_salary_max', 'salary_currency', 'open_to_work',
                'experience', 'education'
            ]);

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                try {
                    // Delete old avatar if exists
                    if ($user->userProfile && $user->userProfile->avatar) {
                        Storage::disk('public')->delete($user->userProfile->avatar);
                    }
                    $profileData['avatar'] = $request->file('avatar')->store('avatars', 'public');
                } catch (\Exception $e) {
                    \Log::error('Avatar upload failed', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage()
                    ]);
                    return redirect()->back()->withErrors(['avatar' => 'Gagal mengupload foto profil.']);
                }
            }

            // Handle resume upload
            if ($request->hasFile('resume')) {
                try {
                    // Delete old resume if exists
                    if ($user->userProfile && $user->userProfile->resume) {
                        Storage::disk('public')->delete($user->userProfile->resume);
                    }
                    $profileData['resume'] = $request->file('resume')->store('resumes', 'public');
                } catch (\Exception $e) {
                    \Log::error('Resume upload failed', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage()
                    ]);
                    return redirect()->back()->withErrors(['resume' => 'Gagal mengupload CV/Resume.']);
                }
            }

            // Update or create user profile
            if ($user->userProfile) {
                $user->userProfile->update($profileData);
            } else {
                $user->userProfile()->create(array_merge($profileData, ['user_id' => $user->id]));
            }

            // Handle skills
            if ($request->has('skills') && is_array($request->skills)) {
                $skillsData = [];
                foreach ($request->skills as $skill) {
                    if (isset($skill['skill_id'], $skill['proficiency_level'], $skill['years_of_experience'])) {
                        $skillsData[$skill['skill_id']] = [
                            'proficiency_level' => $skill['proficiency_level'],
                            'years_of_experience' => $skill['years_of_experience']
                        ];
                    }
                }
                $user->skills()->sync($skillsData);
            }

            \Log::info('Profile updated successfully', ['user_id' => $user->id]);
            return redirect()->back();
            
        } catch (\Exception $e) {
            \Log::error('Profile update failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->withErrors(['general' => 'Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.']);
        }
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return redirect()->back()->withErrors(['current_password' => 'Password saat ini tidak sesuai.']);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back();
    }
}