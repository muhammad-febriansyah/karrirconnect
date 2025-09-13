import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Edit, Eye, Send, TestTube, Copy } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppTemplate {
    id: number;
    name: string;
    slug: string;
    title: string;
    message: string;
    type: 'notification' | 'marketing' | 'system' | 'alert';
    variables: string[];
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
    template: WhatsAppTemplate;
}

export default function ShowWhatsAppTemplate({ template }: Props) {
    const { toast } = useToast();
    const [previewMessage, setPreviewMessage] = useState('');
    const [testPhoneNumber, setTestPhoneNumber] = useState('081295916567');
    const [isTestSending, setIsTestSending] = useState(false);

    const { post } = useForm();

    const typeColors = {
        notification: 'bg-blue-100 text-blue-800',
        marketing: 'bg-green-100 text-green-800',
        system: 'bg-orange-100 text-orange-800',
        alert: 'bg-red-100 text-red-800',
    };

    const typeEmojis = {
        notification: '🔔',
        marketing: '📢',
        system: '🔧',
        alert: '⚠️',
    };

    const generatePreview = () => {
        let message = template.message;
        
        // Add emoji prefix if enabled
        if (template.use_emoji) {
            const emoji = typeEmojis[template.type];
            message = `${emoji} *KarirConnect*\n\n` + message;
        }

        // Add title if exists
        if (template.title) {
            message += `\n\n*${template.title}*`;
        }

        // Sample data for preview
        const sampleData = {
            user_name: 'John Doe',
            company_name: 'PT Contoh Perusahaan',
            job_title: 'Frontend Developer',
            application_date: new Date().toLocaleDateString('id-ID'),
            version: '2.1.0',
            alert_message: 'Server disk usage mencapai 95%',
        };

        // Replace variables with sample data
        template.variables?.forEach(variable => {
            const placeholder = `{${variable}}`;
            const sampleValue = sampleData[variable as keyof typeof sampleData] || `[${variable}]`;
            message = message.replace(new RegExp(placeholder, 'g'), sampleValue);
        });

        // Add action URL sample
        message += '\n\n🔗 Link: https://karirconnect.com/sample-action';

        // Add signature if enabled
        if (template.include_signature) {
            message += `\n\n${template.signature_text}`;
        }

        // Add timestamp if enabled
        if (template.include_timestamp) {
            message += `\n${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`;
        }

        setPreviewMessage(message);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(previewMessage);
        toast({
            title: 'Tersalin!',
            description: 'Pesan pratinjau disalin ke clipboard',
        });
    };

    const handleTestSend = () => {
        if (!testPhoneNumber.trim()) {
            toast({
                title: 'Error',
                description: 'Silakan masukkan nomor telepon',
                variant: 'destructive',
            });
            return;
        }

        setIsTestSending(true);

        post(`/admin/whatsapp-templates/${template.id}/test-send`, {
            phone_number: testPhoneNumber,
            data: {
                user_name: 'John Doe',
                company_name: 'PT Contoh Perusahaan',
                job_title: 'Frontend Developer',
                application_date: new Date().toLocaleDateString('id-ID'),
                version: '2.1.0',
                alert_message: 'Server disk usage mencapai 95%',
            },
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Test pesan WhatsApp berhasil dikirim!',
                });
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Gagal mengirim test pesan WhatsApp',
                    variant: 'destructive',
                });
            },
            onFinish: () => setIsTestSending(false),
        });
    };

    return (
        <AppLayout>
            <Head title={`Template: ${template.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/admin/whatsapp-templates">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <Link href={`/admin/whatsapp-templates/${template.id}/edit`}>
                                <Button>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Template
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{typeEmojis[template.type]}</span>
                            <h1 className="text-2xl font-bold">{template.name}</h1>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Template</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Nama</Label>
                                    <p className="text-sm mt-1">{template.name}</p>
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Slug</Label>
                                    <p className="text-sm mt-1 font-mono bg-gray-100 px-2 py-1 rounded">{template.slug}</p>
                                </div>

                                {template.title && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Judul</Label>
                                        <p className="text-sm mt-1">{template.title}</p>
                                    </div>
                                )}

                                {template.description && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Deskripsi</Label>
                                        <p className="text-sm mt-1">{template.description}</p>
                                    </div>
                                )}

                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Template Pesan</Label>
                                    <div className="text-sm mt-1 bg-gray-50 p-3 rounded border">
                                        <pre className="whitespace-pre-wrap font-sans">{template.message}</pre>
                                    </div>
                                </div>

                                {template.variables?.length > 0 && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Variabel</Label>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {template.variables.map((variable, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {`{${variable}}`}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Pengaturan</Label>
                                        <div className="text-sm mt-2 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span>{template.use_emoji ? '✅' : '❌'}</span>
                                                <span>Gunakan Emoji</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>{template.include_timestamp ? '✅' : '❌'}</span>
                                                <span>Sertakan Timestamp</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>{template.include_signature ? '✅' : '❌'}</span>
                                                <span>Sertakan Signature</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Signature</Label>
                                        <p className="text-sm mt-2 italic">{template.signature_text}</p>
                                    </div>
                                </div>

                                <div className="text-xs text-muted-foreground pt-4 border-t">
                                    <p>Dibuat: {new Date(template.created_at).toLocaleString('id-ID')}</p>
                                    <p>Diperbarui: {new Date(template.updated_at).toLocaleString('id-ID')}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Test Kirim</CardTitle>
                                <CardDescription>Send a test message using this template</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={testPhoneNumber}
                                        onChange={(e) => setTestPhoneNumber(e.target.value)}
                                        placeholder="081295916567"
                                    />
                                </div>
                                <Button 
                                    onClick={handleTestSend} 
                                    disabled={isTestSending || !template.is_active}
                                    className="w-full"
                                >
                                    <TestTube className="h-4 w-4 mr-2" />
                                    {isTestSending ? 'Mengirim...' : 'Kirim Test Pesan'}
                                </Button>
                                {!template.is_active && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        Template harus aktif untuk mengirim test pesan
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>
                                Lihat bagaimana template ini akan terlihat dengan data contoh
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={generatePreview} className="flex-1">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Buat Pratinjau
                                </Button>
                                {previewMessage && (
                                    <Button variant="outline" onClick={copyToClipboard}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 min-h-[400px]">
                                {previewMessage ? (
                                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                                        {previewMessage}
                                    </pre>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        Klik "Buat Pratinjau" untuk melihat template dengan data contoh
                                    </div>
                                )}
                            </div>

                            {previewMessage && (
                                <div className="text-xs text-muted-foreground">
                                    <p className="font-medium">Data contoh yang digunakan:</p>
                                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                                        <li>user_name: John Doe</li>
                                        <li>company_name: PT Contoh Perusahaan</li>
                                        <li>job_title: Frontend Developer</li>
                                        <li>application_date: {new Date().toLocaleDateString('id-ID')}</li>
                                        <li>version: 2.1.0</li>
                                        <li>alert_message: Server disk usage mencapai 95%</li>
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}