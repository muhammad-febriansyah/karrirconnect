<?php

namespace App\Services;

use App\Models\PointTransaction;
use App\Models\Company;
use App\Models\WhatsappTemplate;
use App\Models\Setting;
use Illuminate\Support\Facades\Log;

class WhatsAppPaymentService
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
            Log::warning("❌ Pesan WhatsApp TIDAK terkirim: Nomor tidak valid. Input: {$number} | Dibersihkan: {$waNumber}");
            return;
        }

        $waGatewayUrl = env('APP_WA_URL');
        if (empty($waGatewayUrl)) {
            Log::warning("❌ Pesan WhatsApp TIDAK terkirim: APP_WA_URL tidak diatur di .env");
            return;
        }

        $attempt = 0;
        $success = false;

        while ($attempt < $retryCount && !$success) {
            $attempt++;
            
            try {
                if ($attempt > 1) {
                    Log::info("🔄 Retry #{$attempt} mengirim WhatsApp ke {$waNumber}");
                    sleep(2); // Wait 2 seconds between retries
                } else {
                    Log::info("📤 Mengirim WhatsApp ke {$waNumber} dengan pesan:\n" . $message);
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
                CURLOPT_USERAGENT => $this->getSettings()->site_name . '-WhatsApp-Service/1.0',
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
                    Log::error("❌ Attempt {$attempt}/{$retryCount} - Gagal mengirim WA ke {$waNumber}: Error cURL - {$err}");
                    if ($attempt < $retryCount) {
                        Log::info("🔄 Will retry in 2 seconds...");
                        continue; // Try again
                    }
                } elseif ($httpCode >= 400) {
                    Log::error("❌ Attempt {$attempt}/{$retryCount} - Gagal mengirim WA ke {$waNumber}: HTTP {$httpCode} - Respons: {$response}");
                    if ($attempt < $retryCount) {
                        Log::info("🔄 Will retry in 2 seconds...");
                        continue; // Try again
                    }
                } else {
                    Log::info("✅ WhatsApp terkirim ke {$waNumber} pada attempt {$attempt} | Respons: {$response}");
                    $success = true; // Success, exit loop
                }
            } catch (\Exception $e) {
                Log::error("❌ Exception pada attempt {$attempt}/{$retryCount} saat mengirim WhatsApp ke {$waNumber}: " . $e->getMessage(), [
                    'trace' => $e->getTraceAsString(),
                ]);
                if ($attempt < $retryCount) {
                    Log::info("🔄 Will retry in 2 seconds...");
                    continue; // Try again
                }
            }
        }
        
        if (!$success) {
            Log::error("❌ FINAL FAILURE: Gagal mengirim WhatsApp ke {$waNumber} setelah {$retryCount} attempts");
        }
    }

    public function sendPaymentSuccessNotification(PointTransaction $transaction, Company $company): void
    {
        $phoneNumber = $this->getCompanyPhoneNumber($company);
        
        if (!$phoneNumber) {
            Log::warning("❌ Tidak dapat mengirim WhatsApp: Company {$company->name} tidak memiliki nomor telepon yang valid", [
                'company_id' => $company->id,
                'company_phone' => $company->phone ?: 'NULL/EMPTY',
                'admin_phones' => $company->users()
                    ->where('role', 'company_admin')
                    ->with('profile')
                    ->get()
                    ->mapWithKeys(function($user) {
                        return [$user->name => $user->profile->phone ?? 'NULL'];
                    })
                    ->toArray()
            ]);
            return;
        }

        $message = $this->createSuccessMessage($transaction, $company);
        $this->sendWhatsAppMessage($phoneNumber, $message);
    }

    public function sendPaymentFailedNotification(PointTransaction $transaction, Company $company): void
    {
        $phoneNumber = $this->getCompanyPhoneNumber($company);
        
        if (!$phoneNumber) {
            Log::warning("❌ Tidak dapat mengirim WhatsApp: Company {$company->name} tidak memiliki nomor telepon yang valid", [
                'company_id' => $company->id,
                'company_phone' => $company->phone ?: 'NULL/EMPTY',
                'admin_phones' => $company->users()
                    ->where('role', 'company_admin')
                    ->with('profile')
                    ->get()
                    ->mapWithKeys(function($user) {
                        return [$user->name => $user->profile->phone ?? 'NULL'];
                    })
                    ->toArray()
            ]);
            return;
        }

        $message = $this->createFailedMessage($transaction, $company);
        $this->sendWhatsAppMessage($phoneNumber, $message);
    }

    private function getCompanyPhoneNumber(Company $company): ?string
    {
        // 1. Cek phone company terlebih dahulu
        if (!empty($company->phone)) {
            return $company->phone;
        }

        // 2. Fallback ke phone dari company admin pertama (via user_profiles)
        $companyAdmin = $company->users()
            ->where('role', 'company_admin')
            ->whereHas('profile', function($query) {
                $query->whereNotNull('phone')->where('phone', '!=', '');
            })
            ->with('profile')
            ->first();

        if ($companyAdmin && $companyAdmin->profile && !empty($companyAdmin->profile->phone)) {
            Log::info("📞 Menggunakan nomor admin {$companyAdmin->name} untuk company {$company->name}");
            return $companyAdmin->profile->phone;
        }

        // 3. Tidak ada nomor yang valid
        return null;
    }

    private function createSuccessMessage(PointTransaction $transaction, Company $company): string
    {
        $template = WhatsappTemplate::getPaymentSuccessTemplate();
        
        if ($template) {
            $package = $transaction->pointPackage;
            $formatAmount = number_format($transaction->amount, 0, ',', '.');
            
            $data = [
                'company_name' => $company->name,
                'package_name' => $package->name,
                'package_points' => $package->total_points,
                'amount' => $formatAmount,
                'order_id' => $transaction->payment_reference,
                'total_points' => $company->job_posting_points,
                'dashboard_url' => config('app.url') . "/company/dashboard"
            ];
            
            return $template->render($data);
        }
        
        // Fallback to default message if template not found
        return $this->getDefaultSuccessMessage($transaction, $company);
    }

    private function createFailedMessage(PointTransaction $transaction, Company $company): string
    {
        $template = WhatsappTemplate::getPaymentFailedTemplate();
        
        if ($template) {
            $package = $transaction->pointPackage;
            $formatAmount = number_format($transaction->amount, 0, ',', '.');
            
            $data = [
                'company_name' => $company->name,
                'package_name' => $package->name,
                'package_points' => $package->total_points,
                'amount' => $formatAmount,
                'order_id' => $transaction->payment_reference,
                'retry_url' => config('app.url') . "/company/points"
            ];
            
            return $template->render($data);
        }
        
        // Fallback to default message if template not found
        return $this->getDefaultFailedMessage($transaction, $company);
    }

    private function getDefaultSuccessMessage(PointTransaction $transaction, Company $company): string
    {
        $package = $transaction->pointPackage;
        $formatAmount = number_format($transaction->amount, 0, ',', '.');
        
        $message = "*PEMBAYARAN BERHASIL*\n\n";
        $message .= "*{$company->name}*\n\n";
        $message .= "*Detail Pembelian:*\n";
        $message .= "- Paket: {$package->name}\n";
        $message .= "- Poin: {$package->total_points} poin\n";
        $message .= "- Harga: Rp {$formatAmount}\n";
        $message .= "- Order ID: {$transaction->payment_reference}\n\n";
        $message .= "*Poin telah ditambahkan ke akun Anda!*\n";
        $message .= "Total poin sekarang: {$company->job_posting_points} poin\n\n";
        $siteName = $this->getSettings()->site_name ?? 'KarirConnect';
        
        $message .= "Silakan login ke dashboard untuk menggunakan poin Anda:\n";
        $message .= config('app.url') . "/company/dashboard\n\n";
        $message .= "Terima kasih telah menggunakan {$siteName}!\n\n";
        $message .= "_Pesan otomatis dari {$siteName}_\n";
        $message .= now()->format('d/m/Y H:i:s');

        return $message;
    }

    private function getDefaultFailedMessage(PointTransaction $transaction, Company $company): string
    {
        $package = $transaction->pointPackage;
        $formatAmount = number_format($transaction->amount, 0, ',', '.');
        
        $message = "*PEMBAYARAN GAGAL*\n\n";
        $message .= "*{$company->name}*\n\n";
        $message .= "*Detail Pembelian:*\n";
        $message .= "- Paket: {$package->name}\n";
        $message .= "- Poin: {$package->total_points} poin\n";
        $message .= "- Harga: Rp {$formatAmount}\n";
        $message .= "- Order ID: {$transaction->payment_reference}\n\n";
        $message .= "*Pembayaran tidak berhasil atau dibatalkan*\n\n";
        $message .= "Anda dapat mencoba lagi dengan:\n";
        $message .= "1. Pastikan saldo mencukupi\n";
        $message .= "2. Periksa koneksi internet\n";
        $message .= "3. Gunakan metode pembayaran lain\n\n";
        $message .= "Coba lagi di:\n";
        $siteName = $this->getSettings()->site_name ?? 'KarirConnect';
        
        $message .= config('app.url') . "/company/points\n\n";
        $message .= "Jika masalah berlanjut, hubungi customer service kami.\n\n";
        $message .= "_Pesan otomatis dari {$siteName}_\n";
        $message .= now()->format('d/m/Y H:i:s');

        return $message;
    }
}