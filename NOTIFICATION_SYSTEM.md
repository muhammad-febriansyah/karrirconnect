# Sistem Notifikasi Role-Based

## Overview
Sistem notifikasi yang dibedakan berdasarkan role user untuk memastikan setiap admin hanya melihat notifikasi yang relevan dengan perannya.

## Features

### 1. **Role-Based Filtering**
- **Super Admin**: Melihat semua jenis notifikasi (user registrations, system updates, company verifications, dll.)
- **Company Admin**: Melihat notifikasi terkait perusahaan (job applications, company-related notifications)
- **Dynamic Filtering**: Notifikasi dapat ditargetkan ke satu atau multiple roles

### 2. **Priority Levels**
- **Urgent**: Notifikasi penting yang perlu immediate action (warna merah)
- **High**: Notifikasi dengan prioritas tinggi (warna orange) 
- **Medium**: Notifikasi standard (warna kuning)
- **Low**: Notifikasi informasi (warna abu-abu)

### 3. **Real-time Updates**
- Auto-refresh notifikasi setiap 30 detik
- Hot module reload untuk development
- Unread count badge di navbar

### 4. **Interactive Features**
- Click notifikasi untuk navigasi ke action URL
- Mark as read otomatis saat diklik
- Mark all as read button
- Priority badges

## Database Schema

### Table: `notifications`
```sql
- id: bigint (PK)
- type: varchar (user|company|application|system|finance|content)
- title: varchar
- message: text
- target_roles: json (['super_admin', 'company_admin'])
- data: json (additional data)
- action_url: varchar (URL untuk redirect)
- priority: enum (low|medium|high|urgent)
- read_at: timestamp
- is_global: boolean
- created_by: bigint (FK users)
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp
```

## Implementation

### 1. **Model & Relationships**
```php
// app/Models/Notification.php
class Notification extends Model {
    // Scopes for filtering
    public function scopeForRole($query, string $role)
    public function scopeUnread($query)
    public function scopeByPriority($query, string $priority)
    
    // Helper methods
    public function markAsRead(): void
    public function isForRole(string $role): bool
    
    // Static factory methods
    public static function createForAdmin(array $data): self
    public static function createForCompanyAdmin(array $data): self
    public static function createUserRegistration(User $user): self
}
```

### 2. **Controller & API Endpoints**
```php
// app/Http/Controllers/NotificationController.php

// Routes (admin.php):
GET    /admin/notifications                    - Get user's notifications
POST   /admin/notifications/{id}/mark-as-read - Mark single as read
POST   /admin/notifications/mark-all-as-read  - Mark all as read
POST   /admin/notifications                   - Create notification (admin only)
GET    /admin/notifications/statistics        - Get statistics (super admin only)
```

### 3. **React Component**
```typescript
// resources/js/components/notifications.tsx

interface Notification {
    id: string;
    type: 'user' | 'company' | 'application' | 'system' | 'finance' | 'content';
    title: string;
    message: string;
    time: Date;
    read: boolean;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    action_url?: string;
}

// Features:
- Real-time polling (30s interval)
- Role-based filtering
- Priority visualization
- Interactive click handling
- Mark as read functionality
```

## Usage Examples

### Creating Notifications

#### 1. User Registration (untuk semua admin)
```php
Notification::createUserRegistration($user);
// Target: ['super_admin', 'company_admin']
```

#### 2. Company Registration (hanya super admin)
```php
Notification::createCompanyRegistration($company);
// Target: ['super_admin']
```

#### 3. Job Application (hanya company admin)
```php
Notification::createJobApplication($application);
// Target: ['company_admin']
```

#### 4. System Update (semua admin)
```php
Notification::createSystemUpdate('2.1.0', 'New features added');
// Target: ['super_admin', 'company_admin']
```

#### 5. Custom Notification
```php
Notification::create([
    'type' => 'finance',
    'title' => 'Payment Received',
    'message' => 'Payment of $500 received from Company XYZ',
    'target_roles' => ['super_admin'],
    'priority' => 'high',
    'action_url' => '/admin/payments/123',
]);
```

### Querying Notifications

```php
// Get notifications for current user role
$notifications = Notification::active()
    ->forRole(auth()->user()->role)
    ->orderBy('created_at', 'desc')
    ->get();

// Get unread count
$unreadCount = Notification::active()
    ->forRole(auth()->user()->role)
    ->unread()
    ->count();

// Get high priority notifications
$urgentNotifications = Notification::active()
    ->forRole(auth()->user()->role)
    ->byPriority('urgent')
    ->get();
```

## Benefits

### 1. **Improved User Experience**
- ✅ Clean, relevant notifications per role
- ✅ No information overload
- ✅ Priority-based visual cues
- ✅ Interactive navigation

### 2. **Better Security**  
- ✅ Role-based access control
- ✅ Proper authorization checks
- ✅ Data isolation per role

### 3. **Scalability**
- ✅ Easy to add new notification types
- ✅ Flexible targeting system
- ✅ Extensible priority system

### 4. **Maintainability**
- ✅ Centralized notification logic
- ✅ Factory methods for common types
- ✅ Clean separation of concerns

## Testing

### Test Users Created:
```
Super Admin: superadmin@test.com / password123
Company Admin: companyadmin@test.com / password123
```

### Test Scenarios:
1. ✅ Login sebagai super admin → see all notification types
2. ✅ Login sebagai company admin → see only company-related notifications  
3. ✅ Click notification → navigate to action URL + mark as read
4. ✅ Priority badges → display correctly based on priority level
5. ✅ Real-time updates → polling works every 30 seconds

## Future Enhancements

### Potential Features:
1. **Browser Push Notifications** - Real-time push to browser
2. **Email Notifications** - Send email for urgent notifications
3. **Notification Templates** - Reusable notification templates
4. **Notification History** - Archive and search old notifications
5. **Notification Settings** - User preferences for notification types
6. **WebSocket Integration** - Real-time updates instead of polling

### Additional Roles:
```typescript
// Future roles
'hr_manager'     // HR-specific notifications
'recruiter'      // Recruiter-specific notifications  
'content_admin'  // Content management notifications
'finance_admin'  // Financial notifications
```

## Status: ✅ **COMPLETED**

- ✅ Database schema & migrations
- ✅ Model with relationships & scopes
- ✅ Controller with full CRUD API
- ✅ React component with role-based filtering
- ✅ Priority system with visual indicators
- ✅ Real-time polling & updates
- ✅ Sample data & test users
- ✅ Complete documentation

**Result**: Super Admin dan Company Admin sekarang melihat notifikasi yang berbeda sesuai dengan role mereka masing-masing.