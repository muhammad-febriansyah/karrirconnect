<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(): Response
    {
        $user = auth()->user();
        $profile = $user->userProfile;
        
        return Inertia::render('user/profile/edit', [
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
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
        ]);

        // Update user basic info
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Update or create user profile
        $profileData = $request->only([
            'first_name', 'last_name', 'phone', 'bio', 'location',
            'current_position', 'portfolio_url', 'linkedin_url', 'github_url'
        ]);

        if ($user->userProfile) {
            $user->userProfile->update($profileData);
        } else {
            $user->userProfile()->create(array_merge($profileData, ['user_id' => $user->id]));
        }

        return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
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

        return redirect()->back()->with('success', 'Password berhasil diperbarui.');
    }
}