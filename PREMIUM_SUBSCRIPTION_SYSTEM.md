# Premium Company Subscription System

## Overview
Sistem subscription premium untuk perusahaan dengan 4 tiers: Free, Basic, Premium, dan Enterprise.

## ✅ Yang Sudah Diimplementasikan

### 1. Database & Migrations
- ✅ `subscription_plans` table - Menyimpan paket subscription
- ✅ `company_subscriptions` table - Track subscription perusahaan
- ✅ `message_templates` table - Template email/message

### 2. Models
- ✅ `SubscriptionPlan` - Model untuk paket subscription
  - Methods: `hasUnlimitedJobPostings()`, `getYearlyDiscountAttribute()`
  - Scopes: `active()`
  
- ✅ `CompanySubscription` - Model untuk subscription perusahaan
  - Methods: `isActive()`, `isExpired()`, `isExpiringSoon()`, `cancel()`, `renew()`
  - Attributes: `days_remaining`
  - Scopes: `active()`, `expiringSoon()`

- ✅ `Company` - Extended dengan subscription methods
  - `hasPremiumSubscription()` - Check if has active subscription
  - `getCurrentPlan()` - Get current subscription plan
  - `canAutoPromote()` - Check if can auto-promote jobs
  - `hasPremiumBadge()` - Check if has premium badge
  - `hasAnalyticsAccess()` - Check if has analytics access
  - `canPostMoreJobs()` - Check posting limits
  - `getRemainingJobPostsAttribute()` - Get remaining posts

### 3. Subscription Plans
Sudah di-seed dengan 4 paket:

#### Free Plan
- **Price**: Rp 0
- **Features**:
  - 3 job postings aktif
  - 5 job invitations
  - Akses talent database terbatas
  - Email support

#### Basic Plan
- **Price**: Rp 299,000/month atau Rp 2,990,000/year (16% discount)
- **Features**:
  - 10 job postings aktif
  - 2 featured jobs per month
  - 20 job invitations
  - Analytics dashboard basic
  - Full talent database access
  - Priority listing

#### Premium Plan ⭐
- **Price**: Rp 799,000/month atau Rp 7,990,000/year (16% discount)
- **Features**:
  - 30 job postings aktif
  - 10 featured jobs per month
  - 100 job invitations
  - **Auto-promote to top of search** 🚀
  - **Premium company badge** ⭐
  - Advanced analytics
  - Priority support 24/7
  - Dedicated account manager
  - Custom branding

#### Enterprise Plan 🏢
- **Price**: Rp 1,999,000/month atau Rp 19,990,000/year (16% discount)
- **Features**:
  - **Unlimited job postings** 
  - **Unlimited featured jobs**
  - **Unlimited job invitations**
  - **Auto-promote to top of search** 🚀
  - **Premium company badge** ⭐
  - Enterprise analytics with AI matching
  - Priority support 24/7
  - Dedicated account manager
  - Custom branding
  - API access
  - Bulk upload candidates
  - Custom workflows
  - White-label career page

## 📝 Yang Perlu Dilengkapi

### 1. Controllers & Routes
- [ ] `CompanySubscriptionController` - Manage subscriptions
  - `index()` - List available plans
  - `subscribe()` - Subscribe to a plan
  - `cancel()` - Cancel subscription
  - `renew()` - Renew subscription
  - `upgrade()` - Upgrade plan
  - `downgrade()` - Downgrade plan

### 2. Payment Integration
- [ ] Integrate dengan payment gateway (Midtrans/Xendit)
- [ ] Handle payment callbacks
- [ ] Auto-activate subscription after payment
- [ ] Send email confirmation

### 3. Auto-Promote Feature
- [ ] Update `JobListing` model dengan `promoted_at` field
- [ ] Scheduler untuk auto-promote premium company jobs
- [ ] Query scope untuk prioritize premium jobs in search

### 4. Frontend UI
- [ ] Halaman pricing plans
- [ ] Subscription management dashboard
- [ ] Payment flow
- [ ] Premium badge display
- [ ] Analytics dashboard (premium only)

### 5. Background Jobs
- [ ] Check expired subscriptions daily
- [ ] Send renewal reminders (7 days before expiry)
- [ ] Auto-downgrade to free tier after expiry
- [ ] Renewal notifications

## 🔧 Cara Pakai

### Check Subscription Status
```php
$company = Company::find(1);

// Check if has premium
if ($company->hasPremiumSubscription()) {
    // Premium features
}

// Get current plan
$plan = $company->getCurrentPlan();
echo $plan->name; // "Premium"

// Check specific features
if ($company->canAutoPromote()) {
    // Auto promote jobs
}

if ($company->hasPremiumBadge()) {
    // Show badge
}
```

### Create Subscription
```php
$company = Company::find(1);
$plan = SubscriptionPlan::where('slug', 'premium')->first();

$subscription = CompanySubscription::create([
    'company_id' => $company->id,
    'subscription_plan_id' => $plan->id,
    'status' => 'active',
    'start_date' => now(),
    'end_date' => now()->addMonth(),
    'billing_cycle' => 'monthly',
    'amount_paid' => $plan->price_monthly,
]);
```

### Cancel Subscription
```php
$subscription = $company->activeSubscription;
$subscription->cancel('User requested cancellation');
```

## 🎯 Next Steps

1. **Priority 1**: Implement payment gateway integration
2. **Priority 2**: Create subscription management UI
3. **Priority 3**: Implement auto-promote feature for jobs
4. **Priority 4**: Build analytics dashboard for premium users
5. **Priority 5**: Add automated renewal and notification system

## 📊 Database Schema

### subscription_plans
```sql
- id
- name (varchar)
- slug (varchar, unique)
- description (text)
- price_monthly (decimal)
- price_yearly (decimal)
- job_posting_limit (int, nullable=unlimited)
- featured_job_limit (int, nullable=unlimited)
- auto_promote (boolean)
- premium_badge (boolean)
- analytics_access (boolean)
- priority_support (boolean)
- talent_database_access (boolean)
- job_invitation_limit (int, nullable=unlimited)
- features (json)
- is_active (boolean)
- sort_order (int)
- timestamps
```

### company_subscriptions
```sql
- id
- company_id (foreign key)
- subscription_plan_id (foreign key)
- status (enum: active, expired, cancelled, pending)
- start_date (date)
- end_date (date)
- billing_cycle (enum: monthly, yearly)
- amount_paid (decimal)
- payment_method (varchar)
- transaction_id (varchar)
- auto_renew (boolean)
- cancelled_at (timestamp)
- cancellation_reason (text)
- timestamps
```

## 📧 Email Templates

Sistem email template sudah ada lengkap untuk:
- ✅ Employer registration
- ✅ Payment notification
- ✅ New application received
- ✅ Chat notifications
- ✅ Job invitation accepted
- ✅ Verification reminders
- ✅ Employee registration
- ✅ Application status updates

