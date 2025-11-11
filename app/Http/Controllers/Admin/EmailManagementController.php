<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Models\EmailCampaign;
use App\Models\NotificationSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class EmailManagementController extends Controller
{
    // Email Templates
    public function templates()
    {
        $templates = EmailTemplate::orderBy('name')->get();

        return Inertia::render('admin/email/templates', [
            'templates' => $templates,
        ]);
    }

    public function createTemplate()
    {
        return Inertia::render('admin/email/create-template');
    }

    public function storeTemplate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'required|in:system,marketing,transactional',
            'variables' => 'nullable|array',
        ]);

        EmailTemplate::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'subject' => $request->subject,
            'body' => $request->body,
            'type' => $request->type,
            'variables' => $request->variables,
        ]);

        return redirect()->route('admin.email.templates')->with('success', 'Email template created successfully.');
    }

    public function editTemplate(EmailTemplate $template)
    {
        return Inertia::render('admin/email/edit-template', [
            'template' => $template,
        ]);
    }

    public function updateTemplate(Request $request, EmailTemplate $template)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'required|in:system,marketing,transactional',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $template->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'subject' => $request->subject,
            'body' => $request->body,
            'type' => $request->type,
            'variables' => $request->variables,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.email.templates')->with('success', 'Email template updated successfully.');
    }

    // Email Campaigns
    public function campaigns()
    {
        $campaigns = EmailCampaign::with('creator')->orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/email/campaigns', [
            'campaigns' => $campaigns,
        ]);
    }

    public function createCampaign()
    {
        $templates = EmailTemplate::where('is_active', true)->get();

        return Inertia::render('admin/email/create-campaign', [
            'templates' => $templates,
        ]);
    }

    public function storeCampaign(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'recipient_criteria' => 'nullable|array',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        // Calculate recipients based on criteria
        $recipientQuery = User::query();
        
        if ($request->recipient_criteria) {
            if (isset($request->recipient_criteria['role'])) {
                $recipientQuery->where('role', $request->recipient_criteria['role']);
            }
            if (isset($request->recipient_criteria['is_active'])) {
                $recipientQuery->where('is_active', $request->recipient_criteria['is_active']);
            }
            if (isset($request->recipient_criteria['verification_status'])) {
                $recipientQuery->where('verification_status', $request->recipient_criteria['verification_status']);
            }
        }

        $totalRecipients = $recipientQuery->count();

        $campaign = EmailCampaign::create([
            'name' => $request->name,
            'subject' => $request->subject,
            'content' => $request->content,
            'recipient_criteria' => $request->recipient_criteria,
            'scheduled_at' => $request->scheduled_at,
            'total_recipients' => $totalRecipients,
            'status' => $request->scheduled_at ? 'scheduled' : 'draft',
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('admin.email.campaigns')->with('success', 'Email campaign created successfully.');
    }

    public function sendCampaign(EmailCampaign $campaign)
    {
        if ($campaign->status !== 'draft' && $campaign->status !== 'scheduled') {
            return back()->with('error', 'Campaign cannot be sent in current status.');
        }

        // Build recipient query
        $recipientQuery = User::query();
        
        if ($campaign->recipient_criteria) {
            if (isset($campaign->recipient_criteria['role'])) {
                $recipientQuery->where('role', $campaign->recipient_criteria['role']);
            }
            if (isset($campaign->recipient_criteria['is_active'])) {
                $recipientQuery->where('is_active', $campaign->recipient_criteria['is_active']);
            }
            if (isset($campaign->recipient_criteria['verification_status'])) {
                $recipientQuery->where('verification_status', $campaign->recipient_criteria['verification_status']);
            }
        }

        $recipients = $recipientQuery->get();

        $campaign->update([
            'status' => 'sending',
            'total_recipients' => $recipients->count(),
        ]);

        // Send emails (in a real application, this should be queued)
        $sentCount = 0;
        foreach ($recipients as $recipient) {
            try {
                // Prepare data for variable replacement
                $data = [
                    'nama' => $recipient->name,
                    'email' => $recipient->email,
                    'name' => $recipient->name,
                    'user_name' => $recipient->name,
                    'company_name' => $recipient->company->name ?? 'N/A',
                ];

                // Replace variables in content
                $body = $campaign->content;
                foreach ($data as $key => $value) {
                    $patterns = [
                        '/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/',  // {{ variable }}
                        '/\{\{' . preg_quote($key, '/') . '\}\}/',         // {{variable}}
                    ];
                    foreach ($patterns as $pattern) {
                        $body = preg_replace($pattern, (string) $value, $body);
                    }
                }

                // Send as HTML email
                Mail::html($body, function ($message) use ($campaign, $recipient) {
                    $message->to($recipient->email)
                            ->subject($campaign->subject);
                });
                $sentCount++;
            } catch (\Exception $e) {
                \Log::error('Failed to send campaign email', [
                    'campaign_id' => $campaign->id,
                    'recipient_email' => $recipient->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $campaign->update([
            'status' => 'sent',
            'sent_count' => $sentCount,
            'sent_at' => now(),
        ]);

        return back()->with('success', 'Campaign sent successfully to ' . $sentCount . ' recipients.');
    }

    // Notification Settings
    public function notificationSettings()
    {
        $settings = NotificationSetting::orderBy('name')->get();

        return Inertia::render('admin/email/notification-settings', [
            'settings' => $settings,
        ]);
    }

    public function createNotificationSetting()
    {
        return Inertia::render('admin/email/create-notification-setting');
    }

    public function storeNotificationSetting(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email_enabled' => 'boolean',
            'sms_enabled' => 'boolean',
            'push_enabled' => 'boolean',
            'is_user_configurable' => 'boolean',
        ]);

        NotificationSetting::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'email_enabled' => $request->email_enabled ?? true,
            'sms_enabled' => $request->sms_enabled ?? false,
            'push_enabled' => $request->push_enabled ?? true,
            'is_user_configurable' => $request->is_user_configurable ?? true,
        ]);

        return redirect()->route('admin.email.notification-settings')->with('success', 'Notification setting created successfully.');
    }

    public function updateNotificationSetting(Request $request, NotificationSetting $setting)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email_enabled' => 'boolean',
            'sms_enabled' => 'boolean',
            'push_enabled' => 'boolean',
            'is_user_configurable' => 'boolean',
        ]);

        $setting->update([
            'name' => $request->name,
            'description' => $request->description,
            'email_enabled' => $request->email_enabled ?? true,
            'sms_enabled' => $request->sms_enabled ?? false,
            'push_enabled' => $request->push_enabled ?? true,
            'is_user_configurable' => $request->is_user_configurable ?? true,
        ]);

        return back()->with('success', 'Notification setting updated successfully.');
    }
}
