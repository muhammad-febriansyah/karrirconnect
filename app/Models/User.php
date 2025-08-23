<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'auth_provider',
        'google_created_at',
        'role',
        'company_id',
        'is_active',
        'last_login_at',
        'verification_status',
        'verification_documents',
        'verification_notes',
        'verified_by',
        'verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'google_created_at' => 'datetime',
            'is_active' => 'boolean',
            'verification_documents' => 'array',
            'verified_at' => 'datetime',
        ];
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'user_skill')
            ->withPivot('proficiency_level', 'years_of_experience')
            ->withTimestamps();
    }

    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function applications()
    {
        return $this->jobApplications();
    }

    public function savedJobs()
    {
        return $this->belongsToMany(JobListing::class, 'saved_jobs')
            ->withTimestamps();
    }

    public function createdJobs()
    {
        return $this->hasMany(JobListing::class, 'created_by');
    }

    public function reviewedApplications()
    {
        return $this->hasMany(JobApplication::class, 'reviewed_by');
    }

    public function activityLogs()
    {
        return $this->hasMany(UserActivityLog::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function verifiedUsers()
    {
        return $this->hasMany(User::class, 'verified_by');
    }

    public function userProfile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function isAdmin()
    {
        return in_array($this->role, ['company_admin', 'super_admin']);
    }

    public function isSuperAdmin()
    {
        return $this->role === 'super_admin';
    }

    // Google OAuth helper methods
    public function isGoogleUser(): bool
    {
        return $this->auth_provider === 'google' && !empty($this->google_id);
    }

    public function isEmailUser(): bool
    {
        return $this->auth_provider === 'email';
    }

    public function hasPassword(): bool
    {
        return !empty($this->password);
    }

    public static function findByGoogleId(string $googleId): ?self
    {
        return static::where('google_id', $googleId)->first();
    }

    public static function createFromGoogle($googleUser): self
    {
        return static::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'avatar' => $googleUser->getAvatar(),
            'auth_provider' => 'google',
            'google_created_at' => now(),
            'email_verified_at' => now(), // Google accounts are pre-verified
            'role' => 'user', // Default role for Google registrations
            'is_active' => true,
        ]);
    }

    public function isCompanyAdmin()
    {
        return $this->role === 'company_admin';
    }
}
