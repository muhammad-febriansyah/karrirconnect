import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Edit, Mail, Send, Trash2, Power, Eye } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFlashToasts } from '@/hooks/use-flash-toasts';

interface EmailTemplate {
    id: number;
    name: string;
    slug: string;
    subject: string;
    body: string;
    variables: string[] | null;
    is_active: boolean;
    type: 'system' | 'marketing' | 'transactional';
    created_at: string;
    updated_at: string;
}

interface Props {
    template: EmailTemplate;
}

export default function Show({ template }: Props) {
    const [testEmailDialog, setTestEmailDialog] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [deleteDialog, setDeleteDialog] = useState(false);
    useFlashToasts();

    const handleDelete = () => {
        router.delete(`/admin/email-templates/${template.id}`, {
            onSuccess: () => {
                router.visit('/admin/email-templates');
            },
        });
    };

    const handleToggle = () => {
        router.post(`/admin/email-templates/${template.id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleSendTest = () => {
        router.post(`/admin/email-templates/${template.id}/send-test`, {
            email: testEmail,
        }, {
            onSuccess: () => {
                setTestEmailDialog(false);
                setTestEmail('');
            },
        });
    };

    const getTypeBadge = (type: string) => {
        const variants: Record<string, { variant: any; label: string; className?: string }> = {
            system: { variant: 'default', label: 'System' },
            marketing: { variant: 'secondary', label: 'Marketing' },
            transactional: { variant: 'outline', label: 'Transactional' },
        };
        const config = variants[type] || variants.system;
        return (
            <Badge variant={config.variant} className={`capitalize ${config.className || ''}`}>
                {config.label}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title={`${template.name} - Email Template`} />

            <div className="space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                        <Button variant="ghost" size="sm" asChild className="w-fit">
                            <Link href="/admin/email-templates">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <div className="flex items-start gap-3">
                            <Mail className="h-8 w-8 flex-shrink-0 text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                                    {template.name}
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">{template.slug}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant={template.is_active ? 'default' : 'secondary'}
                            size="sm"
                            onClick={handleToggle}
                            className="flex-shrink-0"
                        >
                            <Power className="mr-2 h-4 w-4" />
                            {template.is_active ? 'Active' : 'Inactive'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setTestEmailDialog(true)} className="flex-shrink-0">
                            <Send className="mr-2 h-4 w-4" />
                            Send Test
                        </Button>
                        <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                            <Link href={`/admin/email-templates/${template.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteDialog(true)}
                            className="flex-shrink-0 text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Template Details */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Template Details</CardTitle>
                            <CardDescription>Email template information and content</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            {/* Subject */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">Subject</Label>
                                <p className="text-base font-medium leading-relaxed">{template.subject}</p>
                            </div>

                            {/* Body Preview */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-muted-foreground">Email Body</Label>
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={`/admin/email-templates/${template.id}/preview`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Preview
                                        </a>
                                    </Button>
                                </div>
                                <div className="max-h-96 overflow-auto rounded-lg border bg-muted/50 p-4">
                                    <pre className="text-xs leading-relaxed">
                                        <code>{template.body}</code>
                                    </pre>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar Info */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6 pt-0">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium uppercase text-muted-foreground">Type</Label>
                                    <div>{getTypeBadge(template.type)}</div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium uppercase text-muted-foreground">Status</Label>
                                    <div>
                                        <Badge
                                            variant={template.is_active ? 'default' : 'secondary'}
                                            className={
                                                template.is_active
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : ''
                                            }
                                        >
                                            {template.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium uppercase text-muted-foreground">Created</Label>
                                    <p className="text-sm leading-relaxed">
                                        {new Date(template.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium uppercase text-muted-foreground">Last Updated</Label>
                                    <p className="text-sm leading-relaxed">
                                        {new Date(template.updated_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Variables</CardTitle>
                                <CardDescription className="text-xs">Available placeholders for this template</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                {template.variables && template.variables.length > 0 ? (
                                    <div className="space-y-2">
                                        {template.variables.map((variable, index) => (
                                            <div
                                                key={index}
                                                className="rounded-lg border bg-muted/50 px-3 py-2.5 font-mono text-sm leading-none"
                                            >
                                                {`{{${variable}}}`}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm leading-relaxed text-muted-foreground">No variables defined</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Template Email?</DialogTitle>
                        <DialogDescription>
                            Aksi ini tidak dapat dibatalkan. Template email "{template.name}" akan dihapus secara permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Test Email Dialog */}
            <Dialog open={testEmailDialog} onOpenChange={setTestEmailDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Test Email</DialogTitle>
                        <DialogDescription>
                            Masukkan alamat email untuk menerima test email dari template ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="test-email">Email Address</Label>
                            <Input
                                id="test-email"
                                type="email"
                                placeholder="test@example.com"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTestEmailDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendTest} disabled={!testEmail}>
                            <Send className="mr-2 h-4 w-4" />
                            Send Test
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
