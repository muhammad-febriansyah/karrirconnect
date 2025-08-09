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
        $validated = $request->validated();
        $user = $request->user();

        // Update user basic info
        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Handle profile data
        $profileData = collect($validated)->except(['name', 'email'])->filter()->all();

        // Handle file uploads
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->profile && $user->profile->avatar) {
                Storage::disk('public')->delete($user->profile->avatar);
            }
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $profileData['avatar'] = $avatarPath;
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
        if ($user->profile) {
            $user->profile->update($profileData);
        } else {
            $user->profile()->create(array_merge($profileData, ['user_id' => $user->id]));
        }

        return to_route('profile.edit')->with('status', 'profile-updated');
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
