<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\WhatsAppPasswordResetService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    protected $whatsAppPasswordResetService;

    public function __construct(WhatsAppPasswordResetService $whatsAppPasswordResetService)
    {
        $this->whatsAppPasswordResetService = $whatsAppPasswordResetService;
    }

    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Send email reset link (Laravel default) and WhatsApp notification
        $whatsAppService = $this->whatsAppPasswordResetService;
        $status = Password::sendResetLink(
            $request->only('email'),
            function ($user, $token) use ($whatsAppService) {
                // Load userProfile relationship if not already loaded
                if (!$user->relationLoaded('userProfile')) {
                    $user->load('userProfile');
                }
                // Generate reset URL for WhatsApp
                $resetUrl = URL::temporarySignedRoute(
                    'password.reset',
                    now()->addMinutes(60),
                    ['token' => $token, 'email' => $user->email]
                );

                // Send WhatsApp notification if user has phone number in profile
                $userPhone = $user->userProfile->phone ?? null;
                if ($userPhone) {
                    try {
                        $whatsAppService->sendPasswordResetNotification($user, $resetUrl);
                        Log::info("📱 WhatsApp password reset sent to: {$user->email} (phone: {$userPhone})");
                    } catch (\Exception $e) {
                        Log::error("❌ Failed to send WhatsApp password reset: " . $e->getMessage(), [
                            'user_email' => $user->email,
                            'user_phone' => $userPhone,
                        ]);
                    }
                } else {
                    Log::info("⚠️ No phone number in profile for user: {$user->email}, skipping WhatsApp notification");
                }
            }
        );

        // Always return success message for security (don't reveal if email exists)
        return back()->with('status', 'Jika email terdaftar, tautan reset kata sandi akan dikirim melalui email dan WhatsApp.');
    }
}
