<?php

namespace App\Http\Controllers;

use App\Models\JobInvitation;
use App\Models\JobInvitationMessage;
use App\Models\Notification;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class JobInvitationMessageController extends Controller
{
    public function index(JobInvitation $jobInvitation)
    {
        try {
            // Load necessary relationships first
            $jobInvitation->load(['company', 'jobListing', 'candidate', 'sender']);

            // Check if user is authorized to view this conversation
            $user = Auth::user();

        $isCandidate = (int) $user->id === (int) $jobInvitation->candidate_id;
        $isSender = (int) $user->id === (int) optional($jobInvitation->sender)->id;
        $isCompanyUser = isset($user->company_id) && (int) $user->company_id === (int) $jobInvitation->company_id;

        if (!$isCandidate && !$isSender && !$isCompanyUser) {
            abort(403, 'Unauthorized to view this conversation');
        }

        // Cache messages for better performance
        $cacheKey = "job_invitation_messages_{$jobInvitation->id}";
        $messages = Cache::remember($cacheKey, 120, function () use ($jobInvitation) { // 2 minute cache
            return $jobInvitation->messages()
                ->with('sender:id,name,email')
                ->orderBy('created_at', 'asc') // Changed to asc for chronological order
                ->limit(50) // Load only latest 50 messages
                ->get();
        });

        // Mark messages as read for current user
        $jobInvitation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

            return Inertia::render('JobInvitationMessages/Index', [
                'jobInvitation' => [
                    'id' => $jobInvitation->id,
                    'status' => $jobInvitation->status,
                    'message' => $jobInvitation->message,
                    'created_at' => $jobInvitation->created_at,
                    'company' => [
                        'id' => $jobInvitation->company->id,
                        'name' => $jobInvitation->company->name,
                        'logo' => $jobInvitation->company->logo,
                    ],
                    'job_listing' => $jobInvitation->jobListing ? [
                        'id' => $jobInvitation->jobListing->id,
                        'title' => $jobInvitation->jobListing->title,
                        'slug' => $jobInvitation->jobListing->slug,
                    ] : null,
                    'candidate' => [
                        'id' => $jobInvitation->candidate->id,
                        'name' => $jobInvitation->candidate->name,
                        'email' => $jobInvitation->candidate->email,
                    ],
                    'sender' => $jobInvitation->sender ? [
                        'id' => $jobInvitation->sender->id,
                        'name' => $jobInvitation->sender->name,
                        'email' => $jobInvitation->sender->email,
                    ] : null,
                ],
                'messages' => $messages,
            ]);
        } catch (\Exception $e) {
            \Log::error('JobInvitationMessage Error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            abort(500, 'Error loading messages: ' . $e->getMessage());
        }
    }

    public function store(Request $request, JobInvitation $jobInvitation)
    {
        $user = Auth::user();

        // Check authorization
        if ((int) $user->id !== (int) $jobInvitation->candidate_id &&
            (int) $user->id !== (int) ($jobInvitation->sender->id ?? 0) &&
            (int) $user->company_id !== (int) $jobInvitation->company_id) {
            abort(403, 'Unauthorized to send message');
        }

        $request->validate([
            'message' => 'nullable|required_without:attachments|string|max:1000',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240', // 10MB max per file
        ]);

        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('job-invitation-attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType(),
                ];
            }
        }

        $message = JobInvitationMessage::create([
            'job_invitation_id' => $jobInvitation->id,
            'sender_id' => $user->id,
            'message' => $request->message,
            'attachments' => $attachments,
        ]);

        // Invalidate cache when new message is sent
        $cacheKey = "job_invitation_messages_{$jobInvitation->id}";
        Cache::forget($cacheKey);

        // Create notification for the recipient
        $this->createMessageNotification($jobInvitation, $message, $user);

        // Send email notification
        $this->sendMessageEmail($jobInvitation, $message, $user);

        return response()->json([
            'message' => [
                'id' => $message->id,
                'job_invitation_id' => $message->job_invitation_id,
                'sender_id' => $message->sender_id,
                'message' => $message->message,
                'attachments' => $message->attachments,
                'read_at' => $message->read_at,
                'created_at' => $message->created_at,
                'sender' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ],
            'success' => true,
        ]);
    }

    public function downloadAttachment(JobInvitationMessage $message, $attachmentIndex)
    {
        $user = Auth::user();
        $jobInvitation = $message->jobInvitation;

        // Check authorization
        if ((int) $user->id !== (int) $jobInvitation->candidate_id &&
            (int) $user->id !== (int) ($jobInvitation->sender->id ?? 0) &&
            (int) $user->company_id !== (int) $jobInvitation->company_id) {
            abort(403, 'Unauthorized to download attachment');
        }

        $attachments = $message->attachments ?? [];
        if (!isset($attachments[$attachmentIndex])) {
            abort(404, 'Attachment not found');
        }

        $attachment = $attachments[$attachmentIndex];
        $path = $attachment['path'];

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->download($path, $attachment['name']);
    }

    /**
     * Create notification for new message
     */
    private function createMessageNotification(JobInvitation $jobInvitation, JobInvitationMessage $message, $sender)
    {
        // Determine recipient based on sender
        $recipientId = null;
        $recipientRole = null;

        if ($sender->role === 'user') {
            // User sent message, notify company admin
            $recipientId = $jobInvitation->sender_id; // Company admin who sent the invitation
            $recipientRole = 'company_admin';
            $notificationTitle = 'Pesan Baru dari Kandidat';
            $notificationMessage = "{$sender->name} mengirim pesan: \"" . \Str::limit($message->message, 50) . "\"";
        } else {
            // Company admin sent message, notify candidate
            $recipientId = $jobInvitation->candidate_id;
            $recipientRole = 'user';
            $notificationTitle = 'Pesan Baru dari Perusahaan';
            $companyName = $jobInvitation->company->name ?? 'Perusahaan';
            $notificationMessage = "{$companyName} mengirim pesan: \"" . \Str::limit($message->message, 50) . "\"";
        }

        // Determine action URL based on recipient role
        $actionUrl = $recipientRole === 'user'
            ? route('user.job-invitations.messages.index', $jobInvitation->id)
            : route('company.job-invitations.messages.index', $jobInvitation->id);

        // Create notification
        Notification::create([
            'type' => 'new_message',
            'title' => $notificationTitle,
            'message' => $notificationMessage,
            'target_roles' => [$recipientRole],
            'target_user_id' => $recipientId,
            'priority' => 'medium',
            'action_url' => $actionUrl,
            'created_by' => $sender->id,
            'data' => [
                'job_invitation_id' => $jobInvitation->id,
                'message_id' => $message->id,
                'sender_id' => $sender->id,
                'sender_name' => $sender->name,
                'company_id' => $jobInvitation->company_id,
            ],
        ]);
    }

    /**
     * Send email notification for new message
     */
    private function sendMessageEmail(JobInvitation $jobInvitation, JobInvitationMessage $message, $sender): void
    {
        $jobInvitation->load(['company', 'candidate']);

        // Determine recipient and template based on sender
        if ($sender->role === 'user') {
            // User sent message to company
            $recipientEmail = $jobInvitation->company->email;
            $template = 'employer-chat-received';
            $data = [
                'company_name' => $jobInvitation->company->name,
                'sender_name' => $sender->name,
                'message_preview' => \Str::limit($message->message, 100),
                'message_time' => $message->created_at->format('d M Y H:i'),
                'chat_url' => route('company.job-invitations.messages.index', $jobInvitation->id),
            ];
        } else {
            // Company sent message to candidate
            $recipientEmail = $jobInvitation->candidate->email;
            $template = 'employee-chat-received';
            $data = [
                'user_name' => $jobInvitation->candidate->name,
                'company_name' => $jobInvitation->company->name,
                'message_preview' => \Str::limit($message->message, 100),
                'message_time' => $message->created_at->format('d M Y H:i'),
                'chat_url' => route('user.job-invitations.messages.index', $jobInvitation->id),
            ];
        }

        try {
            EmailService::send($template, $recipientEmail, $data);
            \Log::info("Chat email notification sent", [
                'template' => $template,
                'recipient' => $recipientEmail,
                'job_invitation_id' => $jobInvitation->id,
            ]);
        } catch (\Exception $e) {
            \Log::error("Failed to send chat email notification: " . $e->getMessage());
        }
    }
}
