<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PointTransaction;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Query base untuk transaction history
        $query = PointTransaction::with(['company', 'pointPackage'])
            ->when($user->role === 'company_admin' && $user->company_id, function ($q) use ($user) {
                // Company admin hanya bisa lihat transaksi perusahaannya
                $q->where('company_id', $user->company_id);
            })
            ->when($request->search, function ($q, $search) {
                $q->whereHas('company', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('payment_reference', 'like', "%{$search}%");
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->when($request->type, function ($q, $type) {
                $q->where('type', $type);
            })
            ->when($request->company_id, function ($q, $companyId) {
                $q->where('company_id', $companyId);
            })
            ->when($request->date_from, function ($q, $dateFrom) {
                $q->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($q, $dateTo) {
                $q->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy('created_at', 'desc');

        $transactions = $query->paginate(20)->withQueryString();

        // Summary statistics - filtered by company for company admin
        $statsQuery = PointTransaction::query()
            ->when($user->role === 'company_admin' && $user->company_id, function ($q) use ($user) {
                $q->where('company_id', $user->company_id);
            });

        $stats = [
            'total_transactions' => (clone $statsQuery)->count(),
            'total_points_sold' => (clone $statsQuery)
                ->where('type', 'purchase')
                ->where('status', 'completed')
                ->sum('points'),
            'total_points_used' => (clone $statsQuery)
                ->where('type', 'usage')
                ->where('status', 'completed')
                ->sum('points') * -1,
            'total_revenue' => (clone $statsQuery)
                ->where('type', 'purchase')
                ->where('status', 'completed')
                ->sum('amount'),
            'pending_transactions' => (clone $statsQuery)
                ->where('status', 'pending')
                ->count(),
        ];

        $filters = $request->only(['search', 'status', 'type', 'company_id', 'date_from', 'date_to']);
        
        // Get companies for filter dropdown
        $companies = Company::where('is_active', true)
            ->when($user->role === 'company_admin' && $user->company_id, function ($q) use ($user) {
                // Company admin hanya bisa lihat perusahaannya sendiri
                $q->where('id', $user->company_id);
            })
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'stats' => $stats,
            'filters' => $filters,
            'companies' => $companies,
            'userRole' => $user->role,
        ]);
    }

    public function show(PointTransaction $transaction)
    {
        $user = Auth::user();

        // Company admin hanya bisa lihat transaksi perusahaannya
        if ($user->role === 'company_admin' && $transaction->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }

        $transaction->load(['company', 'pointPackage']);

        return Inertia::render('admin/transactions/show', [
            'transaction' => $transaction,
        ]);
    }

    public function export(Request $request)
    {
        $user = Auth::user();

        $query = PointTransaction::with(['company', 'pointPackage'])
            ->when($user->role === 'company_admin' && $user->company_id, function ($q) use ($user) {
                $q->where('company_id', $user->company_id);
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->when($request->type, function ($q, $type) {
                $q->where('type', $type);
            })
            ->when($request->date_from, function ($q, $dateFrom) {
                $q->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($q, $dateTo) {
                $q->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy('created_at', 'desc');

        $transactions = $query->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="point-transactions-' . now()->format('Y-m-d') . '.csv"',
        ];

        $callback = function() use ($transactions) {
            $file = fopen('php://output', 'w');
            
            // CSV Headers
            fputcsv($file, [
                'ID',
                'Company',
                'Type',
                'Points',
                'Amount',
                'Description',
                'Status',
                'Payment Reference',
                'Package',
                'Created At'
            ]);

            // CSV Data
            foreach ($transactions as $transaction) {
                fputcsv($file, [
                    $transaction->id,
                    $transaction->company->name,
                    ucfirst($transaction->type),
                    $transaction->points,
                    $transaction->amount ? 'Rp ' . number_format($transaction->amount, 0, ',', '.') : '-',
                    $transaction->description,
                    ucfirst($transaction->status),
                    $transaction->payment_reference ?? '-',
                    $transaction->pointPackage->name ?? '-',
                    $transaction->created_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
