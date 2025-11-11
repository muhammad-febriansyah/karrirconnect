<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'message',
        'target_roles',
        'target_user_id',
        'data',
        'action_url',
        'priority',
        'read_at',
        'is_global',
        'created_by',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'target_roles' => 'array',
            'data' => 'array',
            'read_at' => 'datetime',
            'is_global' => 'boolean',
            'is_active' => 'boolean',
            'target_user_id' => 'integer',
        ];
    }

    // Relations
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForRole($query, string $role)
    {
        return $query->whereJsonContains('target_roles', $role);
    }

    public function scopeVisibleTo($query, User $user)
    {
        return $query->where(function ($visibilityQuery) use ($user) {
            $visibilityQuery
                ->where(function ($roleQuery) use ($user) {
                    $roleQuery
                        ->whereNull('target_user_id')
                        ->whereJsonContains('target_roles', $user->role);
                })
                ->orWhere('target_user_id', $user->id);
        });
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // Mutators & Accessors
    public function getIsReadAttribute(): bool
    {
        return !is_null($this->read_at);
    }

    public function getTimeAgoAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    // Methods
    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function isForRole(string $role): bool
    {
        if ($this->target_user_id !== null) {
            return false;
        }

        return in_array($role, $this->target_roles ?? []);
    }

    public function isAccessibleBy(User $user): bool
    {
        if ($this->target_user_id !== null) {
            return $this->target_user_id === $user->id;
        }

        return in_array($user->role, $this->target_roles ?? []);
    }

    // Static methods for creating different types of notifications
    public static function createForAdmin(array $data): self
    {
        return static::create(array_merge($data, [
            'target_roles' => ['super_admin'],
        ]));
    }

    public static function createForCompanyAdmin(array $data): self
    {
        return static::create(array_merge($data, [
            'target_roles' => ['company_admin'],
        ]));
    }

    public static function createForAllAdmins(array $data): self
    {
        return static::create(array_merge($data, [
            'target_roles' => ['super_admin', 'company_admin'],
        ]));
    }

    public static function createUserRegistration(User $user): self
    {
        return static::createForAllAdmins([
            'type' => 'user',
            'title' => 'Pengguna Baru',
            'message' => "{$user->name} mendaftar sebagai pencari kerja",
            'action_url' => "/admin/users/{$user->id}",
            'priority' => 'medium',
            'data' => ['user_id' => $user->id],
        ]);
    }

    public static function createCompanyRegistration($company): self
    {
        return static::createForAdmin([
            'type' => 'company',
            'title' => 'Perusahaan Baru',
            'message' => "{$company->name} mengajukan verifikasi",
            'action_url' => "/admin/companies/{$company->id}",
            'priority' => 'high',
            'data' => ['company_id' => $company->id],
        ]);
    }

    public static function createJobApplication($application): self
    {
        $application->load(['jobListing', 'user']);
        
        return static::createForCompanyAdmin([
            'type' => 'application',
            'title' => 'Lamaran Baru',
            'message' => "{$application->user->name} melamar untuk posisi {$application->jobListing->title}",
            'action_url' => "/company/applications/{$application->id}",
            'priority' => 'medium',
            'data' => [
                'application_id' => $application->id,
                'user_id' => $application->user->id,
                'job_id' => $application->jobListing->id
            ],
        ]);
    }

    public static function createSystemUpdate(string $version, string $description): self
    {
        return static::createForAllAdmins([
            'type' => 'system',
            'title' => 'Pembaruan Sistem',
            'message' => "Sistem berhasil diperbarui ke versi {$version}. {$description}",
            'priority' => 'low',
            'data' => ['version' => $version],
        ]);
    }

    public function sendWhatsApp(?string $phoneNumber = null): array
    {
        try {
            $controller = new \App\Http\Controllers\WaGatewayController();
            $response = $controller->sendNotificationWhatsApp($this, $phoneNumber);
            
            return [
                'success' => $response->getStatusCode() === 200,
                'response' => $response->getData(true)
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function sendWhatsAppToUser(User $user): array
    {
        try {
            $controller = new \App\Http\Controllers\WaGatewayController();
            $response = $controller->sendNotificationToUser($this, $user);
            
            return [
                'success' => $response->getStatusCode() === 200,
                'response' => $response->getData(true)
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function sendWhatsAppToUsersWithRole(string $role): array
    {
        $results = [];
        $users = User::where('role', $role)->whereNotNull('phone_number')->get();
        
        foreach ($users as $user) {
            $results[] = $this->sendWhatsAppToUser($user);
        }
        
        return $results;
    }

    public function sendWhatsAppToTargetRoles(): array
    {
        $results = [];
        
        if (!empty($this->target_roles)) {
            foreach ($this->target_roles as $role) {
                $roleResults = $this->sendWhatsAppToUsersWithRole($role);
                $results = array_merge($results, $roleResults);
            }
        }
        
        return $results;
    }

    public static function createUserRegistrationWithWhatsApp(User $user): self
    {
        $notification = static::createUserRegistration($user);
        
        $notification->sendWhatsAppToTargetRoles();
        
        return $notification;
    }

    public static function createCompanyRegistrationWithWhatsApp($company): self
    {
        $notification = static::createCompanyRegistration($company);
        
        $notification->sendWhatsAppToTargetRoles();
        
        return $notification;
    }

    public static function createJobApplicationWithWhatsApp($application): self
    {
        $notification = static::createJobApplication($application);
        
        $notification->sendWhatsAppToTargetRoles();
        
        return $notification;
    }
}
