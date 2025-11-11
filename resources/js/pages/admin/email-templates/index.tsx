import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Mail, Plus, Eye, Edit, Trash2, Power, Send } from 'lucide-react';
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
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { type ColumnDef } from '@tanstack/react-table';
import { useFlashToasts } from '@/hooks/use-flash-toasts';

interface EmailTemplate {
    id: number;
    name: string;
    slug: string;
    subject: string;
    body: string;
    variables: string[];
    is_active: boolean;
    type: 'system' | 'marketing' | 'transactional';
    created_at: string;
    updated_at: string;
}

interface Props {
    templates: EmailTemplate[];
}

const TYPE_META: Record<EmailTemplate['type'], { label: string; description: string; badgeVariant: 'default' | 'secondary' | 'outline' }> = {
    system: {
        label: 'System Emails',
        description: 'Notifikasi otomatis dari platform',
        badgeVariant: 'default',
    },
    marketing: {
        label: 'Marketing Emails',
        description: 'Kampanye promosi & engagement',
        badgeVariant: 'secondary',
    },
    transactional: {
        label: 'Transactional Emails',
        description: 'Transaksi penting & pembayaran',
        badgeVariant: 'outline',
    },
};

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return '-';
    }
};

export default function Index({ templates }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [testEmailDialog, setTestEmailDialog] = useState<number | null>(null);
    const [testEmail, setTestEmail] = useState('');
    useFlashToasts();

    const handleDelete = (id: number) => {
        router.delete(`/admin/email-templates/${id}`, {
            onSuccess: () => setDeleteId(null),
        });
    };

    const handleToggle = (id: number) => {
        router.post(
            `/admin/email-templates/${id}/toggle`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleSendTest = (id: number) => {
        router.post(
            `/admin/email-templates/${id}/send-test`,
            { email: testEmail },
            {
                onSuccess: () => {
                    setTestEmailDialog(null);
                    setTestEmail('');
                },
            },
        );
    };

    const groupedTemplates = templates.reduce<Record<string, EmailTemplate[]>>((acc, template) => {
        acc[template.type] = acc[template.type] ? [...acc[template.type], template] : [template];
        return acc;
    }, {});

    const columns: ColumnDef<EmailTemplate>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Template" />,
            cell: ({ row }) => (
                <div>
                    <p className="text-sm font-semibold">{row.original.name}</p>
                    <p className="text-xs text-muted-foreground">{row.original.subject}</p>
                    <p className="text-[11px] text-muted-foreground/80">Slug: {row.original.slug}</p>
                </div>
            ),
        },
        {
            accessorKey: 'type',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe" />,
            cell: ({ row }) => {
                const templateType = row.getValue('type') as EmailTemplate['type'];
                const meta = TYPE_META[templateType] || TYPE_META.system;
                return (
                    <Badge variant={meta.badgeVariant} className="capitalize">
                        {meta.label}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const active = row.getValue('is_active') as boolean;
                return (
                    <Badge variant={active ? 'outline' : 'secondary'} className={active ? 'border-green-500 text-green-600' : ''}>
                        {active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'variables',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Variabel" />,
            cell: ({ row }) => {
                const variables = (row.getValue('variables') as string[]) || [];
                return <span className="text-sm text-muted-foreground">{variables.length || 0} field</span>;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'updated_at',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Terakhir Diubah" />,
            cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.getValue('updated_at'))}</span>,
        },
        {
            id: 'actions',
            header: 'Aksi',
            enableHiding: false,
            cell: ({ row }) => {
                const template = row.original;
                return (
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/email-templates/${template.id}`} className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span className="hidden lg:inline">Detail</span>
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/email-templates/${template.id}/edit`} className="flex items-center gap-1">
                                <Edit className="h-4 w-4" />
                                <span className="hidden lg:inline">Edit</span>
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggle(template.id)}
                            className={template.is_active ? 'text-amber-600' : 'text-green-600'}
                        >
                            <Power className="h-4 w-4" />
                            <span className="hidden xl:inline ml-1">{template.is_active ? 'Matikan' : 'Aktifkan'}</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setTestEmailDialog(template.id)}>
                            <Send className="h-4 w-4" />
                            <span className="hidden xl:inline ml-1">Test</span>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteId(template.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden xl:inline ml-1">Hapus</span>
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout>
            <Head title="Email Templates" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Email Templates</h1>
                        <p className="text-sm text-muted-foreground">Kelola template email untuk notifikasi sistem</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/admin/email-templates/create">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="sm:inline">Tambah Template</span>
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(TYPE_META).map(([type, meta]) => (
                        <Card key={type}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{meta.label}</CardTitle>
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{groupedTemplates[type]?.length ?? 0}</div>
                                <p className="mt-1 text-xs text-muted-foreground">{meta.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Template</CardTitle>
                        <CardDescription>Gunakan fitur pencarian untuk menemukan template dengan cepat.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={templates} searchKey="name" searchPlaceholder="Cari template email..." />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Template Email?</DialogTitle>
                        <DialogDescription>Aksi ini tidak dapat dibatalkan. Template email akan dihapus permanen.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button onClick={() => deleteId && handleDelete(deleteId)} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={testEmailDialog !== null} onOpenChange={() => setTestEmailDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Test Email</DialogTitle>
                        <DialogDescription>Masukkan alamat email yang akan menerima test email.</DialogDescription>
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
                        <Button variant="outline" onClick={() => setTestEmailDialog(null)}>
                            Cancel
                        </Button>
                        <Button onClick={() => testEmailDialog && handleSendTest(testEmailDialog)} disabled={!testEmail}>
                            <Send className="mr-2 h-4 w-4" />
                            Send Test
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
