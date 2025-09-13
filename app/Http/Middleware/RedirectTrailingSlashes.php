<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RedirectTrailingSlashes
{
    public function handle(Request $request, Closure $next)
    {
        // For webhook endpoints, handle trailing slash properly
        if ($request->is('api/webhook/*') && $request->getMethod() === 'POST') {
            $path = $request->path();
            
            // If path ends with slash and it's a webhook, remove the slash
            if (str_ends_with($path, '/')) {
                $newPath = rtrim($path, '/');
                $request->server->set('REQUEST_URI', '/' . $newPath . ($request->getQueryString() ? '?' . $request->getQueryString() : ''));
                $request->server->set('PATH_INFO', '/' . $newPath);
            }
        }

        return $next($request);
    }
}