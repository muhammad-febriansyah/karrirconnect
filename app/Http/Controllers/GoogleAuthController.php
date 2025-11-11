<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        try {
            return Socialite::driver('google')->redirect();
        } catch (Exception $e) {
            Log::error('Google OAuth redirect error: ' . $e->getMessage());
            return redirect()->route('home')->with('error', 'Google login is not available at the moment.');
        }
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user already exists by Google ID
            $user = User::findByGoogleId($googleUser->getId());
            
            if ($user) {
                // Check if user role is allowed to use Google login (only regular users)
                if ($user->role !== 'user') {
                    Log::warning('Non-user role attempted Google login: ' . $user->email . ' (role: ' . $user->role . ')');

                    return redirect()->route('login')->with('error', 'Login dengan Google hanya tersedia untuk pengguna reguler. Admin dan perusahaan silakan gunakan login email.');
                }

                // User exists, update their info and login
                $user->update([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'avatar' => $googleUser->getAvatar(),
                    'last_login_at' => now(),
                ]);

                Auth::login($user, true);

                Log::info('Google user logged in: ' . $user->email);

                return $this->redirectAfterLogin($user);

            } else {
                // Check if user exists with same email but different provider
                $existingUser = User::where('email', $googleUser->getEmail())->first();

                if ($existingUser) {
                    // Check if existing user role is allowed to use Google login (only regular users)
                    if ($existingUser->role !== 'user') {
                        Log::warning('Non-user role attempted Google login: ' . $existingUser->email . ' (role: ' . $existingUser->role . ')');

                        return redirect()->route('login')->with('error', 'Login dengan Google hanya tersedia untuk pengguna reguler. Admin dan perusahaan silakan gunakan login email.');
                    }

                    // Link Google account to existing user
                    $existingUser->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar() ?: $existingUser->avatar,
                        'auth_provider' => 'google', // Update provider
                        'google_created_at' => now(),
                        'last_login_at' => now(),
                    ]);

                    Auth::login($existingUser, true);

                    Log::info('Existing user linked with Google: ' . $existingUser->email);

                    return $this->redirectAfterLogin($existingUser);

                } else {
                    // Create new user from Google (always as regular user)
                    $user = User::createFromGoogle($googleUser);

                    // Create notification for admins about new user
                    try {
                        Notification::createUserRegistration($user);
                    } catch (Exception $e) {
                        Log::warning('Failed to create user registration notification: ' . $e->getMessage());
                    }

                    Auth::login($user, true);

                    Log::info('New Google user created: ' . $user->email);

                    return $this->redirectAfterLogin($user, true);
                }
            }
            
        } catch (Exception $e) {
            Log::error('Google OAuth callback error: ' . $e->getMessage());
            
            return redirect()->route('home')->with('error', 'Unable to login with Google. Please try again or use email login.');
        }
    }

    /**
     * Redirect user after successful login based on their role
     * Note: Google login is only for regular users, so this will always redirect to user dashboard
     */
    private function redirectAfterLogin(User $user, bool $isNewUser = false): \Illuminate\Http\RedirectResponse
    {
        // Since Google login is only for regular users, always redirect to user dashboard
        // Remove flash message to avoid repeated toast notifications
        return redirect()->intended('/user/dashboard');
    }

    /**
     * Get Google OAuth URL (for AJAX requests)
     */
    public function getGoogleAuthUrl()
    {
        try {
            $url = Socialite::driver('google')->redirect()->getTargetUrl();
            
            return response()->json([
                'success' => true,
                'url' => $url
            ]);
        } catch (Exception $e) {
            Log::error('Google OAuth URL generation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Google login is not available at the moment.'
            ], 500);
        }
    }
}
