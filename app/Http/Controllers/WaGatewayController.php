<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use App\Models\Notification;
use App\Models\WhatsappTemplate;

class WaGatewayController extends Controller
{
    protected function sendWhatsAppMessage(string $number, string $message): void
    {
        $waNumber = preg_replace('/[^0-9]/', '', $number);

        if (empty($waNumber) || strlen($waNumber) < 9) {
            Log::warning("❌ Pesan WhatsApp TIDAK terkirim: Nomor tidak valid. Input: {$number} | Dibersihkan: {$waNumber}");
            return;
        }

        $waGatewayUrl = env('APP_WA_URL');
        if (empty($waGatewayUrl)) {
            Log::warning("❌ Pesan WhatsApp TIDAK terkirim: APP_WA_URL tidak diatur di .env");
            return;
        }

        try {
            Log::info("📤 Mengirim WhatsApp ke {$waNumber} dengan pesan:\n" . $message);

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => $waGatewayUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_CONNECTTIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => http_build_query([
                    'message' => $message,
                    'to' => $waNumber,
                ]),
                // DNS and SSL options to fix getaddrinfo issues
                CURLOPT_DNS_CACHE_TIMEOUT => 120,
                CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_USERAGENT => 'KarirConnect-WhatsApp-Service/1.0',
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/x-www-form-urlencoded',
                    'Accept: application/json',
                ],
            ]);

            $response = curl_exec($curl);
            $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                Log::error("❌ Gagal mengirim WA ke {$waNumber}: Error cURL - {$err}");
            } elseif ($httpCode >= 400) {
                Log::error("❌ Gagal mengirim WA ke {$waNumber}: HTTP {$httpCode} - Respons: {$response}");
            } else {
                Log::info("✅ WhatsApp terkirim ke {$waNumber} | Respons: {$response}");
            }
        } catch (\Exception $e) {
            Log::error("❌ Exception saat mengirim WhatsApp ke {$waNumber}: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    public function testConnection(Request $request): JsonResponse
    {
        try {
            $waGatewayUrl = env('APP_WA_URL');
            if (empty($waGatewayUrl)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'APP_WA_URL tidak dikonfigurasi di file .env'
                ], 500);
            }

            $testNumber = $request->input('test_number', '081295916567');
            $testMessage = $request->input('test_message', 'Test koneksi dari sistem KarirConnect pada ' . now()->format('d/m/Y H:i:s'));

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => $waGatewayUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => [
                    'message' => $testMessage,
                    'to' => $testNumber,
                ],
            ]);

            $response = curl_exec($curl);
            $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error cURL: ' . $err,
                    'wa_gateway_url' => $waGatewayUrl
                ], 500);
            }

            if ($httpCode >= 400) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error HTTP ' . $httpCode,
                    'response' => $response,
                    'wa_gateway_url' => $waGatewayUrl
                ], 500);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Koneksi WhatsApp Gateway berhasil',
                'http_code' => $httpCode,
                'response' => $response,
                'test_number' => $testNumber,
                'wa_gateway_url' => $waGatewayUrl
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Exception: ' . $e->getMessage(),
                'wa_gateway_url' => env('APP_WA_URL')
            ], 500);
        }
    }

    public function sendNotificationWhatsApp(Notification $notification, ?string $phoneNumber = null): JsonResponse
    {
        try {
            if (!$phoneNumber) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Nomor telepon wajib diisi'
                ], 400);
            }

            $message = $this->formatNotificationMessage($notification);
            $this->sendWhatsAppMessage($phoneNumber, $message);

            return response()->json([
                'status' => 'success',
                'message' => 'Notifikasi WhatsApp berhasil dikirim',
                'notification_id' => $notification->id,
                'phone_number' => $phoneNumber
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengirim notifikasi WhatsApp: ' . $e->getMessage()
            ], 500);
        }
    }

    public function sendNotificationToUser(Notification $notification, User $user): JsonResponse
    {
        try {
            if (!$user->phone_number) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User tidak memiliki nomor telepon'
                ], 400);
            }

            $message = $this->formatNotificationMessage($notification, $user);
            $this->sendWhatsAppMessage($user->phone_number, $message);

            return response()->json([
                'status' => 'success',
                'message' => 'Notifikasi WhatsApp berhasil dikirim ke user',
                'notification_id' => $notification->id,
                'user_id' => $user->id,
                'phone_number' => $user->phone_number
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengirim notifikasi WhatsApp ke user: ' . $e->getMessage()
            ], 500);
        }
    }

    private function formatNotificationMessage(Notification $notification, ?User $user = null): string
    {
        // Try to get specific template based on notification type
        $template = $this->getTemplateForNotification($notification);
        
        if ($template) {
            // Prepare data for template
            $data = $this->prepareTemplateData($notification, $user);
            return $template->render($data);
        }

        // Fallback to default format if no template found
        return $this->getDefaultNotificationMessage($notification, $user);
    }

    private function getTemplateForNotification(Notification $notification): ?WhatsappTemplate
    {
        // Map notification types to template slugs
        $templateMap = [
            'user' => 'user-registration',
            'company' => 'company-registration', 
            'application' => 'job-application',
            'system' => 'system-update',
        ];

        $templateSlug = $templateMap[$notification->type] ?? null;
        
        if ($templateSlug) {
            return WhatsappTemplate::active()->where('slug', $templateSlug)->first();
        }

        // Try to get generic notification template
        return WhatsappTemplate::active()->where('type', 'notification')->first();
    }

    private function prepareTemplateData(Notification $notification, ?User $user = null): array
    {
        $data = [
            'title' => $notification->title,
            'message' => $notification->message,
            'action_url' => $notification->action_url,
        ];

        if ($user) {
            $data['user_name'] = $user->name;
            $data['user_email'] = $user->email;
        }

        // Add data from notification's data field
        if ($notification->data) {
            $data = array_merge($data, $notification->data);
        }

        return $data;
    }

    private function getDefaultNotificationMessage(Notification $notification, ?User $user = null): string
    {
        $message = "🔔 *KarirConnect Notification*\n\n";
        $message .= "*{$notification->title}*\n\n";
        $message .= $notification->message;

        if ($user) {
            $message .= "\n\nHalo {$user->name},";
        }

        if ($notification->action_url) {
            $baseUrl = config('app.url');
            $fullUrl = $baseUrl . $notification->action_url;
            $message .= "\n\n🔗 Link: {$fullUrl}";
        }

        $message .= "\n\n_Pesan otomatis dari KarirConnect_";
        $message .= "\n" . now()->format('d/m/Y H:i:s');

        return $message;
    }

    public function sendWithTemplate(Request $request): JsonResponse
    {
        $request->validate([
            'template_id' => 'required|exists:whatsapp_templates,id',
            'phone_number' => 'required|string',
            'data' => 'nullable|array',
        ]);

        try {
            $template = WhatsappTemplate::findOrFail($request->template_id);
            
            if (!$template->is_active) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Template tidak aktif'
                ], 400);
            }

            $message = $template->render($request->data ?? []);
            $this->sendWhatsAppMessage($request->phone_number, $message);

            return response()->json([
                'status' => 'success',
                'message' => 'WhatsApp berhasil dikirim menggunakan template',
                'template_id' => $template->id,
                'phone_number' => $request->phone_number
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengirim WhatsApp: ' . $e->getMessage()
            ], 500);
        }
    }
}
