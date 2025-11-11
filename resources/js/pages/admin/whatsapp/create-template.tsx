import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Eye, Send } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function CreateWhatsAppTemplate() {
    const { toast } = useToast();
    const [previewMessage, setPreviewMessage] = useState('');
    const [variables, setVariables] = useState<string[]>([]);
    const [newVariable, setNewVariable] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        title: '',
        message: '',
        type: 'notification' as 'notification' | 'marketing' | 'system' | 'alert',
        variables: [] as string[],
        description: '',
        use_emoji: true,
        include_timestamp: true,
        include_signature: true,
        signature_text: '_Pesan otomatis dari KarirConnect_',
    });

    const typeEmojis = {
        notification: '',
        marketing: '',
        system: '',
        alert: '',
    };

    const addVariable = () => {
        if (newVariable.trim() && !variables.includes(newVariable.trim())) {
            const updatedVariables = [...variables, newVariable.trim()];
            setVariables(updatedVariables);
            setData('variables', updatedVariables);
            setNewVariable('');
        }
    };

    const removeVariable = (variable: string) => {
        const updatedVariables = variables.filter(v => v !== variable);
        setVariables(updatedVariables);
        setData('variables', updatedVariables);
    };

    const generatePreview = () => {
        let message = data.message;
        
        // Add emoji prefix if enabled
        if (data.use_emoji) {
            const emoji = typeEmojis[data.type];
            message = `${emoji} *KarirConnect*\n\n` + message;
        }

        // Add title if exists
        if (data.title) {
            message += `\n\n*${data.title}*`;
        }

        // Sample data for preview
        const sampleData = {
            user_name: 'John Doe',
            company_name: 'PT Contoh Perusahaan',
            job_title: 'Frontend Developer',
            application_date: new Date().toLocaleDateString('id-ID'),
            version: '2.1.0',
        };

        // Replace variables with sample data
        variables.forEach(variable => {
            const placeholder = `{${variable}}`;
            const sampleValue = sampleData[variable as keyof typeof sampleData] || `[${variable}]`;
            message = message.replace(new RegExp(placeholder, 'g'), sampleValue);
        });

        // Add action URL sample
        message += '\n\nLink: https://karirconnect.com/sample-action';

        // Add signature if enabled
        if (data.include_signature) {
            message += `\n\n${data.signature_text}`;
        }

        // Add timestamp if enabled
        if (data.include_timestamp) {
            message += `\n${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        }

        setPreviewMessage(message);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/whatsapp-templates', {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Template WhatsApp berhasil dibuat',
                });
            },
            onError: () => {
                toast({
                    title: 'Gagal',
                    description: 'Gagal membuat template WhatsApp',
                    variant: 'destructive',
                });
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Buat Template WhatsApp" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <Link href="/admin/whatsapp-templates">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Buat Template WhatsApp</h1>
                        <p className="text-gray-600">
                            Buat template pesan WhatsApp baru untuk notifikasi
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Template</CardTitle>
                            <CardDescription>Konfigurasikan template WhatsApp Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Template *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="mis. Registrasi User"
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipe *</Label>
                                        <Select value={data.type} onValueChange={(value) => setData('type', value as any)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="notification">Notification</SelectItem>
                                                <SelectItem value="marketing">Marketing</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                                <SelectItem value="alert">Alert</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul (Opsional)</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="mis. Selamat datang di KarirConnect!"
                                    />
                                    {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Pesan *</Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Masukkan template pesan WhatsApp Anda..."
                                        rows={6}
                                        required
                                    />
                                    {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
                                </div>

                                <div className="space-y-4">
                                    <Label>Variabel</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newVariable}
                                            onChange={(e) => setNewVariable(e.target.value)}
                                            placeholder="mis. user_name"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
                                        />
                                        <Button type="button" variant="outline" onClick={addVariable}>
                                            Tambah
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {variables.map((variable, index) => (
                                            <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeVariable(variable)}>
                                                {`{${variable}}`} ×
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi (Opsional)</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Jelaskan kapan template ini digunakan..."
                                        rows={3}
                                    />
                                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="use_emoji">Gunakan Emoji</Label>
                                        <Switch
                                            id="use_emoji"
                                            checked={data.use_emoji}
                                            onCheckedChange={(checked) => setData('use_emoji', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="include_timestamp">Sertakan Timestamp</Label>
                                        <Switch
                                            id="include_timestamp"
                                            checked={data.include_timestamp}
                                            onCheckedChange={(checked) => setData('include_timestamp', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="include_signature">Sertakan Signature</Label>
                                        <Switch
                                            id="include_signature"
                                            checked={data.include_signature}
                                            onCheckedChange={(checked) => setData('include_signature', checked)}
                                        />
                                    </div>
                                </div>

                                {data.include_signature && (
                                    <div className="space-y-2">
                                        <Label htmlFor="signature_text">Teks Signature</Label>
                                        <Input
                                            id="signature_text"
                                            value={data.signature_text}
                                            onChange={(e) => setData('signature_text', e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={generatePreview}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Pratinjau
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Send className="h-4 w-4 mr-2" />
                                        {processing ? 'Membuat...' : 'Buat Template'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pratinjau</CardTitle>
                            <CardDescription>Lihat bagaimana template Anda akan terlihat</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 min-h-[300px]">
                                {previewMessage ? (
                                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                                        {previewMessage}
                                    </pre>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        Klik "Pratinjau" untuk melihat template Anda
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
