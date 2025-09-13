<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class WhatsappTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'title',
        'message',
        'type',
        'variables',
        'description',
        'is_active',
        'use_emoji',
        'include_timestamp',
        'include_signature',
        'signature_text',
    ];

    protected function casts(): array
    {
        return [
            'variables' => 'array',
            'is_active' => 'boolean',
            'use_emoji' => 'boolean',
            'include_timestamp' => 'boolean',
            'include_signature' => 'boolean',
        ];
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // Methods
    public function render(array $data = []): string
    {
        $message = $this->message;

        // Replace variables in message
        if (!empty($this->variables) && !empty($data)) {
            foreach ($this->variables as $variable) {
                $placeholder = '{' . $variable . '}';
                if (isset($data[$variable])) {
                    $message = str_replace($placeholder, $data[$variable], $message);
                }
            }
        }

        // Add emoji prefix if enabled
        if ($this->use_emoji) {
            $emoji = $this->getEmojiForType();
            $message = "{$emoji} *KarirConnect*\n\n" . $message;
        }

        // Add title if exists
        if ($this->title) {
            $titleText = $this->title;
            // Replace variables in title
            if (!empty($this->variables) && !empty($data)) {
                foreach ($this->variables as $variable) {
                    $placeholder = '{' . $variable . '}';
                    if (isset($data[$variable])) {
                        $titleText = str_replace($placeholder, $data[$variable], $titleText);
                    }
                }
            }
            $message .= "\n\n*{$titleText}*";
        }

        // Add action URL if provided
        if (isset($data['action_url'])) {
            $baseUrl = config('app.url');
            $fullUrl = $baseUrl . $data['action_url'];
            $message .= "\n\n🔗 Link: {$fullUrl}";
        }

        // Add signature if enabled
        if ($this->include_signature) {
            $message .= "\n\n{$this->signature_text}";
        }

        // Add timestamp if enabled
        if ($this->include_timestamp) {
            $message .= "\n" . now()->format('d/m/Y H:i:s');
        }

        return $message;
    }

    private function getEmojiForType(): string
    {
        return match($this->type) {
            'notification' => '🔔',
            'marketing' => '📢',
            'system' => '🔧',
            'alert' => '⚠️',
            default => '📱'
        };
    }

    // Static methods for getting specific templates
    public static function getUserRegistrationTemplate(): ?self
    {
        return static::active()->where('slug', 'user-registration')->first();
    }

    public static function getCompanyRegistrationTemplate(): ?self
    {
        return static::active()->where('slug', 'company-registration')->first();
    }

    public static function getJobApplicationTemplate(): ?self
    {
        return static::active()->where('slug', 'job-application')->first();
    }

    public static function getSystemUpdateTemplate(): ?self
    {
        return static::active()->where('slug', 'system-update')->first();
    }

    public static function getPaymentSuccessTemplate(): ?self
    {
        return static::active()->where('slug', 'payment-success')->first();
    }

    public static function getPaymentFailedTemplate(): ?self
    {
        return static::active()->where('slug', 'payment-failed')->first();
    }

    // Boot method to auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($template) {
            if (empty($template->slug)) {
                $template->slug = Str::slug($template->name);
            }
        });

        static::updating(function ($template) {
            if ($template->isDirty('name')) {
                $template->slug = Str::slug($template->name);
            }
        });
    }
}
