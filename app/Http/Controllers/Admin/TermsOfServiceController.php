<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TermsOfService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermsOfServiceController extends Controller
{
    public function edit()
    {
        $termsOfService = TermsOfService::first();

        if (!$termsOfService) {
            $termsOfService = TermsOfService::create([
                'body' => '',
            ]);
        }

        return Inertia::render('admin/terms-of-service/edit', [
            'termsOfService' => $termsOfService,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'body' => 'required|string',
        ]);

        $termsOfService = TermsOfService::first();

        if (!$termsOfService) {
            $termsOfService = new TermsOfService();
        }

        $termsOfService->update($request->all());

        return redirect()->route('admin.terms-of-service.edit')
            ->with('success', 'Syarat dan ketentuan berhasil diperbarui.');
    }
}
