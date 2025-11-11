<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'g-recaptcha-response' => 'required|captcha',
        ], [
            'g-recaptcha-response.required' => 'Silakan verifikasi bahwa Anda bukan robot.',
            'g-recaptcha-response.captcha' => 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        // Send welcome email to user
        $this->sendWelcomeEmail($user);

        Auth::login($user);

        // Redirect based on user role
        if ($user->role === 'user') {
            return redirect()->intended(route('user.dashboard', absolute: false));
        } else {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }
    }

    /**
     * Send welcome email to new user
     */
    private function sendWelcomeEmail(User $user): void
    {
        try {
            EmailService::send('employee-registration-success', $user->email, [
                'user_name' => $user->name,
                'profile_url' => route('user.profile.edit'),
                'jobs_url' => route('jobs.index'),
            ]);

            \Log::info("Welcome email sent to user: {$user->email}");
        } catch (\Exception $e) {
            \Log::error("Failed to send welcome email to user: " . $e->getMessage());
        }
    }
}
