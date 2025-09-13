<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserLoginController extends Controller
{
    /**
     * Show the user login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/user-login', [
            'canResetPassword' => true,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request for regular users.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Only allow regular users (role = 'user')
        $user = auth()->user();
        if ($user->role !== 'user') {
            Auth::logout();
            return back()->withErrors([
                'email' => 'Halaman ini khusus untuk pengguna reguler. Silakan gunakan halaman login admin.',
            ]);
        }

        // Redirect to user dashboard
        return redirect()->intended(route('user.dashboard', absolute: false));
    }
}