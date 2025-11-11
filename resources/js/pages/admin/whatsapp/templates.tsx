import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Plus, MessageSquare, Eye, Edit, Trash2, Power, TestTube } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppTemplate {
    id: number;
    name: string;
    slug: string;
    title: string;
    message: string;
    type: 'notification' | 'marketing' | 'system' | 'alert';
    variables: string[] | null | undefined;
    description: string;
    is_active: boolean;
    use_emoji: boolean;
    include_timestamp: boolean;
    include_signature: boolean;
    signature_text: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    templates: WhatsAppTemplate[];
}

export default function WhatsAppTemplates({ templates }: Props) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<number | null>(null);

    const typeColors = {
        notification: 'bg-blue-100 text-blue-800',
        marketing: 'bg-green-100 text-green-800',
        system: 'bg-orange-100 text-orange-800',
        alert: 'bg-red-100 text-red-800',
    };

    const typeEmojis = {
        notification: '',
        marketing: '',
        system: '',
        alert: '',
    };

    const handleToggleStatus = async (template: WhatsAppTemplate) => {
        setIsLoading(template.id);
        try {
            router.post(`/admin/whatsapp-templates/${template.id}/toggle-status`, {}, {
                onSuccess: () => {
                    const statusText = template.is_active ? 'dinonaktifkan' : 'diaktifkan';
                    toast({
                        title: 'Berhasil',
                        description: `Template berhasil ${statusText}`,
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Gagal mengubah status template',
                        variant: 'destructive',
                    });
                },
                onFinish: () => setIsLoading(null),
            });
        } catch (error) {
            setIsLoading(null);
        }
    };

    const handleDelete = (template: WhatsAppTemplate) => {
        if (confirm(`Apakah Anda yakin ingin menghapus template "${template.name}"?`)) {
            router.delete(`/admin/whatsapp-templates/${template.id}`, {
                onSuccess: () => {
                    toast({
                        title: 'Berhasil',
                        description: 'Template berhasil dihapus',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Gagal menghapus template',
                        variant: 'destructive',
                    });
                }
            });
        }
    };

    return (
        <AppLayout>
            <Head title="WhatsApp Templates" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">WhatsApp Templates</h1>
                        <p className="text-gray-600">
                            Kelola template pesan WhatsApp untuk notifikasi dan marketing
                        </p>
                    </div>
                    <Link href="/admin/whatsapp-templates/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Buat Template
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <Card key={template.id} className="relative">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">
                                                {typeEmojis[template.type]}
                                            </span>
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={typeColors[template.type]}>
                                                {template.type}
                                            </Badge>
                                            <Badge variant={template.is_active ? 'default' : 'secondary'}>
                                                {template.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                {template.description && (
                                    <CardDescription>{template.description}</CardDescription>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {template.title && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Judul</p>
                                        <p className="text-sm">{template.title}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pratinjau Pesan</p>
                                    <p className="text-sm line-clamp-3 bg-gray-50 p-2 rounded text-gray-700">
                                        {template.message.substring(0, 100)}...
                                    </p>
                                </div>

                                {Array.isArray(template.variables) && template.variables.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Variabel</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {template.variables.map((variable, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {`{${variable}}`}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-4 border-t">
                                    <Link href={`/admin/whatsapp-templates/${template.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/whatsapp-templates/${template.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleStatus(template)}
                                        disabled={isLoading === template.id}
                                    >
                                        <Power className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => handleDelete(template)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {templates.length === 0 && (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold">Tidak ada Template WhatsApp</h3>
                                <p className="text-gray-600 mb-6">
                                    Mulai dengan membuat template pesan WhatsApp pertama Anda.
                                </p>
                                <Link href="/admin/whatsapp-templates/create">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Buat Template Pertama
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}