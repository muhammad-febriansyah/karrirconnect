# Google OAuth Setup Guide

## Overview
This guide explains how to set up Google OAuth login for the KarirConnect application.

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Set up authorized redirect URIs:
   - Development: `http://127.0.0.1:8000/auth/google/callback`
   - Production: `https://yourdomain.com/auth/google/callback`

## Step 2: Environment Configuration

Add these variables to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URL=http://127.0.0.1:8000/auth/google/callback
```

## Step 3: Features Implemented

### Database Changes
- ✅ Added `google_id` field to users table
- ✅ Added `auth_provider` field (email/google)
- ✅ Added `google_created_at` timestamp
- ✅ Proper indexing for performance

### Backend Implementation
- ✅ **GoogleAuthController** with OAuth flow handling
- ✅ **User model** with Google OAuth helper methods
- ✅ **Routes** for Google authentication
- ✅ **Automatic account linking** for existing email users
- ✅ **Role-based redirects** after login
- ✅ **Notification creation** for new user registrations

### Frontend Implementation
- ✅ **Google login buttons** in both login and register modals
- ✅ **Beautiful Google branding** with official colors and logo
- ✅ **Smooth animations** and loading states
- ✅ **Responsive design** that works on all devices

## Step 4: Authentication Flow

### New Google User
1. User clicks "Masuk dengan Google"
2. Redirected to Google OAuth
3. User authorizes the application
4. **New user created** with Google data
5. **Admin notification** sent for new user
6. **Auto-login** and redirect to user dashboard

### Existing User (Same Email)
1. User clicks "Masuk dengan Google"
2. System **links Google account** to existing email account
3. **Updates auth_provider** to 'google'
4. **Auto-login** and redirect based on role

### Returning Google User
1. User clicks "Masuk dengan Google"
2. System **recognizes user** by google_id
3. **Updates profile data** from Google
4. **Auto-login** and redirect based on role

## Step 5: Security Features

### Data Protection
- ✅ **Email verification** automatic for Google accounts
- ✅ **Profile data sync** from Google on each login
- ✅ **Secure token handling** with Laravel Socialite
- ✅ **Error logging** for debugging and monitoring

### Role-Based Access
- ✅ **User role assignment** (default: 'user')
- ✅ **Admin dashboard** redirect for admin roles
- ✅ **User dashboard** redirect for regular users
- ✅ **Intended URL redirect** after login

## Step 6: User Experience

### Login Modal Updates
- ✅ **"Masuk dengan Google" button** with official Google styling
- ✅ **Divider** with "atau" text between login methods
- ✅ **Consistent design** with existing form elements
- ✅ **Loading states** and disabled buttons

### Register Modal Updates
- ✅ **"Daftar dengan Google" button** for registration
- ✅ **Same styling consistency** as login modal
- ✅ **Automatic account creation** without forms

## Step 7: Testing

### Test Scenarios
1. ✅ **New user registration** via Google
2. ✅ **Existing user linking** (same email)
3. ✅ **Returning user login** via Google
4. ✅ **Error handling** for OAuth failures
5. ✅ **Role-based redirects** after login
6. ✅ **Admin notifications** for new users

### Test Accounts
- Create test Google accounts or use existing ones
- Verify role-based redirects work correctly
- Test error scenarios (OAuth cancellation, etc.)

## Step 8: Production Deployment

### Environment Setup
```env
GOOGLE_CLIENT_ID=production-client-id
GOOGLE_CLIENT_SECRET=production-client-secret
GOOGLE_REDIRECT_URL=https://yourdomain.com/auth/google/callback
```

### Domain Verification
- Add production domain to Google OAuth settings
- Update redirect URIs in Google Console
- Test OAuth flow on production environment

## API Endpoints

```php
// Routes available
GET  /auth/google              - Redirect to Google OAuth
GET  /auth/google/callback     - Handle OAuth callback
GET  /auth/google/url          - Get OAuth URL (AJAX)
```

## Database Schema

```sql
-- Users table additions
google_id           VARCHAR(255) NULL
auth_provider       VARCHAR(255) DEFAULT 'email'
google_created_at   TIMESTAMP NULL

-- Indexes
INDEX (google_id)
INDEX (auth_provider)
```

## Error Handling

### Common Issues
1. **Invalid credentials** → Check .env configuration
2. **Redirect URI mismatch** → Verify Google Console settings
3. **Domain not authorized** → Add domain to OAuth consent screen
4. **API not enabled** → Enable Google+ API in Console

### Logging
- All OAuth errors are logged to `storage/logs/laravel.log`
- User creation/login events are logged for monitoring
- Failed OAuth attempts are tracked for security

## Success Indicators

### Visual Confirmations
- ✅ Google login buttons appear in modals
- ✅ Buttons have correct Google branding and colors
- ✅ Smooth redirects to Google OAuth
- ✅ Successful login redirects to appropriate dashboard
- ✅ User profile shows Google avatar
- ✅ Admin receives notifications for new Google users

### Database Confirmations
- ✅ New users have `auth_provider = 'google'`
- ✅ Google ID is stored and indexed
- ✅ Profile data synced from Google
- ✅ Timestamps are properly set

**Status: ✅ IMPLEMENTATION COMPLETE**

Google OAuth login is now fully functional with beautiful UI, secure backend, and comprehensive error handling!