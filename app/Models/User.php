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
        'avatar',
        'role',
        'company_id',
        'is_active',
        'last_login_at',
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
            'is_active' => 'boolean',
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

    public function isAdmin()
    {
        return in_array($this->role, ['company_admin', 'super_admin']);
    }

    public function isSuperAdmin()
    {
        return $this->role === 'super_admin';
    }

    public function isCompanyAdmin()
    {
        return $this->role === 'company_admin';
    }
}
