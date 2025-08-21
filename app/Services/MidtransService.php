<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;
use App\Models\PointTransaction;
use App\Models\PointPackage;
use App\Models\Company;
use Illuminate\Support\Str;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
    }

    public function createPayment(Company $company, PointPackage $package)
    {
        $orderId = 'POINTS-' . $company->id . '-' . time() . '-' . Str::random(6);
        
        // Create pending transaction first
        $transaction = PointTransaction::create([
            'company_id' => $company->id,
            'point_package_id' => $package->id,
            'type' => 'purchase',
            'points' => $package->total_points,
            'amount' => $package->price,
            'description' => "Pembelian {$package->name} - {$package->total_points} poin",
            'payment_method' => 'midtrans',
            'payment_reference' => $orderId,
            'status' => 'pending',
            'metadata' => [
                'package_name' => $package->name,
                'package_points' => $package->points,
                'package_bonus' => $package->bonus_points,
            ],
        ]);

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $package->price,
            ],
            'item_details' => [
                [
                    'id' => $package->id,
                    'price' => (int) $package->price,
                    'quantity' => 1,
                    'name' => $package->name,
                    'category' => 'Point Package',
                ]
            ],
            'customer_details' => [
                'first_name' => $company->name,
                'email' => $company->email,
                'phone' => $company->phone,
            ],
            'enabled_payments' => [
                'credit_card', 'bca_va', 'bni_va', 'bri_va', 'mandiri_va',
                'permata_va', 'other_va', 'gopay', 'shopeepay', 'dana'
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
            $snapToken = Snap::getSnapToken($params);
            
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
            
            $transaction = PointTransaction::where('payment_reference', $orderId)->first();
            
            if (!$transaction) {
                return ['status' => 'error', 'message' => 'Transaction not found'];
            }

            $company = $transaction->company;
            
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
            ])
        ]);
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