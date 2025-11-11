<?php

namespace App\Services;

use App\Models\User;
use App\Models\WhatsappTemplate;
use App\Models\Setting;
use Illuminate\Support\Facades\Log;

class WhatsAppPasswordResetService
{
    private ?Setting $settings = null;
    
    private function getSettings(): Setting
    {
        if ($this->settings === null) {
            $this->settings = Setting::first();
        }
        return $this->settings;
    }
    protected function sendWhatsAppMessage(string $number, string $message, int $retryCount = 3): void
    {
        $waNumber = preg_replace('/[^0-9]/', '', $number);

        if (empty($waNumber) || strlen($waNumber) < 9) {
            Log::warning("Pesan WhatsApp password reset TIDAK terkirim: Nomor tidak valid. Input: {$number} | Dibersihkan: {$waNumber}");
            return;
        }

        $waGatewayUrl = env('APP_WA_URL');
        if (empty($waGatewayUrl)) {
            Log::warning("Pesan WhatsApp password reset TIDAK terkirim: APP_WA_URL tidak diatur di .env");
            return;
        }

        $attempt = 0;
        $success = false;

        while ($attempt < $retryCount && !$success) {
            $attempt++;
            
            try {
                if ($attempt > 1) {
                    Log::info("Retry #{$attempt} mengirim WhatsApp password reset ke {$waNumber}");
                    sleep(2); // Wait 2 seconds between retries
                } else {
                    Log::info("Mengirim WhatsApp password reset ke {$waNumber} dengan pesan:\n" . $message);
                }

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
                    CURLOPT_USERAGENT => $this->getSettings()->site_name . '-WhatsApp-PasswordReset/1.0',
                    CURLOPT_HTTPHEADER => [
                        'Content-Type: application/x-www-form-urlencoded',
                        'Accept: application/json',
                    ],
                ]);

                $response = curl_exec($curl);
                $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
                $error = curl_error($curl);
                curl_close($curl);

                if (!empty($error)) {
                    Log::error("Attempt {$attempt}/{$retryCount} - Gagal mengirim WhatsApp password reset ke {$waNumber}: Error cURL - {$error}");
                    if ($attempt < $retryCount) {
                        Log::info("Will retry in 2 seconds...");
                        continue; // Try again
                    }
                } elseif ($httpCode >= 400) {
                    Log::error("Attempt {$attempt}/{$retryCount} - HTTP Error {$httpCode} - Response: {$response}");
                    if ($attempt < $retryCount) {
                        Log::info("Will retry in 2 seconds...");
                        continue; // Try again
                    }
                } else {
                    // Success
                    Log::info("WhatsApp password reset berhasil dikirim ke {$waNumber} - HTTP {$httpCode}");
                    $success = true;
                }

            } catch (\Exception $e) {
                Log::error("Exception saat mengirim WhatsApp password reset (attempt #{$attempt}): " . $e->getMessage());
                continue;
            }
        }

        if (!$success) {
            Log::error("GAGAL mengirim WhatsApp password reset ke {$waNumber} setelah {$retryCount} percobaan");
        }
    }

    public function sendPasswordResetNotification(User $user, string $resetUrl): void
    {
        try {
            // Get phone number from user profile
            $phoneNumber = $user->userProfile->phone ?? null;
            
            if (!$phoneNumber) {
                Log::warning("No phone number in userProfile for user: {$user->email}");
                return;
            }

            // Get WhatsApp template for password reset
            $template = WhatsappTemplate::where('type', 'password_reset')->first();
            
            if (!$template) {
                Log::warning("Template WhatsApp password_reset tidak ditemukan, menggunakan template default");
                $message = $this->getDefaultPasswordResetMessage($user, $resetUrl);
            } else {
                $message = $this->replaceTemplatePlaceholders($template->message, $user, $resetUrl);
            }

            // Send WhatsApp message
            $this->sendWhatsAppMessage($phoneNumber, $message);

            Log::info("WhatsApp password reset notification dikirim ke user: {$user->email} ({$phoneNumber})");

        } catch (\Exception $e) {
            Log::error("Error mengirim WhatsApp password reset notification: " . $e->getMessage(), [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'user_phone' => $user->userProfile->phone ?? 'N/A',
                'error' => $e->getTraceAsString(),
            ]);
        }
    }

    private function getDefaultPasswordResetMessage(User $user, string $resetUrl): string
    {
        $siteName = $this->getSettings()->site_name ?? 'KarirConnect';
        
        return "*Reset Kata Sandi - {$siteName}*\n\n" .
               "Halo {$user->name},\n\n" .
               "Kami menerima permintaan untuk mereset kata sandi akun Anda.\n\n" .
               "Klik tautan berikut untuk mereset kata sandi:\n" .
               "{$resetUrl}\n\n" .
               "Tautan ini akan kedaluarsa dalam 60 menit.\n\n" .
               "Jika Anda tidak meminta reset kata sandi, abaikan pesan ini.\n\n" .
               "Salam,\n" .
               "Tim {$siteName}";
    }

    private function replaceTemplatePlaceholders(string $template, User $user, string $resetUrl): string
    {
        $siteName = $this->getSettings()->site_name ?? 'KarirConnect';
        
        $placeholders = [
            '{user_name}' => $user->name,
            '{user_email}' => $user->email,
            '{reset_url}' => $resetUrl,
            '{site_name}' => $siteName,
        ];

        return str_replace(
            array_keys($placeholders),
            array_values($placeholders),
            $template
        );
    }
}
