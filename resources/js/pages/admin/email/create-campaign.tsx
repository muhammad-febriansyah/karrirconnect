import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Send, Users, Calendar, Eye } from 'lucide-react';
import { route } from 'ziggy-js';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  type: string;
}

interface Props {
  templates: EmailTemplate[];
}

export default function CreateEmailCampaign({ templates }: Props) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('none');
  const [scheduledAt, setScheduledAt] = useState('');
  const [recipientCriteria, setRecipientCriteria] = useState({
    role: 'all',
    is_active: 'all',
    verification_status: 'all',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewRecipients, setPreviewRecipients] = useState(0);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId !== 'none') {
      const template = templates.find(t => t.id.toString() === templateId);
      if (template) {
        setSubject(template.subject);
        setContent(template.body);
      }
    } else {
      setSubject('');
      setContent('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    router.post(route('admin.email.store-campaign'), {
      name,
      subject,
      content,
      recipient_criteria: {
        role: recipientCriteria.role !== 'all' ? recipientCriteria.role : null,
        is_active: recipientCriteria.is_active !== 'all' ? recipientCriteria.is_active : null,
        verification_status: recipientCriteria.verification_status !== 'all' ? recipientCriteria.verification_status : null,
      },
      scheduled_at: scheduledAt || undefined,
    }, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  const previewContent = () => {
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Preview Email Massal - ${name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
              .content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Subject: ${subject}</h2>
              <p><strong>Email Massal:</strong> ${name}</p>
            </div>
            <div class="content">
              ${content.replace(/\n/g, '<br>')}
            </div>
          </body>
        </html>
      `);
    }
  };

  const calculateRecipients = () => {
    // This would typically make an API call to get the actual count
    // For now, we'll simulate it
    let count = 100; // Base count
    if (recipientCriteria.role !== 'all') count *= 0.3;
    if (recipientCriteria.is_active !== 'all') count *= 0.8;
    if (recipientCriteria.verification_status !== 'all') count *= 0.5;
    return Math.floor(count);
  };

  React.useEffect(() => {
    setPreviewRecipients(calculateRecipients());
  }, [recipientCriteria]);

  return (
    <AppLayout>
      <Head title="Kirim Email Massal" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.get(route('admin.email.campaigns'))}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Email Massal
          </Button>
          <h1 className="text-2xl font-bold">Kirim Email Massal</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Email Massal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nama Email Massal</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Newsletter Bulanan - Januari 2024"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Use Template (Optional)</label>
                    <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a template to start with" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No template</SelectItem>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name} - {template.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email Subject</label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Check out our latest job opportunities!"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Schedule Send (Optional)</label>
                    <Input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="mt-1"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to send immediately, or schedule for later.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="text-sm font-medium">Isi Email</label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Tulis isi email massal di sini... Anda bisa menggunakan tag HTML untuk formatting."
                      rows={12}
                      required
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Anda bisa menggunakan tag HTML dan variabel seperti {'{user_name}'} dalam konten.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {scheduledAt ? (isSubmitting ? 'Menjadwalkan...' : 'Jadwalkan Email') : (isSubmitting ? 'Mengirim...' : 'Kirim Sekarang')}
                </Button>
                
                <Button type="button" variant="outline" onClick={previewContent}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipient Targeting */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Target Recipients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">User Role</label>
                  <Select value={recipientCriteria.role} onValueChange={(value) => setRecipientCriteria(prev => ({...prev, role: value}))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All roles</SelectItem>
                      <SelectItem value="user">Regular Users</SelectItem>
                      <SelectItem value="company_admin">Company Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Account Status</label>
                  <Select value={recipientCriteria.is_active} onValueChange={(value) => setRecipientCriteria(prev => ({...prev, is_active: value}))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="true">Active only</SelectItem>
                      <SelectItem value="false">Inactive only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Verification Status</label>
                  <Select value={recipientCriteria.verification_status} onValueChange={(value) => setRecipientCriteria(prev => ({...prev, verification_status: value}))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All verification statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All verification statuses</SelectItem>
                      <SelectItem value="verified">Verified only</SelectItem>
                      <SelectItem value="unverified">Unverified only</SelectItem>
                      <SelectItem value="pending">Pending verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-green-600">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">~{previewRecipients} recipients</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Estimated based on current criteria. Actual count may vary.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Email Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips Email Massal</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <strong>Subject Email:</strong>
                  <ul className="text-gray-600 mt-1 space-y-1 list-disc list-inside">
                    <li>Maksimal 50 karakter</li>
                    <li>Hindari kata-kata spam</li>
                    <li>Personalisasi jika memungkinkan</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Konten:</strong>
                  <ul className="text-gray-600 mt-1 space-y-1 list-disc list-inside">
                    <li>Sertakan call-to-action yang jelas</li>
                    <li>Format sederhana dan mudah dibaca</li>
                    <li>Test di perangkat mobile</li>
                  </ul>
                </div>

                <div>
                  <strong>Waktu Kirim:</strong>
                  <ul className="text-gray-600 mt-1 space-y-1 list-disc list-inside">
                    <li>Selasa-Kamis paling efektif</li>
                    <li>Kirim antara jam 10-14 WIB</li>
                    <li>Hindari akhir pekan/hari libur</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* HTML Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">HTML Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><code>&lt;h1&gt;Heading&lt;/h1&gt;</code></p>
                <p><code>&lt;p&gt;Paragraph&lt;/p&gt;</code></p>
                <p><code>&lt;strong&gt;Bold&lt;/strong&gt;</code></p>
                <p><code>&lt;a href="url"&gt;Link&lt;/a&gt;</code></p>
                <p><code>&lt;br&gt;</code> - Line break</p>
                <p><code>&lt;img src="url" alt="text"&gt;</code></p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}