<?php

namespace App\Http\Controllers;

use App\Models\PrivacyPolicy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrivacyPolicyController extends Controller
{
    public function index()
    {
        $privacyPolicy = PrivacyPolicy::first();
        
        return Inertia::render('privacy-policy', [
            'title' => 'Kebijakan Privasi - KarirConnect',
            'privacyPolicy' => $privacyPolicy
        ]);
    }
}
