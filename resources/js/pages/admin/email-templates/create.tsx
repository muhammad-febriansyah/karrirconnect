import { Head, Link, useForm } from '@inertiajs/react';
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
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useFlashToasts } from '@/hooks/use-flash-toasts';

const TEMPLATE_PRESETS = [
    {
        id: 'welcome',
        title: 'Email Selamat Datang',
        description: 'Kirim sapaan hangat ketika pengguna baru mendaftar.',
        data: {
            name: 'Selamat Datang Pengguna Baru',
            slug: 'selamat-datang',
            subject: 'Selamat Datang di KarirConnect, {{ nama }}!',
            body: `<p>Hallo {{ nama }},</p>
<p>Terima kasih telah bergabung dengan KarirConnect. Mulai lengkapi profil Anda agar perusahaan bisa menemukan Anda.</p>
<p>Salam hangat,<br/>Tim KarirConnect</p>`,
            variables: ['nama'],
            type: 'system' as const,
        },
    },
    {
        id: 'verification',
        title: 'Verifikasi Email',
        description: 'Membantu pengguna mengaktifkan akunnya.',
        data: {
            name: 'Verifikasi Email Pengguna',
            slug: 'verifikasi-email',
            subject: 'Verifikasi email Anda, {{ nama }}',
            body: `<p>Hi {{ nama }},</p>
<p>Klik tautan berikut untuk memverifikasi email Anda:</p>
<p><a href="{{ tautan_verifikasi }}">Verifikasi sekarang</a></p>
<p>Tautan ini berlaku selama 24 jam.</p>`,
            variables: ['nama', 'tautan_verifikasi'],
            type: 'transactional' as const,
        },
    },
    {
        id: 'promo',
        title: 'Promo / Marketing',
        description: 'Bagikan promo atau berita terbaru.',
        data: {
            name: 'Promo Paket Rekrutmen',
            slug: 'promo-paket-rekrutmen',
            subject: 'Hemat 20% untuk pemasangan lowongan minggu ini!',
            body: `<p>Halo {{ nama_perusahaan }},</p>
<p>Kami punya penawaran spesial untuk Anda. Dapatkan diskon 20% untuk pembelian paket rekrutmen sebelum {{ tanggal_berlaku }}.</p>
<p>Gunakan kode <strong>{{ kode_promo }}</strong> saat checkout.</p>
<p>Salam sukses,<br/>Tim KarirConnect</p>`,
            variables: ['nama_perusahaan', 'tanggal_berlaku', 'kode_promo'],
            type: 'marketing' as const,
        },
    },
] as const;

const COMMON_VARIABLES = ['nama', 'email', 'nama_perusahaan', 'tautan_verifikasi', 'kode_promo', 'tanggal_berlaku'];

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        subject: '',
        body: '',
        variables: [] as string[],
        is_active: true,
        type: 'transactional' as 'system' | 'marketing' | 'transactional',
    });
    const [slugEditedManually, setSlugEditedManually] = useState(false);
    const [variablesInput, setVariablesInput] = useState('');
    const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
    useFlashToasts();

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/email-templates');
    };

    const handleVariablesChange = (value: string) => {
        // Convert comma-separated string to array
        const vars = value
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);
        setData('variables', vars);
        setVariablesInput(value);
    };

    const addVariable = (variable: string) => {
        const vars = Array.from(new Set([...(data.variables || []), variable]));
        setData('variables', vars);
        setVariablesInput(vars.join(', '));
    };

    const applyPreset = (presetId: string) => {
        const preset = TEMPLATE_PRESETS.find((p) => p.id === presetId);
        if (!preset) return;

        setSelectedPresetId(presetId);
        setSlugEditedManually(true);
        setData((prev) => ({
            ...prev,
            name: preset.data.name,
            slug: preset.data.slug,
            subject: preset.data.subject,
            body: preset.data.body,
            variables: preset.data.variables,
            type: preset.data.type,
        }));
        setVariablesInput(preset.data.variables.join(', '));
    };

    useEffect(() => {
        if (!slugEditedManually) {
            setData('slug', slugify(data.name));
        }
    }, [data.name, slugEditedManually, setData]);

    useEffect(() => {
        setVariablesInput(data.variables.join(', '));
    }, [data.variables]);

    return (
        <AppLayout>
            <Head title="Buat Template Email" />

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
                        <h1 className="text-3xl font-bold tracking-tight">Buat Template Email</h1>
                        <p className="text-muted-foreground">Buat template email baru</p>
                    </div>
                </div>

                {/* Panduan Singkat */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="py-4">
                        <h3 className="mb-2 text-sm font-semibold text-blue-900"> Cara Mudah Membuat Template Email:</h3>
                        <ol className="space-y-1 text-sm text-blue-800">
                            <li><strong>1.</strong> Pilih template siap pakai di sebelah kanan, atau isi manual</li>
                            <li><strong>2.</strong> Tulis nama dan subjek email (contoh: "Selamat Datang di KarirConnect")</li>
                            <li><strong>3.</strong> Tulis isi emailnya. Gunakan <code className="rounded bg-blue-100 px-1">{'{{'} nama {'}}'}</code> untuk menyisipkan nama penerima</li>
                            <li><strong>4.</strong> Klik "Buat Template" dan selesai!</li>
                        </ol>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Main Form */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle> Isi Template Email</CardTitle>
                                <CardDescription>Lengkapi form dibawah untuk membuat template email baru</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-base">
                                        Nama Template <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Email Selamat Datang Pelanggan Baru"
                                        required
                                        className="text-base"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        Beri nama yang mudah diingat, misalnya "Email Konfirmasi Pembayaran" atau "Promo Akhir Tahun"
                                    </p>
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-base">
                                        Judul Email (Subject) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="subject"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="Contoh: Selamat Datang di KarirConnect, {{nama}}!"
                                        required
                                        className="text-base"
                                    />
                                    {errors.subject && (
                                        <p className="text-sm text-red-600">{errors.subject}</p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        Ini yang akan muncul di inbox penerima. Gunakan <code className="rounded bg-gray-100 px-1">{'{{'} nama {'}}'}</code> untuk menyapa dengan nama penerima
                                    </p>
                                </div>

                                {/* Body */}
                                <div className="space-y-2">
                                    <Label htmlFor="body" className="text-base">
                                        Isi Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="body"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        placeholder="Halo {{nama}},&#10;&#10;Terima kasih sudah bergabung dengan KarirConnect!&#10;&#10;Salam,&#10;Tim KarirConnect"
                                        rows={14}
                                        className="text-base"
                                        required
                                    />
                                    {errors.body && (
                                        <p className="text-sm text-red-600">{errors.body}</p>
                                    )}
                                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                                        <p className="text-sm text-yellow-800">
                                            <strong> Tips Menulis Email:</strong> <br/>
                                            • Gunakan <code className="rounded bg-yellow-100 px-1">{'{{'} nama {'}}'}</code> untuk menyebut nama penerima<br/>
                                            • Gunakan <code className="rounded bg-yellow-100 px-1">{'{{'} email {'}}'}</code> untuk email penerima<br/>
                                            • Tulis seperti Anda menulis email biasa, santai tapi profesional
                                        </p>
                                    </div>
                                </div>

                                {/* Variables - Simplified */}
                                <div className="space-y-3">
                                    <Label className="text-base">Variabel yang Bisa Dipakai (Opsional)</Label>
                                    <p className="text-sm text-gray-600">
                                        Klik tombol di bawah untuk menambahkan variabel yang tersedia:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {COMMON_VARIABLES.map((variable) => (
                                            <Button
                                                key={variable}
                                                type="button"
                                                variant={data.variables.includes(variable) ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => addVariable(variable)}
                                                className="text-xs"
                                            >
                                                {data.variables.includes(variable) && ' '}
                                                {'{{'} {variable} {'}}'}
                                            </Button>
                                        ))}
                                    </div>
                                    {data.variables.length > 0 && (
                                        <p className="text-sm text-green-600">
                                             Variabel terpilih: {data.variables.join(', ')}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Presets */}
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="text-green-900"> Template Siap Pakai</CardTitle>
                                    <CardDescription className="text-green-700">Klik untuk mengisi otomatis</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {TEMPLATE_PRESETS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => applyPreset(preset.id)}
                                            className={`w-full rounded-lg border-2 px-4 py-3 text-left transition hover:shadow-md ${
                                                selectedPresetId === preset.id
                                                    ? 'border-green-500 bg-green-100 shadow-sm'
                                                    : 'border-green-200 bg-white hover:border-green-400'
                                            }`}
                                        >
                                            <p className="font-semibold text-sm text-green-900">{preset.title}</p>
                                            <p className="text-xs text-green-700">{preset.description}</p>
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Template Type - Simplified */}
                            <Card>
                                <CardHeader>
                                    <CardTitle> Kategori Email</CardTitle>
                                    <CardDescription>Untuk apa email ini digunakan?</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2">
                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'transactional')}
                                            className={`w-full rounded-lg border-2 p-3 text-left transition ${
                                                data.type === 'transactional'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                            }`}
                                        >
                                            <p className="font-semibold text-sm"> Email Transaksi</p>
                                            <p className="text-xs text-gray-600">Konfirmasi, notifikasi, dll</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'marketing')}
                                            className={`w-full rounded-lg border-2 p-3 text-left transition ${
                                                data.type === 'marketing'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                            }`}
                                        >
                                            <p className="font-semibold text-sm"> Email Promo/Marketing</p>
                                            <p className="text-xs text-gray-600">Penawaran, diskon, newsletter</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'system')}
                                            className={`w-full rounded-lg border-2 p-3 text-left transition ${
                                                data.type === 'system'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                            }`}
                                        >
                                            <p className="font-semibold text-sm"> Email Sistem</p>
                                            <p className="text-xs text-gray-600">Reset password, verifikasi</p>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                                <CardContent className="space-y-3 pt-6">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base font-semibold"
                                        disabled={processing}
                                        size="lg"
                                    >
                                        <Save className="mr-2 h-5 w-5" />
                                        {processing ? 'Sedang Menyimpan...' : ' Simpan Template'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        asChild
                                    >
                                        <Link href="/admin/email-templates"> Batal</Link>
                                    </Button>
                                    <p className="text-xs text-center text-gray-600 pt-2">
                                        Template akan tersimpan dan siap digunakan
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
