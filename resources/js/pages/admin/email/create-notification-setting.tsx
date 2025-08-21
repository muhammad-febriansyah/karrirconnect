import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Bell, Mail, MessageSquare, Smartphone, Users } from 'lucide-react';

export default function CreateNotificationSetting() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [isUserConfigurable, setIsUserConfigurable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    router.post(route('admin.email.store-notification-setting'), {
      name,
      description,
      email_enabled: emailEnabled,
      sms_enabled: smsEnabled,
      push_enabled: pushEnabled,
      is_user_configurable: isUserConfigurable,
    }, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  const commonSettings = [
    {
      name: 'New Job Application',
      description: 'Notify when a new job application is received',
      email: true,
      sms: false,
      push: true,
      userConfig: false,
    },
    {
      name: 'Application Status Update',
      description: 'Notify applicants when their application status changes',
      email: true,
      sms: true,
      push: true,
      userConfig: true,
    },
    {
      name: 'New Job Posting',
      description: 'Notify users about new job opportunities',
      email: true,
      sms: false,
      push: true,
      userConfig: true,
    },
    {
      name: 'Weekly Newsletter',
      description: 'Weekly digest of platform activities',
      email: true,
      sms: false,
      push: false,
      userConfig: true,
    },
    {
      name: 'Account Security Alert',
      description: 'Security-related notifications (login, password changes)',
      email: true,
      sms: true,
      push: true,
      userConfig: false,
    },
  ];

  const useTemplate = (template: any) => {
    setName(template.name);
    setDescription(template.description);
    setEmailEnabled(template.email);
    setSmsEnabled(template.sms);
    setPushEnabled(template.push);
    setIsUserConfigurable(template.userConfig);
  };

  return (
    <AppLayout>
      <Head title="Buat Pengaturan Notifikasi" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.get(route('admin.email.notification-settings'))}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Pengaturan
          </Button>
          <h1 className="text-2xl font-bold">Buat Pengaturan Notifikasi</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Setting Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Setting Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., New Job Application"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe when this notification should be sent..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className={`h-5 w-5 ${emailEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={emailEnabled}
                      onCheckedChange={setEmailEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className={`h-5 w-5 ${smsEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Send notifications via text message</p>
                      </div>
                    </div>
                    <Switch
                      checked={smsEnabled}
                      onCheckedChange={setSmsEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className={`h-5 w-5 ${pushEnabled ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-600">Send browser/app push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={pushEnabled}
                      onCheckedChange={setPushEnabled}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className={`h-5 w-5 ${isUserConfigurable ? 'text-orange-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-medium">Allow User Configuration</p>
                        <p className="text-sm text-gray-600">
                          Users can enable/disable this notification in their settings
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isUserConfigurable}
                      onCheckedChange={setIsUserConfigurable}
                    />
                  </div>
                  
                  {!isUserConfigurable && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
                      <p className="text-sm text-amber-800">
                        <strong>System Setting:</strong> This notification will be sent to all applicable users 
                        and cannot be disabled by individual users. Use for critical notifications only.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Setting'}
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commonSettings.map((template, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => useTemplate(template)}
                      >
                        Use
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                    <div className="flex items-center gap-2">
                      {template.email && <Mail className="h-3 w-3 text-green-600" title="Email" />}
                      {template.sms && <MessageSquare className="h-3 w-3 text-blue-600" title="SMS" />}
                      {template.push && <Smartphone className="h-3 w-3 text-purple-600" title="Push" />}
                      {template.userConfig && <Users className="h-3 w-3 text-orange-600" title="User Configurable" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <strong>Naming:</strong>
                  <ul className="text-gray-600 mt-1 space-y-1 list-disc list-inside">
                    <li>Use clear, descriptive names</li>
                    <li>Follow consistent naming patterns</li>
                    <li>Avoid technical jargon</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Channels:</strong>
                  <ul className="text-gray-600 mt-1 space-y-1 list-disc list-inside">
                    <li>Email for detailed information</li>
                    <li>SMS for urgent notifications</li>
                    <li>Push for real-time updates</li>
                  </ul>
                </div>

                <div>
                  <strong>User Control:</strong>
                  <ul className="text-gray-600 mt-1 space-y-1 list-disc list-inside">
                    <li>Marketing: Always user configurable</li>
                    <li>Transactional: Usually system controlled</li>
                    <li>Security: Never user configurable</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Current Settings Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong>Name:</strong> {name || 'Not set'}
                  </div>
                  {description && (
                    <div>
                      <strong>Description:</strong> {description}
                    </div>
                  )}
                  <div>
                    <strong>Channels:</strong>
                    <div className="flex gap-2 mt-1">
                      {emailEnabled && <Mail className="h-4 w-4 text-green-600" title="Email" />}
                      {smsEnabled && <MessageSquare className="h-4 w-4 text-blue-600" title="SMS" />}
                      {pushEnabled && <Smartphone className="h-4 w-4 text-purple-600" title="Push" />}
                      {!emailEnabled && !smsEnabled && !pushEnabled && (
                        <span className="text-sm text-gray-500">No channels selected</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className={`h-4 w-4 ${isUserConfigurable ? 'text-orange-600' : 'text-gray-400'}`} />
                    <span className="text-sm">
                      {isUserConfigurable ? 'User Configurable' : 'System Setting'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}