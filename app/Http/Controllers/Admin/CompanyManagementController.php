<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CompanyManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::withCount(['jobListings', 'users'])
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->verification_status, function ($q, $verified) {
                if ($verified === 'verified') {
                    $q->where('is_verified', true);
                } elseif ($verified === 'unverified') {
                    $q->where('is_verified', false);
                }
            })
            ->when($request->status, function ($q, $status) {
                $q->where('is_active', $status === 'active');
            });

        $perPage = $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 15, 25, 50]) ? $perPage : 10;
        
        $companies = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('admin/companies/index', [
            'companies' => $companies,
            'filters' => $request->only(['search', 'verification_status', 'status'])
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/companies/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'industry' => 'nullable|string|max:255',
            'company_size' => 'nullable|in:startup,small,medium,large,enterprise',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
        ]);

        Company::create($request->all());

        return redirect()->route('admin.companies.index')
            ->with('success', 'Perusahaan berhasil dibuat.');
    }

    public function show(Company $company)
    {
        $user = Auth::user();
        $company->load(['users', 'jobListings']);

        return Inertia::render('admin/companies/show', [
            'company' => $company,
            'userRole' => $user->role,
        ]);
    }

    public function edit(Company $company)
    {
        return Inertia::render('admin/companies/edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'industry' => 'nullable|string|max:255',
            'company_size' => 'nullable|in:startup,small,medium,large,enterprise',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $company->update($request->all());

        return redirect()->route('admin.companies.index')
            ->with('success', 'Perusahaan berhasil diperbarui.');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('admin.companies.index')
            ->with('success', 'Perusahaan berhasil dihapus.');
    }

    public function toggleVerification(Company $company)
    {
        $newVerificationStatus = !$company->is_verified;

        $company->update([
            'is_verified' => $newVerificationStatus,
            'verification_status' => $newVerificationStatus ? 'verified' : 'pending'
        ]);

        return back()->with('success', $company->is_verified ? 'Perusahaan berhasil diverifikasi.' : 'Verifikasi perusahaan berhasil dibatalkan.');
    }

    public function toggleStatus(Company $company)
    {
        $company->update(['is_active' => !$company->is_active]);

        return back()->with('success', $company->is_active ? 'Perusahaan berhasil diaktifkan.' : 'Perusahaan berhasil dinonaktifkan.');
    }

    public function showVerificationForm()
    {
        $user = Auth::user();
        $company = $user->company;

        if (!$company) {
            return redirect()->route('admin.dashboard')->with('error', 'Anda tidak terdaftar sebagai admin perusahaan.');
        }

        if ($company->is_verified) {
            return redirect()->route('admin.dashboard')->with('info', 'Perusahaan Anda sudah terverifikasi.');
        }

        return Inertia::render('admin/companies/verify', [
            'company' => $company,
        ]);
    }

    public function submitVerification(Request $request)
    {
        try {
            \Log::info('Company verification submission started', [
                'user_id' => Auth::id(),
                'request_data' => $request->except(['npwp_document', 'supporting_documents', 'company_logo']), // Exclude files from log
            ]);

        $user = Auth::user();
        $company = $user->company;

        if (!$company) {
            return redirect()->route('admin.dashboard')->with('error', 'Anda tidak terdaftar sebagai admin perusahaan.');
        }

        if ($company->is_verified) {
            return redirect()->route('admin.dashboard')->with('info', 'Perusahaan Anda sudah terverifikasi.');
        }

        $verificationType = $request->input('verification_type', 'legal');

        if ($verificationType === 'legal') {
            $this->validateLegalEntity($request);
        } else {
            $this->validateIndividualBusiness($request);
        }

        // Common validation
        $request->validate([
            'data_accuracy_agreement' => 'required|accepted',
            'terms_agreement' => 'required|accepted',
        ]);

        $documents = [];
        $verificationData = [];

        if ($verificationType === 'legal') {
            $documents = $this->processLegalDocuments($request);
            $verificationData = [
                'verification_type' => 'legal',
                'npwp_number' => $request->npwp_number,
                'nib_number' => $request->nib_number,
            ];
        } else {
            $documents = $this->processIndividualDocuments($request);
            $verificationData = [
                'verification_type' => 'individual',
                'identity_document_type' => $request->identity_document_type,
                'npwp_pribadi_number' => $request->npwp_pribadi_number,
                'nib_pribadi_number' => $request->nib_pribadi_number,
                'business_activity_type' => $request->business_activity_type,
            ];
        }

        // Process logo upload
        $logoPath = null;
        if ($request->hasFile('company_logo')) {
            $logoPath = $request->file('company_logo')->store('company-logos', 'public');
        }

        // Update company with profile data and verification info
        $company->update([
            // Profile data
            'name' => $request->legal_company_name,
            'description' => $request->company_description,
            'website' => $request->website,
            'address' => $request->office_address,
            'location' => $request->office_address, // Use address for location temporarily
            'email' => $request->work_email,
            'industry' => $request->industry,
            'size' => $request->team_size,
            'logo' => $logoPath,

            // Verification data
            'verification_status' => 'pending',
            'verification_documents' => $documents,
            'verification_data' => array_merge($verificationData, [
                'business_entity_type' => $request->business_entity_type,
                'pic_name' => $request->pic_name,
                'pic_position' => $request->pic_position,
                'pic_email' => $request->pic_email,
                'pic_phone' => $request->pic_phone,
                'submitted_at' => now()->toISOString(),
            ]),
        ]);

        $message = $verificationType === 'legal'
            ? 'Dokumen verifikasi berhasil dikirim. Tim kami akan meninjau dalam 1-3 hari kerja. Perusahaan yang lolos verifikasi akan mendapatkan Verified Badge.'
            : 'Dokumen verifikasi berhasil dikirim. Tim kami akan meninjau dalam 1-3 hari kerja untuk memberikan akses dasar.';

        \Log::info('Company verification submitted successfully', [
            'user_id' => Auth::id(),
            'company_id' => $company->id,
            'verification_type' => $verificationType,
        ]);

        return redirect()->route('admin.dashboard')->with('success', $message);

        } catch (\Exception $e) {
            \Log::error('Company verification submission failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'general' => 'Terjadi kesalahan saat mengirim verifikasi. Silakan coba lagi. Error: ' . $e->getMessage()
            ])->withInput();
        }
    }

    private function validateLegalEntity(Request $request)
    {
        $request->validate([
            'verification_type' => 'required|in:legal',

            // Company Profile
            'legal_company_name' => 'required|string|max:255',
            'business_entity_type' => 'required|string|max:50',
            'office_address' => 'required|string|max:1000',
            'work_email' => 'required|email|max:255',
            'website' => 'nullable|url|max:255',
            'company_description' => 'nullable|string|max:800',
            'industry' => 'nullable|string|max:100',
            'team_size' => 'nullable|string|max:20',
            'company_logo' => 'nullable|file|mimes:jpg,jpeg,png|max:2048', // 2MB for logo

            // PIC Information
            'pic_name' => 'required|string|max:255',
            'pic_position' => 'required|string|max:100',
            'pic_email' => 'required|email|max:255',
            'pic_phone' => 'required|string|max:20',

            // Legal Documents
            'npwp_number' => 'required|string|max:20',
            'nib_number' => 'nullable|string|max:13',
            'npwp_document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB
            'nib_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'establishment_deed' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'kemenkumham_sk' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'domicile_certificate' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'supporting_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ], [
            'npwp_document.max' => 'File NPWP maksimal 10MB',
            'company_logo.max' => 'File logo maksimal 2MB',
            'supporting_documents.*.max' => 'Setiap file dokumen pendukung maksimal 10MB',
            'legal_company_name.required' => 'Nama perusahaan wajib diisi',
            'business_entity_type.required' => 'Tipe badan usaha wajib dipilih',
            'office_address.required' => 'Alamat kantor wajib diisi',
            'work_email.required' => 'Email perusahaan wajib diisi',
            'pic_name.required' => 'Nama PIC wajib diisi',
            'pic_position.required' => 'Jabatan PIC wajib diisi',
            'pic_email.required' => 'Email PIC wajib diisi',
            'pic_phone.required' => 'Telepon PIC wajib diisi',
        ]);

        // Validate supporting documents count (max 5)
        if ($request->hasFile('supporting_documents') && count($request->file('supporting_documents')) > 5) {
            throw ValidationException::withMessages([
                'supporting_documents' => 'Maksimal 5 file dokumen pendukung'
            ]);
        }
    }

    private function validateIndividualBusiness(Request $request)
    {
        $baseRules = [
            'verification_type' => 'required|in:individual',

            // Company Profile (Individual)
            'legal_company_name' => 'required|string|max:255',
            'office_address' => 'required|string|max:1000',
            'work_email' => 'required|email|max:255',
            'website' => 'nullable|url|max:255',
            'company_description' => 'nullable|string|max:800',
            'industry' => 'nullable|string|max:100',
            'team_size' => 'nullable|string|max:20',
            'company_logo' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',

            // Individual Business Specific
            'identity_document_type' => 'required|in:npwp,ktp',
            'nib_pribadi_number' => 'nullable|string|max:50',
            'business_activity_type' => 'required|in:online,offline',
            'individual_supporting_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ];

        // Add specific validation based on identity document type
        if ($request->identity_document_type === 'npwp') {
            $baseRules['npwp_pribadi_document'] = 'required|file|mimes:pdf,jpg,jpeg,png|max:10240';
            $baseRules['npwp_pribadi_number'] = 'required|string|max:20';
        } else {
            $baseRules['ktp_pribadi_document'] = 'required|file|mimes:jpg,jpeg,png|max:10240';
        }

        // Add specific validation based on business activity type
        if ($request->business_activity_type === 'online') {
            $baseRules['online_business_photos.*'] = 'required|file|mimes:jpg,jpeg,png,mp4|max:10240';
        } else {
            $baseRules['offline_business_photos.*'] = 'required|file|mimes:jpg,jpeg,png,mp4|max:10240';
        }

        $messages = [
            '*.max' => 'File maksimal 10MB',
            'online_business_photos.*.required' => 'Minimal 2 foto/video bisnis online wajib diupload',
            'offline_business_photos.*.required' => 'Minimal 2 foto/video bisnis offline wajib diupload',
        ];

        $request->validate($baseRules, $messages);

        // Validate business photos count (min 2)
        $businessPhotosField = $request->business_activity_type === 'online' ? 'online_business_photos' : 'offline_business_photos';
        if ($request->hasFile($businessPhotosField) && count($request->file($businessPhotosField)) < 2) {
            throw ValidationException::withMessages([
                $businessPhotosField => 'Minimal 2 foto/video wajib diupload'
            ]);
        }

        // Validate supporting documents count (max 5)
        if ($request->hasFile('individual_supporting_documents') && count($request->file('individual_supporting_documents')) > 5) {
            throw ValidationException::withMessages([
                'individual_supporting_documents' => 'Maksimal 5 file dokumen pendukung'
            ]);
        }
    }

    private function processLegalDocuments(Request $request): array
    {
        $documents = [];

        // Required NPWP document
        if ($request->hasFile('npwp_document')) {
            $path = $request->file('npwp_document')->store('verification-documents/legal', 'public');
            $documents[] = [
                'type' => 'npwp_document',
                'name' => 'NPWP Perusahaan',
                'original_name' => $request->file('npwp_document')->getClientOriginalName(),
                'path' => $path,
                'uploaded_at' => now()->toISOString(),
            ];
        }

        // NIB document
        if ($request->hasFile('nib_document')) {
            $path = $request->file('nib_document')->store('verification-documents/legal', 'public');
            $documents[] = [
                'type' => 'nib_document',
                'name' => 'NIB (Nomor Induk Berusaha)',
                'original_name' => $request->file('nib_document')->getClientOriginalName(),
                'path' => $path,
                'uploaded_at' => now()->toISOString(),
            ];
        }

        // Establishment deed
        if ($request->hasFile('establishment_deed')) {
            $path = $request->file('establishment_deed')->store('verification-documents/legal', 'public');
            $documents[] = [
                'type' => 'establishment_deed',
                'name' => 'Akta Pendirian & Perubahan',
                'original_name' => $request->file('establishment_deed')->getClientOriginalName(),
                'path' => $path,
                'uploaded_at' => now()->toISOString(),
            ];
        }

        // Kemenkumham SK
        if ($request->hasFile('kemenkumham_sk')) {
            $path = $request->file('kemenkumham_sk')->store('verification-documents/legal', 'public');
            $documents[] = [
                'type' => 'kemenkumham_sk',
                'name' => 'SK Kemenkumham',
                'original_name' => $request->file('kemenkumham_sk')->getClientOriginalName(),
                'path' => $path,
                'uploaded_at' => now()->toISOString(),
            ];
        }

        // Domicile certificate
        if ($request->hasFile('domicile_certificate')) {
            $path = $request->file('domicile_certificate')->store('verification-documents/legal', 'public');
            $documents[] = [
                'type' => 'domicile_certificate',
                'name' => 'Surat Keterangan Domisili',
                'original_name' => $request->file('domicile_certificate')->getClientOriginalName(),
                'path' => $path,
                'uploaded_at' => now()->toISOString(),
            ];
        }

        // Supporting documents
        if ($request->hasFile('supporting_documents')) {
            foreach ($request->file('supporting_documents') as $index => $file) {
                $path = $file->store('verification-documents/legal', 'public');
                $documents[] = [
                    'type' => 'supporting_document',
                    'name' => "Dokumen Pendukung " . ($index + 1),
                    'original_name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'uploaded_at' => now()->toISOString(),
                ];
            }
        }

        return $documents;
    }

    private function processIndividualDocuments(Request $request): array
    {
        $documents = [];

        // Identity document based on choice
        if ($request->identity_document_type === 'npwp' && $request->hasFile('npwp_pribadi_document')) {
            $path = $request->file('npwp_pribadi_document')->store('verification-documents/individual', 'public');
            $documents[] = [
                'type' => 'npwp_pribadi_document',
                'name' => 'NPWP Pribadi',
                'original_name' => $request->file('npwp_pribadi_document')->getClientOriginalName(),
                'path' => $path,
                'uploaded_at' => now()->toISOString(),
            ];
        } elseif ($request->identity_document_type === 'ktp' && $request->hasFile('ktp_pribadi_document')) {
            $path = $request->file('ktp_pribadi_document')->store('verification-documents/individual', 'public');
            $documents[] = [
                'type' => 'ktp_pribadi_document',
                'name' => 'KTP Pribadi',
                'original_name' => $request->file('ktp_pribadi_document')->getClientOriginalName(),
                'path' => $path,
                'uploaded_at' => now()->toISOString(),
            ];
        }

        // Business activity photos based on type
        $businessPhotosField = $request->business_activity_type === 'online' ? 'online_business_photos' : 'offline_business_photos';
        $businessType = $request->business_activity_type === 'online' ? 'Online' : 'Offline';
        
        if ($request->hasFile($businessPhotosField)) {
            foreach ($request->file($businessPhotosField) as $index => $file) {
                $path = $file->store('verification-documents/individual', 'public');
                $documents[] = [
                    'type' => $businessPhotosField,
                    'name' => "Foto Bisnis {$businessType} " . ($index + 1),
                    'original_name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'uploaded_at' => now()->toISOString(),
                ];
            }
        }

        // Supporting documents
        if ($request->hasFile('individual_supporting_documents')) {
            foreach ($request->file('individual_supporting_documents') as $index => $file) {
                $path = $file->store('verification-documents/individual', 'public');
                $documents[] = [
                    'type' => 'individual_supporting_document',
                    'name' => "Dokumen Pendukung " . ($index + 1),
                    'original_name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'uploaded_at' => now()->toISOString(),
                ];
            }
        }

        return $documents;
    }

    public function verificationIndex(Request $request)
    {
        $query = Company::whereNotNull('verification_status')
            ->whereIn('verification_status', ['pending', 'verified', 'rejected'])
            ->with(['users' => function($q) {
                $q->where('role', 'company_admin');
            }])
            ->when($request->status, function ($q, $status) {
                $q->where('verification_status', $status);
            })
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            });

        // Default to pending if no status filter
        if (!$request->status) {
            $query->where('verification_status', 'pending');
        }

        $perPage = $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 15, 25, 50]) ? $perPage : 10;

        $companies = $query->latest('updated_at')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/companies/verification-review', [
            'companies' => $companies,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function updateVerificationStatus(Request $request, Company $company)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $status = $request->status;
        $isVerified = $status === 'approved';

        // Update company verification
        // Map status from frontend to database enum
        $dbStatus = $status === 'approved' ? 'verified' : $status;

        $company->update([
            'verification_status' => $dbStatus,
            'is_verified' => $isVerified,
        ]);

        // No more max_active_jobs limit - companies can post unlimited active jobs

        // Log admin action (optional - you can create an admin_logs table)
        // AdminLog::create([
        //     'admin_id' => Auth::id(),
        //     'action' => 'company_verification_' . $status,
        //     'target_id' => $company->id,
        //     'target_type' => Company::class,
        //     'notes' => $request->admin_notes,
        // ]);

        $message = $status === 'approved' 
            ? 'Verifikasi perusahaan berhasil disetujui.'
            : 'Verifikasi perusahaan telah ditolak.';

        return back()->with('success', $message);
    }
}
