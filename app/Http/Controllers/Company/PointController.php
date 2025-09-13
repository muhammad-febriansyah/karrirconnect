<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\PointPackage;
use App\Models\PointTransaction;
use App\Models\Setting;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PointController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    public function index()
    {
        $company = auth()->user()->company;

        $pointHistory = $company->pointTransactions()
            ->with('pointPackage')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('company/points/index', [
            'company' => $company,
            'pointHistory' => $pointHistory,
            'stats' => [
                'current_points' => $company->job_posting_points,
                'total_spent' => $company->pointTransactions()->where('type', 'usage')->sum('points') * -1,
                'total_purchased' => $company->pointTransactions()->where('type', 'purchase')->completed()->sum('points'),
                'active_jobs' => $company->active_job_posts,
                'max_active_jobs' => $company->max_active_jobs,
            ]
        ]);
    }

    public function packages()
    {
        $settings = Setting::first();
        $serviceFee = $settings->fee ?? 0;
        
        $packages = PointPackage::active()->orderBy('price')->get()->map(function ($package) use ($serviceFee) {
            $totalPrice = $package->price + $serviceFee;
            return [
                'id' => $package->id,
                'name' => $package->name,
                'description' => $package->description,
                'points' => $package->points,
                'price' => $package->price,
                'bonus_points' => $package->bonus_points,
                'is_active' => $package->is_active,
                'is_featured' => $package->is_featured,
                'features' => $package->features,
                'total_points' => $package->total_points,
                'formatted_price' => $package->formatted_price,
                'service_fee' => $serviceFee,
                'total_price' => $totalPrice,
                'formatted_total_price' => 'Rp ' . number_format($totalPrice, 0, ',', '.'),
            ];
        });

        $company = auth()->user()->company;

        return Inertia::render('company/points/packages', [
            'packages' => $packages,
            'company' => $company,
            'serviceFee' => $serviceFee,
            'formattedServiceFee' => 'Rp ' . number_format($serviceFee, 0, ',', '.'),
        ]);
    }

    public function purchase(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Purchase request received', $request->all());

        $request->validate([
            'package_id' => 'required|exists:point_packages,id'
        ]);

        $package = PointPackage::findOrFail($request->package_id);
        $company = auth()->user()->company;

        if (!$company) {
            return back()->with('error', 'User tidak terhubung dengan perusahaan. Silakan hubungi admin.');
        }

        \Illuminate\Support\Facades\Log::info('Purchase details', [
            'package_id' => $package->id,
            'company_id' => $company->id,
            'package_active' => $package->is_active
        ]);

        if (!$package->is_active) {
            return back()->with('error', 'Paket tidak tersedia.');
        }

        try {
            \Illuminate\Support\Facades\Log::info('Creating payment with Midtrans');
            $payment = $this->midtransService->createPayment($company, $package);

            \Illuminate\Support\Facades\Log::info('Payment created successfully', [
                'snap_token' => $payment['snap_token'],
                'order_id' => $payment['order_id']
            ]);

            return response()->json([
                'success' => true,
                'snap_token' => $payment['snap_token'],
                'order_id' => $payment['order_id'],
                'package' => $package,
                'transaction' => $payment['transaction']
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Payment creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Gagal membuat pembayaran: ' . $e->getMessage()
            ], 422);
        }
    }

    public function paymentFinish(Request $request)
    {
        $orderId = $request->order_id;
        $resultType = $request->result_type; // success, pending, error

        $transaction = PointTransaction::where('payment_reference', $orderId)->first();

        if (!$transaction) {
            return redirect()->route('company.points.index')
                ->with('error', 'Transaksi tidak ditemukan.');
        }

        $status = $this->midtransService->getPaymentStatus($orderId);

        return Inertia::render('company/points/paymentResult', [
            'transaction' => $transaction->load('pointPackage'),
            'resultType' => $resultType,
            'paymentStatus' => $status
        ]);
    }

    public function webhook(Request $request)
    {
        $result = $this->midtransService->handleNotification();

        return response()->json($result);
    }
}
