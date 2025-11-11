<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;
use App\Models\PointTransaction;
use App\Models\PointPackage;
use App\Models\Company;
use App\Models\Setting;
use App\Services\WhatsAppPaymentService;
use App\Services\EmailService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MidtransService
{
    protected $whatsAppService;

    public function __construct(WhatsAppPaymentService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
        
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');

        // Debug logging
        Log::info('Midtrans Config', [
            'server_key' => Config::$serverKey ? 'SET (' . substr(Config::$serverKey, 0, 10) . '...)' : 'NOT SET',
            'is_production' => Config::$isProduction,
            'key_length' => strlen(Config::$serverKey ?? ''),
            'merchant_id' => config('services.midtrans.merchant_id'),
        ]);
    }

    public function createPayment(Company $company, PointPackage $package)
    {
        $orderId = 'POINTS-' . $company->id . '-' . time() . '-' . Str::random(6);
        
        // Get service fee from settings
        $settings = Setting::first();
        $serviceFee = $settings->fee ?? 0;
        $totalAmount = $package->price + $serviceFee;

        // Create pending transaction first
        $transaction = PointTransaction::create([
            'company_id' => $company->id,
            'point_package_id' => $package->id,
            'type' => 'purchase',
            'points' => $package->total_points,
            'amount' => $totalAmount,
            'description' => "Pembelian {$package->name} - {$package->total_points} poin",
            'payment_method' => 'midtrans',
            'payment_reference' => $orderId,
            'status' => 'pending',
            'metadata' => [
                'package_name' => $package->name,
                'package_points' => $package->points,
                'package_bonus' => $package->bonus_points,
                'package_price' => $package->price,
                'service_fee' => $serviceFee,
                'total_amount' => $totalAmount,
            ],
        ]);

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $totalAmount,
            ],
            'item_details' => array_merge([
                [
                    'id' => $package->id,
                    'price' => (int) $package->price,
                    'quantity' => 1,
                    'name' => $package->name,
                    'category' => 'Point Package',
                ]
            ], $serviceFee > 0 ? [[
                'id' => 'service_fee',
                'price' => (int) $serviceFee,
                'quantity' => 1,
                'name' => 'Biaya Layanan',
                'category' => 'Service Fee',
            ]] : []),
            'customer_details' => [
                'first_name' => $company->name,
                'email' => $company->email,
                'phone' => $company->phone,
            ],
            'enabled_payments' => [
                // E-Wallets (Most Popular)
                'gopay',
                'shopeepay',
                'dana',
                'ovo',
                'linkaja',

                // QRIS (Universal QR)
                'qris',

                // Bank Transfer
                'bca_va',
                'bni_va',
                'bri_va',
                'mandiri_va',
                'permata_va',
                'other_va',

                // Convenience Store
                'indomaret',
                'alfamart',

                // Credit Card
                'credit_card',

                // Installment
                'bca_klikpay',
                'bca_klikbca',
                'mandiri_clickpay',
                'mandiri_ecash',
                'cimb_clicks',
                'danamon_online',
            ],
            'callbacks' => [
                'finish' => route('company.points.payment.finish'),
            ],
            'expiry' => [
                'start_time' => date('Y-m-d H:i:s O'),
                'unit' => 'minutes',
                'duration' => 30
            ]
        ];

        try {
            Log::info('Payment initiated', [
                'company_id' => $company->id,
                'company_name' => $company->name,
                'package_id' => $package->id,
                'package_name' => $package->name,
                'amount' => $totalAmount,
                'order_id' => $orderId,
                'step' => 'creating_snap_token'
            ]);

            Log::info('Midtrans Snap Request', [
                'params' => $params,
                'server_key_prefix' => substr(Config::$serverKey, 0, 15),
            ]);

            $snapToken = Snap::getSnapToken($params);

            Log::info('Snap token created successfully', [
                'order_id' => $orderId,
                'company_id' => $company->id,
                'token_length' => strlen($snapToken),
                'step' => 'snap_token_created'
            ]);

            // Update transaction with snap token
            $transaction->update([
                'metadata' => array_merge($transaction->metadata ?? [], [
                    'snap_token' => $snapToken,
                    'midtrans_params' => $params,
                ])
            ]);

            return [
                'snap_token' => $snapToken,
                'transaction' => $transaction,
                'order_id' => $orderId,
            ];
        } catch (\Exception $e) {
            Log::error('Midtrans Snap Error', [
                'error' => $e->getMessage(),
                'order_id' => $orderId,
                'company_id' => $company->id,
            ]);
            $transaction->update(['status' => 'failed']);
            throw $e;
        }
    }

    public function handleNotification()
    {
        try {
            $notification = new Notification();

            $orderId = $notification->order_id;
            $transactionStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status ?? null;
            $paymentType = $notification->payment_type ?? null;

            Log::info('Webhook notification received', [
                'order_id' => $orderId,
                'transaction_status' => $transactionStatus,
                'fraud_status' => $fraudStatus,
                'payment_type' => $paymentType,
                'gross_amount' => $notification->gross_amount ?? null,
                'step' => 'webhook_received'
            ]);

            $transaction = PointTransaction::where('payment_reference', $orderId)->first();

            if (!$transaction) {
                Log::error('Transaction not found in webhook', [
                    'order_id' => $orderId,
                    'transaction_status' => $transactionStatus,
                    'step' => 'transaction_not_found'
                ]);
                return ['status' => 'error', 'message' => 'Transaction not found'];
            }

            $company = $transaction->company;

            Log::info('Processing webhook for transaction', [
                'transaction_id' => $transaction->id,
                'company_id' => $company->id,
                'current_status' => $transaction->status,
                'new_status' => $transactionStatus,
                'payment_type' => $paymentType,
                'step' => 'processing_webhook'
            ]);

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $transaction->update(['status' => 'pending']);
                } else if ($fraudStatus == 'accept') {
                    $this->completeTransaction($transaction, $company);
                }
            } else if ($transactionStatus == 'settlement') {
                $this->completeTransaction($transaction, $company);
            } else if ($transactionStatus == 'pending') {
                $transaction->update(['status' => 'pending']);
            } else if (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
                $transaction->update(['status' => 'failed']);
                
                // Send WhatsApp notification for failed payment
                try {
                    $this->whatsAppService->sendPaymentFailedNotification($transaction, $company);
                    Log::info('WhatsApp notification sent for failed payment', [
                        'transaction_id' => $transaction->id,
                        'company_id' => $company->id,
                        'status' => $transactionStatus,
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send WhatsApp notification for failed payment', [
                        'transaction_id' => $transaction->id,
                        'company_id' => $company->id,
                        'status' => $transactionStatus,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            return ['status' => 'success', 'transaction' => $transaction];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    private function completeTransaction(PointTransaction $transaction, Company $company)
    {
        if ($transaction->status === 'completed') {
            return; // Already completed
        }

        // Add points to company
        $company->increment('job_posting_points', $transaction->points);
        $company->update(['points_last_updated' => now()]);

        // Update transaction status
        $transaction->update([
            'status' => 'completed',
            'metadata' => array_merge($transaction->metadata ?? [], [
                'completed_at' => now()->toISOString(),
                'points_added' => $transaction->points,
                'previous_points' => $company->job_posting_points - $transaction->points,
                'new_points' => $company->job_posting_points,
            ])
        ]);

        Log::info('Transaction completed successfully', [
            'transaction_id' => $transaction->id,
            'company_id' => $company->id,
            'points_added' => $transaction->points,
            'new_total_points' => $company->job_posting_points,
            'step' => 'transaction_completed'
        ]);

        // Send WhatsApp notification for successful payment
        try {
            $this->whatsAppService->sendPaymentSuccessNotification($transaction, $company);
            Log::info('WhatsApp notification sent for successful payment', [
                'transaction_id' => $transaction->id,
                'company_id' => $company->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send WhatsApp notification for successful payment', [
                'transaction_id' => $transaction->id,
                'company_id' => $company->id,
                'error' => $e->getMessage(),
            ]);
        }

        // Send email notification for successful payment
        try {
            EmailService::send('employer-payment-notification', $company->email, [
                'company_name' => $company->name,
                'transaction_id' => $transaction->payment_reference,
                'package_name' => $transaction->pointPackage->name ?? 'N/A',
                'points' => number_format($transaction->points, 0, ',', '.'),
                'amount' => number_format($transaction->amount, 0, ',', '.'),
                'payment_date' => $transaction->updated_at->format('d M Y H:i'),
                'current_balance' => number_format($company->job_posting_points, 0, ',', '.'),
            ]);
            Log::info('Email notification sent for successful payment', [
                'transaction_id' => $transaction->id,
                'company_id' => $company->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send email notification for successful payment', [
                'transaction_id' => $transaction->id,
                'company_id' => $company->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function getPaymentStatus($orderId)
    {
        try {
            $status = \Midtrans\Transaction::status($orderId);
            return $status;
        } catch (\Exception $e) {
            return null;
        }
    }
}
