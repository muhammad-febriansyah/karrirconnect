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
        return in_array($role, $this->target_roles ?? []);
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
        return static::createForCompanyAdmin([
            'type' => 'application',
            'title' => 'Lamaran Baru',
            'message' => "Ada lamaran baru untuk posisi {$application->job->title}",
            'action_url' => "/company/applications/{$application->id}",
            'priority' => 'medium',
            'data' => ['application_id' => $application->id],
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
}
