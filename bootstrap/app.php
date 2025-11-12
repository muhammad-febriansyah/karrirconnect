<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\EnsureUserIsAdminRole;
use App\Http\Middleware\EnsureUserIsCompanyAdmin;
use App\Http\Middleware\EnsureUserIsRegularUser;
use App\Http\Middleware\RedirectTrailingSlashes;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')
                ->group(base_path('routes/admin.php'));
            Route::middleware('web')
                ->group(base_path('routes/settings.php'));
            Route::middleware('web')
                ->group(base_path('routes/company.php'));
            Route::middleware('web')
                ->group(base_path('routes/user.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        
        $middleware->api(prepend: [
            RedirectTrailingSlashes::class,
        ]);

        $middleware->alias([
            'admin.role' => EnsureUserIsAdminRole::class,
            'company.admin' => EnsureUserIsCompanyAdmin::class,
            'user.role' => EnsureUserIsRegularUser::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle PostTooLargeException with user-friendly message
        $exceptions->render(function (\Illuminate\Http\Exceptions\PostTooLargeException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Data yang dikirim terlalu besar. Silakan kurangi ukuran file atau jumlah data.',
                    'error' => 'PostTooLargeException',
                    'max_size' => ini_get('post_max_size'),
                ], 413);
            }

            return back()->withErrors([
                'file' => 'Data yang dikirim terlalu besar. Silakan kurangi ukuran file atau jumlah data. Maksimal: ' . ini_get('post_max_size'),
            ])->with('error', 'Data terlalu besar untuk diproses.');
        });
    })->create();
