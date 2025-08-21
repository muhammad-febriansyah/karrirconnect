import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Plus, Edit, Eye, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

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
  templates: EmailTemplate[];
}

export default function EmailTemplates({ templates }: Props) {
  const getTypeColor = (type: string) => {
    const typeColors = {
      system: 'bg-blue-100 text-blue-800',
      marketing: 'bg-green-100 text-green-800',
      transactional: 'bg-purple-100 text-purple-800',
    };
    
    return typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';
  };

  const toggleTemplate = (template: EmailTemplate) => {
    router.patch(`/admin/email/templates/${template.id}`, {
      ...template,
      is_active: !template.is_active,
    });
  };

  const deleteTemplate = (template: EmailTemplate) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${template.name}"?`)) {
      router.delete(`/admin/email/templates/${template.id}`);
    }
  };

  const previewTemplate = (template: EmailTemplate) => {
    // Open preview modal or new window
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Email Preview - ${template.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
              .content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Subject: ${template.subject}</h2>
              <p><strong>Type:</strong> ${template.type}</p>
            </div>
            <div class="content">
              ${template.body.replace(/\n/g, '<br>')}
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <AppLayout>
      <Head title="Template Email" />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Template Email</h1>
          <Link href="/admin/email/templates/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Buat Template
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Template</p>
                  <p className="text-2xl font-bold">{templates.length}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aktif</p>
                  <p className="text-2xl font-bold text-green-600">
                    {templates.filter(t => t.is_active).length}
                  </p>
                </div>
                <ToggleRight className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sistem</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {templates.filter(t => t.type === 'system').length}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pemasaran</p>
                  <p className="text-2xl font-bold text-green-600">
                    {templates.filter(t => t.type === 'marketing').length}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className={`${template.is_active ? '' : 'opacity-60'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(template.type)}>
                      {template.type}
                    </Badge>
                    {template.is_active ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">{template.subject}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-700">
                  <p className="line-clamp-3">
                    {template.body.replace(/(<([^>]+)>)/gi, '').substring(0, 100)}
                    {template.body.length > 100 && '...'}
                  </p>
                </div>

                {template.variables && template.variables.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Variabel:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {`{${variable}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  <p>Dibuat: {new Date(template.created_at).toLocaleDateString()}</p>
                  <p>Diperbarui: {new Date(template.updated_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => previewTemplate(template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Link href={`/admin/email/templates/${template.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTemplate(template)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant={template.is_active ? "outline" : "default"}
                    onClick={() => toggleTemplate(template)}
                  >
                    {template.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Tidak ada template email ditemukan</h3>
              <p className="text-gray-600 mb-4">
                Mulai dengan membuat template email pertama Anda.
              </p>
              <Link href={'/admin/email/templates/create'}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Template
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}