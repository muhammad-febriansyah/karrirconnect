<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsRegularUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect('/login');
        }

        $user = auth()->user();
        
        // Only allow regular users (role: 'user')
        if ($user->role !== 'user') {
            // Redirect to appropriate dashboard based on role
            if ($user->role === 'super_admin') {
                return redirect()->route('admin.dashboard');
            }
            
            if ($user->role === 'company_admin') {
                // Check if company_admin has valid company association
                if ($user->company_id && $user->company) {
                    return redirect()->route('admin.dashboard');
                } else {
                    // Company admin without company should contact support
                    abort(403, 'Access denied. Please contact support to associate your account with a company.');
                }
            }
            
            // If unknown role, redirect to home
            return redirect()->route('home');
        }

        return $next($request);
    }
}