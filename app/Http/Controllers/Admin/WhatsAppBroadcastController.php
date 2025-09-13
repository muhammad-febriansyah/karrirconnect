<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\WhatsappTemplate;
use App\Http\Controllers\WaGatewayController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class WhatsAppBroadcastController extends Controller
{
    protected $waGateway;

    public function __construct()
    {
        $this->waGateway = new WaGatewayController();
    }

    public function index()
    {
        return Inertia::render('admin/whatsapp/broadcast', [
            'templates' => WhatsappTemplate::active()->get(),
            'userStats' => [
                'total_users' => User::count(),
                'users_with_phone' => UserProfile::whereNotNull('phone')->count(),
                'google_users' => User::where('auth_provider', 'google')->count(),
                'email_users' => User::where('auth_provider', 'email')->count(),
            ]
        ]);
    }

    public function getUsersPreview(Request $request)
    {
        $request->validate([
            'filter_type' => 'required|in:all,with_phone,google_users,email_users,company_admins,regular_users',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $query = User::with('profile');
        $limit = $request->input('limit', 10);

        switch ($request->filter_type) {
            case 'with_phone':
                $query->whereHas('profile', function($q) {
                    $q->whereNotNull('phone');
                });
                break;
            case 'google_users':
                $query->where('auth_provider', 'google');
                break;
            case 'email_users':
                $query->where('auth_provider', 'email');
                break;
            case 'company_admins':
                $query->where('role', 'company_admin');
                break;
            case 'regular_users':
                $query->where('role', 'user');
                break;
        }

        $users = $query->limit($limit)->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->profile?->phone ?? null,
                'role' => $user->role,
                'auth_provider' => $user->auth_provider,
                'has_phone' => !empty($user->profile?->phone),
            ];
        });

        $totalCount = (clone $query)->count();

        return response()->json([
            'users' => $users,
            'total_count' => $totalCount,
            'showing' => $users->count(),
        ]);
    }

    public function sendBroadcast(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:whatsapp_templates,id',
            'filter_type' => 'required|in:all,with_phone,google_users,email_users,company_admins,regular_users',
            'message_data' => 'nullable|array',
            'test_mode' => 'boolean',
        ]);

        try {
            $template = WhatsappTemplate::findOrFail($request->template_id);
            
            if (!$template->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Template tidak aktif'
                ], 400);
            }

            // Build user query
            $query = User::with('profile');
            
            switch ($request->filter_type) {
                case 'with_phone':
                    $query->whereHas('profile', function($q) {
                        $q->whereNotNull('phone');
                    });
                    break;
                case 'google_users':
                    $query->where('auth_provider', 'google')
                          ->whereHas('profile', function($q) {
                              $q->whereNotNull('phone');
                          });
                    break;
                case 'email_users':
                    $query->where('auth_provider', 'email')
                          ->whereHas('profile', function($q) {
                              $q->whereNotNull('phone');
                          });
                    break;
                case 'company_admins':
                    $query->where('role', 'company_admin')
                          ->whereHas('profile', function($q) {
                              $q->whereNotNull('phone');
                          });
                    break;
                case 'regular_users':
                    $query->where('role', 'user')
                          ->whereHas('profile', function($q) {
                              $q->whereNotNull('phone');
                          });
                    break;
                case 'all':
                    $query->whereHas('profile', function($q) {
                        $q->whereNotNull('phone');
                    });
                    break;
            }

            // In test mode, limit to 5 users
            if ($request->test_mode) {
                $query->limit(5);
            }

            $users = $query->get();
            
            if ($users->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada pengguna yang ditemukan dengan filter yang dipilih'
                ], 400);
            }

            $successCount = 0;
            $failedCount = 0;
            $failedUsers = [];

            foreach ($users as $user) {
                if (!$user->profile || !$user->profile->phone) {
                    $failedCount++;
                    $failedUsers[] = [
                        'name' => $user->name,
                        'email' => $user->email,
                        'reason' => 'Tidak ada nomor telepon'
                    ];
                    continue;
                }

                try {
                    // Prepare data for template
                    $templateData = array_merge([
                        'user_name' => $user->name,
                        'user_email' => $user->email,
                    ], $request->message_data ?? []);

                    $message = $template->render($templateData);
                    
                    // Use reflection to access protected method
                    $reflection = new \ReflectionClass($this->waGateway);
                    $method = $reflection->getMethod('sendWhatsAppMessage');
                    $method->setAccessible(true);
                    
                    $method->invoke($this->waGateway, $user->profile->phone, $message);
                    
                    $successCount++;
                    
                    // Add small delay to prevent overwhelming the gateway
                    usleep(500000); // 0.5 second delay
                    
                } catch (\Exception $e) {
                    $failedCount++;
                    $failedUsers[] = [
                        'name' => $user->name,
                        'email' => $user->email,
                        'reason' => $e->getMessage()
                    ];
                    
                    Log::error("Failed to send WhatsApp broadcast to user {$user->id}: " . $e->getMessage());
                }
            }

            $status = $request->test_mode ? 'Test broadcast' : 'Broadcast';
            
            return response()->json([
                'success' => true,
                'message' => "{$status} berhasil dikirim ke {$successCount} pengguna",
                'data' => [
                    'total_users' => $users->count(),
                    'success_count' => $successCount,
                    'failed_count' => $failedCount,
                    'failed_users' => $failedUsers,
                    'template_used' => $template->name,
                    'test_mode' => $request->test_mode,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('WhatsApp broadcast failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim broadcast: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getBroadcastHistory()
    {
        // For now, return empty array. In production, you might want to store broadcast logs
        return response()->json([
            'broadcasts' => [],
            'message' => 'Fitur history broadcast akan segera tersedia'
        ]);
    }
}