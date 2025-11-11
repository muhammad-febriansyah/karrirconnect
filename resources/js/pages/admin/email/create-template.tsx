import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, Plus, X } from 'lucide-react';
import { route } from 'ziggy-js';

export default function CreateEmailTemplate() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('system');
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    router.post(route('admin.email.store-template'), {
      name,
      subject,
      body,
      type,
      variables,
    }, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  const addVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      setVariables([...variables, newVariable]);
      setNewVariable('');
    }
  };

  const removeVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  const insertVariable = (variable: string) => {
    const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || body.length;
    const newBody = body.slice(0, cursorPos) + `{${variable}}` + body.slice(cursorPos);
    setBody(newBody);
  };

  const previewTemplate = () => {
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Email Preview - ${name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
              .content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Subject: ${subject}</h2>
              <p><strong>Type:</strong> ${type}</p>
            </div>
            <div class="content">
              ${body.replace(/\n/g, '<br>')}
            </div>
          </body>
        </html>
      `);
    }
  };

  const commonVariables = [
    'user_name', 'user_email', 'company_name', 'job_title', 
    'application_date', 'deadline', 'site_name', 'site_url'
  ];

  return (
    <AppLayout>
      <Head title="Buat Template Email" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.get(route('admin.email.templates'))}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Template
          </Button>
          <h1 className="text-2xl font-bold">Buat Template Email</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nama Template</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Welcome Email"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Subjek Email</label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Welcome to {site_name}!"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tipe Template</label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="transactional">Transactional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="text-sm font-medium">Email Body</label>
                    <Textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your email content here... Use {variable_name} for dynamic content."
                      rows={12}
                      required
                      className="mt-1 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can use HTML tags and variables like {'{user_name}'} in your content.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Template'}
                </Button>
                
                <Button type="button" variant="outline" onClick={previewTemplate}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Variables Manager */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Add Variable</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newVariable}
                      onChange={(e) => setNewVariable(e.target.value)}
                      placeholder="variable_name"
                      onKeyPress={(e) => e.key === 'Enter' && addVariable()}
                    />
                    <Button type="button" size="sm" onClick={addVariable}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {variables.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Custom Variables</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {variables.map((variable) => (
                        <div key={variable} className="flex items-center gap-1">
                          <Badge 
                            variant="outline" 
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => insertVariable(variable)}
                          >
                            {`{${variable}}`}
                          </Badge>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0"
                            onClick={() => removeVariable(variable)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Common Variables</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {commonVariables.map((variable) => (
                      <Badge 
                        key={variable}
                        variant="secondary" 
                        className="cursor-pointer hover:bg-gray-200"
                        onClick={() => insertVariable(variable)}
                      >
                        {`{${variable}}`}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Click any variable to insert it into the email body.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Template Types Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong className="text-blue-600">System:</strong>
                  <p className="text-gray-600">Automated emails like welcome, password reset, etc.</p>
                </div>
                <div>
                  <strong className="text-green-600">Marketing:</strong>
                  <p className="text-gray-600">Promotional emails, newsletters, campaigns.</p>
                </div>
                <div>
                  <strong className="text-purple-600">Transactional:</strong>
                  <p className="text-gray-600">Order confirmations, receipts, notifications.</p>
                </div>
              </CardContent>
            </Card>

            {/* HTML Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">HTML Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><code>&lt;h1&gt;&lt;/h1&gt;</code> - Headers</p>
                <p><code>&lt;p&gt;&lt;/p&gt;</code> - Paragraphs</p>
                <p><code>&lt;br&gt;</code> - Line breaks</p>
                <p><code>&lt;strong&gt;&lt;/strong&gt;</code> - Bold text</p>
                <p><code>&lt;a href=""&gt;&lt;/a&gt;</code> - Links</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}