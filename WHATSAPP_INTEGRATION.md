# WhatsApp Gateway Integration

Sistem notifikasi WhatsApp sudah terintegrasi dengan KarirConnect, lengkap dengan sistem template yang dapat dikelola melalui admin panel.

## Environment Setup

Pastikan `APP_WA_URL` sudah dikonfigurasi di `.env`:
```
APP_WA_URL=https://your-whatsapp-gateway-url.com/send
```

## Testing Connection

### Via API Route:
```
POST /admin/whatsapp/test-connection
```

Parameter opsional:
- `test_number` (default: 081295916567)
- `test_message` (default: pesan test dengan timestamp)

### Via Controller:
```php
$controller = new WaGatewayController();
$response = $controller->testConnection(request());
```

## Cara Menggunakan Notifikasi WhatsApp

### 1. Send WhatsApp dari Notification Model:

```php
// Create notification dan langsung kirim WhatsApp
$notification = Notification::createUserRegistrationWithWhatsApp($user);

// Atau kirim WhatsApp untuk notification yang sudah ada
$notification = Notification::find(1);
$result = $notification->sendWhatsAppToTargetRoles();
```

### 2. Send ke User Specific:

```php
$notification = Notification::find(1);
$user = User::find(1);
$result = $notification->sendWhatsAppToUser($user);
```

### 3. Send ke Phone Number:

```php
$notification = Notification::find(1);
$result = $notification->sendWhatsApp('081295916567');
```

## Available Methods

### WaGatewayController:
- `testConnection(Request $request)` - Test koneksi ke WhatsApp Gateway
- `sendNotificationWhatsApp(Notification $notification, ?string $phoneNumber)` - Kirim notifikasi ke nomor tertentu
- `sendNotificationToUser(Notification $notification, User $user)` - Kirim notifikasi ke user
- `sendWhatsAppMessage(string $number, string $message)` - Method dasar untuk kirim pesan

### Notification Model:
- `sendWhatsApp(?string $phoneNumber)` - Kirim via WhatsApp ke nomor tertentu
- `sendWhatsAppToUser(User $user)` - Kirim ke user tertentu
- `sendWhatsAppToUsersWithRole(string $role)` - Kirim ke semua user dengan role tertentu
- `sendWhatsAppToTargetRoles()` - Kirim ke semua target roles notification
- `createUserRegistrationWithWhatsApp(User $user)` - Create + auto send WhatsApp
- `createCompanyRegistrationWithWhatsApp($company)` - Create + auto send WhatsApp
- `createJobApplicationWithWhatsApp($application)` - Create + auto send WhatsApp

## WhatsApp Templates

Sistem sekarang menggunakan template yang dapat dikelola melalui admin panel di `/admin/whatsapp-templates`.

### Template Default:
- **User Registration** - Selamat datang user baru
- **Company Registration** - Notifikasi perusahaan baru
- **Job Application** - Notifikasi lamaran kerja baru  
- **System Update** - Update sistem
- **Marketing Broadcast** - Broadcast marketing
- **Alert Notification** - Notifikasi peringatan

### Template Variables:
Template mendukung variabel dinamis seperti `{user_name}`, `{company_name}`, `{job_title}`, dll.

### Template API:
- `POST /admin/whatsapp/send-with-template` - Kirim menggunakan template

## API Routes

1. `POST /admin/whatsapp/test-connection` - Test koneksi
2. `POST /admin/whatsapp/send-notification/{notification}` - Kirim notification dengan parameter phone_number
3. `POST /admin/whatsapp/send-to-user/{notification}/{user}` - Kirim notification ke user
4. `POST /admin/whatsapp/send-with-template` - Kirim menggunakan template

### WhatsApp Templates Management:
5. `GET /admin/whatsapp-templates` - List semua template
6. `GET /admin/whatsapp-templates/create` - Form create template
7. `POST /admin/whatsapp-templates` - Store template baru
8. `GET /admin/whatsapp-templates/{template}` - Show template
9. `GET /admin/whatsapp-templates/{template}/edit` - Form edit template
10. `PUT /admin/whatsapp-templates/{template}` - Update template
11. `DELETE /admin/whatsapp-templates/{template}` - Delete template
12. `POST /admin/whatsapp-templates/{template}/toggle-status` - Toggle active status
13. `POST /admin/whatsapp-templates/{template}/preview` - Preview template
14. `POST /admin/whatsapp-templates/{template}/test-send` - Test kirim template

## Format Pesan WhatsApp

Pesan akan terformat seperti:
```
🔔 *KarirConnect Notification*

*[Notification Title]*

[Notification Message]

Halo [User Name],

🔗 Link: [Action URL jika ada]

_Pesan otomatis dari KarirConnect_
30/08/2025 14:30:15
```

## Log Messages

Semua aktivitas WhatsApp akan tercatat di log dengan format:
- ✅ Sukses: `WhatsApp terkirim ke {number} | Respons: {response}`
- ❌ Error: `Gagal mengirim WA ke {number}: {error}`
- 📤 Sending: `Mengirim WhatsApp ke {number} dengan pesan: {message}`