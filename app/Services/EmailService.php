<?php

namespace App\Services;

use App\Models\EmailTemplate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

class EmailService
{
    /**
     * Send an email using a template slug
     *
     * @param string $slug Template slug
     * @param string|array $to Recipient email(s)
     * @param array $data Variables to replace in template
     * @param array $attachments Optional attachments
     * @return bool
     */
    public static function send(string $slug, string|array $to, array $data = [], array $attachments = []): bool
    {
        try {
            $template = EmailTemplate::where('slug', $slug)
                ->where('is_active', true)
                ->first();

            if (!$template) {
                Log::error("Email template not found or inactive", ['slug' => $slug]);
                return false;
            }

            // Replace variables in subject and body
            $subject = self::replaceVariables($template->subject, $data);
            $body = self::replaceVariables($template->body, $data);

            // Send email
            Mail::html($body, function($message) use ($to, $subject, $attachments) {
                $message->to($to)->subject($subject);

                // Add attachments if any
                foreach ($attachments as $attachment) {
                    if (isset($attachment['path'])) {
                        $message->attach($attachment['path'], $attachment['options'] ?? []);
                    }
                }
            });

            Log::info("Email sent successfully", [
                'template' => $slug,
                'to' => is_array($to) ? implode(', ', $to) : $to,
            ]);

            return true;

        } catch (Exception $e) {
            Log::error("Failed to send email", [
                'template' => $slug,
                'to' => is_array($to) ? implode(', ', $to) : $to,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return false;
        }
    }

    /**
     * Replace variables in template string
     * Supports both {{ variable }} and {{variable}} formats
     *
     * @param string $template
     * @param array $data
     * @return string
     */
    public static function replaceVariables(string $template, array $data): string
    {
        foreach ($data as $key => $value) {
            // Handle both {{ variable }} and {{variable}} formats
            $patterns = [
                '/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/',  // {{ variable }}
                '/\{\{' . preg_quote($key, '/') . '\}\}/',         // {{variable}}
            ];

            foreach ($patterns as $pattern) {
                $template = preg_replace($pattern, (string) $value, $template);
            }
        }

        return $template;
    }

    /**
     * Get template preview with sample data
     *
     * @param string $slug
     * @param array $data Optional sample data
     * @return array|null
     */
    public static function preview(string $slug, array $data = []): ?array
    {
        try {
            $template = EmailTemplate::where('slug', $slug)->first();

            if (!$template) {
                return null;
            }

            // If no data provided, use sample data
            if (empty($data) && $template->variables) {
                foreach ($template->variables as $variable) {
                    $data[$variable] = "{{" . $variable . "}}";
                }
            }

            return [
                'template' => $template,
                'subject' => self::replaceVariables($template->subject, $data),
                'body' => self::replaceVariables($template->body, $data),
            ];

        } catch (Exception $e) {
            Log::error("Failed to preview email template", [
                'slug' => $slug,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Send test email
     *
     * @param string $slug Template slug
     * @param string $to Recipient email
     * @param array $data Test data
     * @return bool
     */
    public static function sendTest(string $slug, string $to, array $data = []): bool
    {
        try {
            $template = EmailTemplate::where('slug', $slug)->first();

            if (!$template) {
                return false;
            }

            // Fill in missing variables with sample data
            if ($template->variables) {
                foreach ($template->variables as $variable) {
                    if (!isset($data[$variable])) {
                        $data[$variable] = "[Sample " . ucwords(str_replace('_', ' ', $variable)) . "]";
                    }
                }
            }

            // Replace variables
            $subject = self::replaceVariables($template->subject, $data);
            $body = self::replaceVariables($template->body, $data);

            // Send test email with [TEST] prefix
            Mail::html($body, function($message) use ($to, $subject) {
                $message->to($to)
                    ->subject('[TEST] ' . $subject);
            });

            return true;

        } catch (Exception $e) {
            Log::error("Failed to send test email", [
                'slug' => $slug,
                'to' => $to,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
