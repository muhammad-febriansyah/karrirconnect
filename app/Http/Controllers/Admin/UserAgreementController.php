<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserAgreement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserAgreementController extends Controller
{
    public function edit()
    {
        $userAgreement = UserAgreement::first();

        if (!$userAgreement) {
            $userAgreement = UserAgreement::create([
                'body' => '',
            ]);
        }

        return Inertia::render('admin/user-agreement/edit', [
            'userAgreement' => $userAgreement,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'body' => 'required|string',
        ]);

        $userAgreement = UserAgreement::first();

        if (!$userAgreement) {
            $userAgreement = new UserAgreement();
        }

        $userAgreement->update($request->all());

        return redirect()->route('admin.user-agreement.edit')
            ->with('success', 'Perjanjian pengguna berhasil diperbarui.');
    }
}
