<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of email templates.
     */
    public function index()
    {
        $templates = EmailTemplate::orderBy('type')->orderBy('name')->get();

        return Inertia::render('admin/email-templates/index', [
            'templates' => $templates
        ]);
    }

    /**
     * Show the form for creating a new email template.
     */
    public function create()
    {
        return Inertia::render('admin/email-templates/create');
    }

    /**
     * Store a newly created email template in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:email_templates,slug',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
            'type' => 'required|in:system,marketing,transactional',
        ]);

        EmailTemplate::create($validated);

        return redirect()->route('admin.email-templates.index')
            ->with('success', 'Email template created successfully.');
    }

    /**
     * Display the specified email template.
     */
    public function show(EmailTemplate $emailTemplate)
    {
        return Inertia::render('admin/email-templates/show', [
            'template' => $emailTemplate
        ]);
    }

    /**
     * Show the form for editing the specified email template.
     */
    public function edit(EmailTemplate $emailTemplate)
    {
        return Inertia::render('admin/email-templates/edit', [
            'template' => $emailTemplate
        ]);
    }

    /**
     * Update the specified email template in storage.
     */
    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:email_templates,slug,' . $emailTemplate->id,
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
            'type' => 'required|in:system,marketing,transactional',
        ]);

        $emailTemplate->update($validated);

        return redirect()->route('admin.email-templates.index')
            ->with('success', 'Email template updated successfully.');
    }

    /**
     * Remove the specified email template from storage.
     */
    public function destroy(EmailTemplate $emailTemplate)
    {
        $emailTemplate->delete();

        return redirect()->route('admin.email-templates.index')
            ->with('success', 'Email template deleted successfully.');
    }

    /**
     * Toggle the active status of the email template.
     */
    public function toggle(EmailTemplate $emailTemplate)
    {
        $emailTemplate->update([
            'is_active' => !$emailTemplate->is_active
        ]);

        return back()->with('success', 'Email template status updated successfully.');
    }

    /**
     * Preview the email template.
     */
    public function preview(EmailTemplate $emailTemplate)
    {
        // Sample data for preview
        $sampleData = [];
        if ($emailTemplate->variables) {
            foreach ($emailTemplate->variables as $variable) {
                $sampleData[$variable] = "{{" . $variable . "}}";
            }
        }

        $body = $this->replaceVariables($emailTemplate->body, $sampleData);
        $subject = $this->replaceVariables($emailTemplate->subject, $sampleData);

        return Inertia::render('admin/email-templates/preview', [
            'template' => $emailTemplate,
            'preview' => [
                'subject' => $subject,
                'body' => $body
            ]
        ]);
    }

    /**
     * Replace variables in template with actual data.
     */
    private function replaceVariables(string $template, array $data): string
    {
        foreach ($data as $key => $value) {
            $pattern = '/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/';
            $template = preg_replace($pattern, (string) $value, $template);
        }

        return $template;
    }

    /**
     * Send a test email.
     */
    public function sendTest(Request $request, EmailTemplate $emailTemplate)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'test_data' => 'nullable|array'
        ]);

        try {
            $data = $validated['test_data'] ?? [];

            // Fill in missing variables with sample data
            if ($emailTemplate->variables) {
                foreach ($emailTemplate->variables as $variable) {
                    if (!isset($data[$variable])) {
                        $data[$variable] = "[Sample " . ucwords(str_replace('_', ' ', $variable)) . "]";
                    }
                }
            }

            // Use replaceVariables to handle both {{ variable }} and {{variable}}
            $body = $this->replaceVariables($emailTemplate->body, $data);
            $subject = $this->replaceVariables($emailTemplate->subject, $data);

            \Mail::html($body, function($message) use ($validated, $subject) {
                $message->to($validated['email'])
                    ->subject('[TEST] ' . $subject);
            });

            return back()->with('success', 'Test email sent successfully to ' . $validated['email']);
        } catch (\Exception $e) {
            \Log::error('Failed to send test email', [
                'template_id' => $emailTemplate->id,
                'recipient' => $validated['email'],
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Failed to send test email: ' . $e->getMessage());
        }
    }
}
