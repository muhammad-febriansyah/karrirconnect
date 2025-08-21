import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Plus, Edit, Mail, MessageSquare, Smartphone, Users, Settings } from 'lucide-react';

interface NotificationSetting {
  id: number;
  name: string;
  slug: string;
  description?: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  is_user_configurable: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  settings: NotificationSetting[];
}

export default function NotificationSettings({ settings }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    email_enabled: false,
    sms_enabled: false,
    push_enabled: false,
    is_user_configurable: false,
  });

  const startEdit = (setting: NotificationSetting) => {
    setEditingId(setting.id);
    setEditForm({
      name: setting.name,
      description: setting.description || '',
      email_enabled: setting.email_enabled,
      sms_enabled: setting.sms_enabled,
      push_enabled: setting.push_enabled,
      is_user_configurable: setting.is_user_configurable,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      description: '',
      email_enabled: false,
      sms_enabled: false,
      push_enabled: false,
      is_user_configurable: false,
    });
  };

  const saveEdit = (settingId: number) => {
    router.patch(route('admin.email.update-notification-setting', settingId), editForm, {
      onSuccess: () => {
        setEditingId(null);
      },
    });
  };

  const quickToggle = (settingId: number, field: string, value: boolean) => {
    router.patch(route('admin.email.update-notification-setting', settingId), {
      [field]: value,
    });
  };

  return (
    <AppLayout>
      <Head title="Pengaturan Notifikasi" />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pengaturan Notifikasi</h1>
          <Link href={route('admin.email.create-notification-setting')}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Pengaturan
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pengaturan</p>
                  <p className="text-2xl font-bold">{settings.length}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Email Aktif</p>
                  <p className="text-2xl font-bold text-green-600">
                    {settings.filter(s => s.email_enabled).length}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Push Aktif</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {settings.filter(s => s.push_enabled).length}
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">User Dapat Konfigurasi</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {settings.filter(s => s.is_user_configurable).length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          {settings.map((setting) => (
            <Card key={setting.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{setting.name}</CardTitle>
                    {setting.description && (
                      <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {setting.slug}
                      </Badge>
                      {setting.is_user_configurable && (
                        <Badge variant="secondary" className="text-xs">
                          User Configurable
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editingId === setting.id ? cancelEdit() : startEdit(setting)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {editingId === setting.id ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {editingId === setting.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({...prev, name: e.target.value}))}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Deskripsi</label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                        className="mt-1"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-green-600" />
                          <label className="text-sm font-medium">Email</label>
                        </div>
                        <Switch
                          checked={editForm.email_enabled}
                          onCheckedChange={(checked) => setEditForm(prev => ({...prev, email_enabled: checked}))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          <label className="text-sm font-medium">SMS</label>
                        </div>
                        <Switch
                          checked={editForm.sms_enabled}
                          onCheckedChange={(checked) => setEditForm(prev => ({...prev, sms_enabled: checked}))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-purple-600" />
                          <label className="text-sm font-medium">Push</label>
                        </div>
                        <Switch
                          checked={editForm.push_enabled}
                          onCheckedChange={(checked) => setEditForm(prev => ({...prev, push_enabled: checked}))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-orange-600" />
                          <label className="text-sm font-medium">Konfigurasi User</label>
                        </div>
                        <Switch
                          checked={editForm.is_user_configurable}
                          onCheckedChange={(checked) => setEditForm(prev => ({...prev, is_user_configurable: checked}))}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => saveEdit(setting.id)}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={cancelEdit}>
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className={`h-4 w-4 ${setting.email_enabled ? 'text-green-600' : 'text-gray-400'}`} />
                          <label className="text-sm font-medium">Notifikasi Email</label>
                        </div>
                        <Switch
                          checked={setting.email_enabled}
                          onCheckedChange={(checked) => quickToggle(setting.id, 'email_enabled', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className={`h-4 w-4 ${setting.sms_enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                          <label className="text-sm font-medium">Notifikasi SMS</label>
                        </div>
                        <Switch
                          checked={setting.sms_enabled}
                          onCheckedChange={(checked) => quickToggle(setting.id, 'sms_enabled', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className={`h-4 w-4 ${setting.push_enabled ? 'text-purple-600' : 'text-gray-400'}`} />
                          <label className="text-sm font-medium">Notifikasi Push</label>
                        </div>
                        <Switch
                          checked={setting.push_enabled}
                          onCheckedChange={(checked) => quickToggle(setting.id, 'push_enabled', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className={`h-4 w-4 ${setting.is_user_configurable ? 'text-orange-600' : 'text-gray-400'}`} />
                          <label className="text-sm font-medium">User Dapat Konfigurasi</label>
                        </div>
                        <Switch
                          checked={setting.is_user_configurable}
                          onCheckedChange={(checked) => quickToggle(setting.id, 'is_user_configurable', checked)}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 pt-2 border-t">
                      <p>Dibuat: {new Date(setting.created_at).toLocaleString()}</p>
                      <p>Terakhir diperbarui: {new Date(setting.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {settings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Tidak ada pengaturan notifikasi ditemukan</h3>
              <p className="text-gray-600 mb-4">
                Mulai dengan membuat pengaturan notifikasi pertama Anda.
              </p>
              <Link href={route('admin.email.create-notification-setting')}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pengaturan
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Types Explained
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong className="text-green-600">Email Notifications:</strong>
              <p className="text-gray-600">Sent via email to user's registered email address.</p>
            </div>
            <div>
              <strong className="text-blue-600">SMS Notifications:</strong>
              <p className="text-gray-600">Sent as text messages to user's phone number (requires SMS service).</p>
            </div>
            <div>
              <strong className="text-purple-600">Push Notifications:</strong>
              <p className="text-gray-600">Browser/app push notifications for real-time alerts.</p>
            </div>
            <div>
              <strong className="text-orange-600">User Configurable:</strong>
              <p className="text-gray-600">When enabled, users can customize this notification preference in their settings.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}