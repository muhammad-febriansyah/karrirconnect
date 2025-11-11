import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Eye, Plus, X } from 'lucide-react';
import { route } from 'ziggy-js';

interface EmailTemplate {
  id: number;
  name: string;
  slug: string;
  subject: string;
  body: string;
  type: string;
  is_active: boolean;
  variables?: string[];
  created_at: string;
  updated_at: string;
}

interface Props {
  template: EmailTemplate;
}

export default function EditEmailTemplate({ template }: Props) {
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [type, setType] = useState(template.type);
  const [isActive, setIsActive] = useState(template.is_active);
  const [variables, setVariables] = useState<string[]>(template.variables || []);
  const [newVariable, setNewVariable] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    router.patch(route('admin.email.update-template', template.id), {
      name,
      subject,
      body,
      type,
      is_active: isActive,
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
              <p><strong>Status:</strong> ${isActive ? 'Active' : 'Inactive'}</p>
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
      <Head title={`Edit Template - ${template.name}`} />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.get(route('admin.email.templates'))}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Template
          </Button>
          <h1 className="text-2xl font-bold">Edit Template Email</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Template Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Welcome Email"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email Subject</label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Welcome to {site_name}!"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Template Type</label>
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

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Template Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                      <Switch
                        checked={isActive}
                        onCheckedChange={setIsActive}
                      />
                    </div>
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
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
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
            {/* Template Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Info</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <strong>Slug:</strong> {template.slug}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(template.created_at).toLocaleString()}
                </div>
                <div>
                  <strong>Updated:</strong> {new Date(template.updated_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>

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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}