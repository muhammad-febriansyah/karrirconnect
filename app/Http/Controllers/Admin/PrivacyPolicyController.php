<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrivacyPolicy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrivacyPolicyController extends Controller
{
    public function edit()
    {
        $privacyPolicy = PrivacyPolicy::first();

        if (!$privacyPolicy) {
            $privacyPolicy = PrivacyPolicy::create([
                'body' => '',
            ]);
        }

        return Inertia::render('admin/privacy-policy/edit', [
            'privacyPolicy' => $privacyPolicy,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'body' => 'required|string',
        ]);

        $privacyPolicy = PrivacyPolicy::first();

        if (!$privacyPolicy) {
            $privacyPolicy = new PrivacyPolicy();
        }

        $privacyPolicy->update($request->all());

        return redirect()->route('admin.privacy-policy.edit')
            ->with('success', 'Kebijakan privasi berhasil diperbarui.');
    }
}
