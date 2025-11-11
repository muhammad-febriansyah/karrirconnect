import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
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
}

interface Props {
    template: EmailTemplate;
}

export default function Edit({ template }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: template.name,
        slug: template.slug,
        subject: template.subject,
        body: template.body,
        variables: template.variables || [],
        is_active: template.is_active,
        type: template.type,
    });
    useFlashToasts();

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/admin/email-templates/${template.id}`);
    };

    const handleVariablesChange = (value: string) => {
        // Convert comma-separated string to array
        const vars = value.split(',').map((v) => v.trim()).filter(Boolean);
        setData('variables', vars);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${template.name}`} />

            <div className="space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="mb-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/email-templates">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Template
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Template Email</h1>
                        <p className="text-muted-foreground">Perbarui konten dan pengaturan template</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Main Form */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Detail Template</CardTitle>
                                <CardDescription>Perbarui informasi template email</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nama Template <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Email Selamat Datang"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Slug */}
                                <div className="space-y-2">
                                    <Label htmlFor="slug">
                                        Slug <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="Contoh: email-selamat-datang"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Identifier unik untuk template (huruf kecil, gunakan tanda hubung)
                                    </p>
                                    {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <Label htmlFor="subject">
                                        Subjek Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="subject"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="Contoh: Selamat Datang di KarirConnect!"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Bisa menggunakan variabel seperti: {`{{user_name}}`}
                                    </p>
                                    {errors.subject && (
                                        <p className="text-sm text-red-600">{errors.subject}</p>
                                    )}
                                </div>

                                {/* Body */}
                                <div className="space-y-2">
                                    <Label htmlFor="body">
                                        Isi Email (HTML) <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="body"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        placeholder="Konten HTML dari email..."
                                        rows={15}
                                        className="font-mono text-sm"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Gunakan HTML untuk styling. Variabel: {`{{nama_variabel}}`}
                                    </p>
                                    {errors.body && <p className="text-sm text-red-600">{errors.body}</p>}
                                </div>

                                {/* Variables */}
                                <div className="space-y-2">
                                    <Label htmlFor="variables">Variabel</Label>
                                    <Input
                                        id="variables"
                                        value={data.variables.join(', ')}
                                        onChange={(e) => handleVariablesChange(e.target.value)}
                                        placeholder="Contoh: user_name, company_name, url"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Daftar variabel yang dipisahkan koma yang digunakan di template
                                    </p>
                                    {errors.variables && (
                                        <p className="text-sm text-red-600">{errors.variables}</p>
                                    )}
                                    {data.variables.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {data.variables.map((variable, index) => (
                                                <Badge key={index} variant="outline">
                                                    {`{{${variable}}}`}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Settings Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pengaturan</CardTitle>
                                    <CardDescription>Konfigurasi template</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type">
                                            Tipe <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value: any) => setData('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="transactional">Transaksional</SelectItem>
                                                <SelectItem value="marketing">Marketing</SelectItem>
                                                <SelectItem value="system">Sistem</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-red-600">{errors.type}</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="is_active">Status</Label>
                                        <Select
                                            value={data.is_active ? 'active' : 'inactive'}
                                            onValueChange={(value) => setData('is_active', value === 'active')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Aktif</SelectItem>
                                                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-2">
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            asChild
                                            disabled={processing}
                                        >
                                            <Link href="/admin/email-templates">Batal</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
