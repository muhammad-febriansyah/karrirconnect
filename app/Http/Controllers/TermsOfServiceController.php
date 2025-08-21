<?php

namespace App\Http\Controllers;

use App\Models\TermsOfService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermsOfServiceController extends Controller
{
    public function index()
    {
        $termsOfService = TermsOfService::first();
        
        return Inertia::render('terms-of-service', [
            'title' => 'Syarat dan Ketentuan - KarirConnect',
            'termsOfService' => $termsOfService
        ]);
    }
}
