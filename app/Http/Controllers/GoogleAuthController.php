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
                    // Create new user from Google
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
     */
    private function redirectAfterLogin(User $user, bool $isNewUser = false): \Illuminate\Http\RedirectResponse
    {
        $message = $isNewUser 
            ? 'Welcome to ' . config('app.name') . '! Your Google account has been successfully registered.'
            : 'Welcome back! You have been successfully logged in with Google.';
            
        if ($user->isSuperAdmin()) {
            return redirect()->intended('/admin/dashboard')->with('success', $message);
        } elseif ($user->isCompanyAdmin()) {
            return redirect()->intended('/admin/dashboard')->with('success', $message);
        } else {
            return redirect()->intended('/user/dashboard')->with('success', $message);
        }
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
