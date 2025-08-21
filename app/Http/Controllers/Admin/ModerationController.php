<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\JobReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ModerationController extends Controller
{
    public function jobListings(Request $request)
    {
        $query = JobListing::with(['company', 'moderator'])
            ->orderBy('created_at', 'desc');

        if ($request->status) {
            $query->where('moderation_status', $request->status);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhereHas('company', function ($sq) use ($request) {
                      $sq->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        $jobListings = $query->paginate(20);

        return Inertia::render('admin/moderation/job-listings', [
            'jobListings' => $jobListings,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function moderateJobListing(Request $request, JobListing $jobListing)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes' => 'nullable|string',
        ]);

        $jobListing->update([
            'moderation_status' => $request->status,
            'moderated_by' => Auth::id(),
            'moderation_notes' => $request->notes,
            'moderated_at' => now(),
            'status' => $request->status === 'approved' ? 'published' : 'paused',
        ]);

        return back()->with('success', 'Job listing moderation status updated successfully.');
    }

    public function reports(Request $request)
    {
        $query = JobReport::with(['jobListing.company', 'reporter', 'reviewer'])
            ->orderBy('created_at', 'desc');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->reason) {
            $query->where('reason', $request->reason);
        }

        $reports = $query->paginate(20);

        return Inertia::render('admin/moderation/reports', [
            'reports' => $reports,
            'filters' => $request->only(['status', 'reason']),
        ]);
    }

    public function resolveReport(Request $request, JobReport $report)
    {
        $request->validate([
            'status' => 'required|in:resolved,dismissed',
            'admin_notes' => 'nullable|string',
            'job_action' => 'nullable|in:approve,reject,suspend',
        ]);

        $report->update([
            'status' => $request->status,
            'reviewed_by' => Auth::id(),
            'admin_notes' => $request->admin_notes,
            'reviewed_at' => now(),
        ]);

        if ($request->job_action && $report->jobListing) {
            switch ($request->job_action) {
                case 'reject':
                    $report->jobListing->update([
                        'moderation_status' => 'rejected',
                        'moderated_by' => Auth::id(),
                        'moderation_notes' => "Rejected due to report: " . $request->admin_notes,
                        'moderated_at' => now(),
                        'status' => 'paused',
                    ]);
                    break;
                case 'suspend':
                    $report->jobListing->update(['status' => 'paused']);
                    break;
                case 'approve':
                    $report->jobListing->update([
                        'moderation_status' => 'approved',
                        'status' => 'published',
                    ]);
                    break;
            }
        }

        return back()->with('success', 'Report resolved successfully.');
    }

    public function bulkModerateJobs(Request $request)
    {
        $request->validate([
            'job_ids' => 'required|array',
            'job_ids.*' => 'exists:job_listings,id',
            'action' => 'required|in:approve,reject',
        ]);

        JobListing::whereIn('id', $request->job_ids)->update([
            'moderation_status' => $request->action === 'approve' ? 'approved' : 'rejected',
            'moderated_by' => Auth::id(),
            'moderated_at' => now(),
            'status' => $request->action === 'approve' ? 'published' : 'paused',
        ]);

        return back()->with('success', 'Bulk moderation completed successfully.');
    }
}
