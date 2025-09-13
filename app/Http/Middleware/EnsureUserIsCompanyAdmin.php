<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsCompanyAdmin
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
        
        // Check if user has company_admin role
        if ($user->role !== 'company_admin') {
            abort(403, 'Access denied. Company admin role required.');
        }
        
        // Check if user is associated with a company
        if (!$user->company_id || !$user->company) {
            abort(403, 'Access denied. You must be associated with a company to access this area.');
        }

        return $next($request);
    }
}