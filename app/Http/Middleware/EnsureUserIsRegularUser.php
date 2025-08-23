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
            if ($user->role === 'super_admin' || $user->role === 'company_admin') {
                return redirect()->route('admin.dashboard');
            }
            
            // If unknown role, redirect to home
            return redirect()->route('home');
        }

        return $next($request);
    }
}