<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\UserProfile;
use App\Models\WhatsappTemplate;
use App\Http\Controllers\WaGatewayController;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CompanyRegistrationController extends Controller
{
    /**
     * Display the company registration view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register-company');
    }

    /**
     * Handle an incoming company registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_email' => 'required|string|lowercase|email|max:255|unique:companies,email',
            'company_phone' => 'nullable|string|max:20',
            'company_location' => 'required|string|max:255',
            'company_address' => 'nullable|string|max:500',
            'company_description' => 'nullable|string|max:1000',
            'company_website' => 'nullable|url|max:255',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'admin_phone' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'g-recaptcha-response' => 'required|captcha',
        ], [
            'company_name.required' => 'Nama perusahaan wajib diisi.',
            'company_email.required' => 'Email perusahaan wajib diisi.',
            'company_email.unique' => 'Email perusahaan sudah terdaftar.',
            'company_location.required' => 'Lokasi perusahaan wajib diisi.',
            'admin_name.required' => 'Nama admin wajib diisi.',
            'admin_email.required' => 'Email admin wajib diisi.',
            'admin_email.unique' => 'Email admin sudah terdaftar.',
            'admin_phone.required' => 'Nomor WhatsApp admin wajib diisi.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'g-recaptcha-response.required' => 'Harap verifikasi reCAPTCHA.',
            'g-recaptcha-response.captcha' => 'Verifikasi reCAPTCHA gagal.',
        ]);

        DB::beginTransaction();

        try {
            // Create company first
            $company = Company::create([
                'name' => $request->company_name,
                'email' => $request->company_email,
                'phone' => $request->company_phone,
                'location' => $request->company_location, // Required field
                'address' => $request->company_address,
                'description' => $request->company_description,
                'website' => $request->company_website,
                'slug' => Str::slug($request->company_name) . '-' . Str::random(6),
                'logo' => null,
                'is_active' => true,
                'is_verified' => false, // Companies need admin verification
                'verification_status' => 'pending',
                'verification_documents' => null,
                // Initialize points system
                'job_posting_points' => 5, // Give 5 points for new companies
                'total_job_posts' => 0,
                'active_job_posts' => 0,
                'max_active_jobs' => 10, // Default limit
                'points_last_updated' => now(),
            ]);

            // Create admin user for the company
            $user = User::create([
                'name' => $request->admin_name,
                'email' => $request->admin_email,
                'password' => Hash::make($request->password),
                'role' => 'company_admin',
                'company_id' => $company->id,
                'is_active' => true,
                'auth_provider' => 'email',
                'verification_status' => 'unverified',
            ]);

            // Create profile for admin user
            UserProfile::create([
                'user_id' => $user->id,
                'first_name' => explode(' ', $request->admin_name)[0] ?? $request->admin_name,
                'last_name' => explode(' ', $request->admin_name, 2)[1] ?? '',
                'phone' => $request->admin_phone,
            ]);

            // Update company with admin user ID
            $company->update(['admin_user_id' => $user->id]);

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            // Send WhatsApp notification to admin KarirConnect
            $this->sendAdminNotification($company, $user, $request);

            return redirect()->route('admin.dashboard')->with('success', 
                'Akun perusahaan berhasil dibuat! Perusahaan Anda sedang menunggu verifikasi admin.'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'general' => 'Terjadi kesalahan saat membuat akun perusahaan. Silakan coba lagi.'
            ])->withInput();
        }
    }

    /**
     * Send WhatsApp notification to KarirConnect admin
     */
    private function sendAdminNotification(Company $company, User $user, Request $request): void
    {
        try {
            // Get company registration notification template
            $template = WhatsappTemplate::active()
                ->where('slug', 'company-registration-notification')
                ->first();

            if (!$template) {
                \Log::warning('Company registration notification template not found');
                return;
            }

            // Prepare template data
            $templateData = [
                'company_name' => $company->name,
                'company_email' => $company->email,
                'company_location' => $company->location,
                'company_website' => $company->website ?: 'Tidak ada',
                'admin_name' => $user->name,
                'admin_email' => $user->email,
                'admin_phone' => $request->admin_phone,
            ];

            // Render message
            $message = $template->render($templateData);

            // Send to admin KarirConnect (hardcoded admin number)
            $adminPhoneNumber = '081295916567'; // Replace with actual admin number
            
            $waGateway = new WaGatewayController();
            
            // Use reflection to access protected method
            $reflection = new \ReflectionClass($waGateway);
            $method = $reflection->getMethod('sendWhatsAppMessage');
            $method->setAccessible(true);
            
            $method->invoke($waGateway, $adminPhoneNumber, $message);

            \Log::info("Company registration notification sent to admin for company: {$company->name}");

        } catch (\Exception $e) {
            \Log::error("Failed to send company registration notification: " . $e->getMessage());
        }
    }
}