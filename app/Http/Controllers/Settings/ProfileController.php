<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->load('profile');

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'user' => $user,
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            \Log::info('Profile update request data:', $request->all());
            $validated = $request->validated();
            \Log::info('Profile update validated data:', $validated);
            $user = $request->user();

            // Update user basic info only if provided
            if (!empty($validated['name'])) {
                $user->name = $validated['name'];
            }

            if (!empty($validated['email'])) {
                if ($user->email !== $validated['email']) {
                    $user->email = $validated['email'];
                    $user->email_verified_at = null;
                }
            }

            $user->save();

        // Handle profile data
        $profileData = collect($validated)->except(['name', 'email'])->filter()->all();

        // Handle file uploads
        if ($request->hasFile('avatar')) {
            \Log::info('Avatar file received for upload', [
                'user_id' => $user->id,
                'file_name' => $request->file('avatar')->getClientOriginalName(),
                'file_size' => $request->file('avatar')->getSize()
            ]);

            // Delete old avatar if exists
            if ($user->profile && $user->profile->avatar) {
                \Log::info('Deleting old avatar: ' . $user->profile->avatar);
                Storage::disk('public')->delete($user->profile->avatar);
            }

            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $profileData['avatar'] = $avatarPath;

            \Log::info('Avatar uploaded successfully', [
                'user_id' => $user->id,
                'avatar_path' => $avatarPath
            ]);
        }

        if ($request->hasFile('resume')) {
            // Delete old resume if exists
            if ($user->profile && $user->profile->resume) {
                Storage::disk('public')->delete($user->profile->resume);
            }
            $resumePath = $request->file('resume')->store('resumes', 'public');
            $profileData['resume'] = $resumePath;
        }

        // Create or update profile
        \Log::info('Updating profile data', [
            'user_id' => $user->id,
            'profile_data' => $profileData,
            'has_profile' => !!$user->profile
        ]);

        if ($user->profile) {
            $user->profile->update($profileData);
            \Log::info('Profile updated successfully', [
                'user_id' => $user->id,
                'profile_id' => $user->profile->id
            ]);
        } else {
            $profile = $user->profile()->create(array_merge($profileData, ['user_id' => $user->id]));
            \Log::info('Profile created successfully', [
                'user_id' => $user->id,
                'profile_id' => $profile->id
            ]);
        }

            return to_route('profile.edit')->with('status', 'profile-updated');
        } catch (\Exception $e) {
            \Log::error('Profile update error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id,
                'exception' => $e,
                'validated_data' => $validated ?? null
            ]);

            return back()->withErrors([
                'general' => 'Terjadi kesalahan saat menyimpan profil: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
