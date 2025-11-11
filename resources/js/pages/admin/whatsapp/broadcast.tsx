import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Send, TestTube, Users, MessageSquare, Eye, AlertTriangle } from 'lucide-react';
import { Link } from '@inertiajs/react';
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
}

interface UserStats {
    total_users: number;
    users_with_phone: number;
    google_users: number;
    email_users: number;
}

interface Props {
    templates: WhatsAppTemplate[];
    userStats: UserStats;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    auth_provider: string;
    has_phone: boolean;
}

export default function WhatsAppBroadcast({ templates, userStats }: Props) {
    const { toast } = useToast();
    const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
    const [usersPreview, setUsersPreview] = useState<User[]>([]);
    const [usersCount, setUsersCount] = useState(0);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [sendingBroadcast, setSendingBroadcast] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        template_id: '',
        filter_type: 'with_phone',
        test_mode: false,
    });

    const filterOptions = [
        { value: 'all', label: 'Semua Pengguna (dengan nomor WA)', count: userStats.users_with_phone },
        { value: 'with_phone', label: 'Pengguna dengan Nomor WhatsApp', count: userStats.users_with_phone },
        { value: 'google_users', label: 'Pengguna Google OAuth', count: userStats.google_users },
        { value: 'email_users', label: 'Pengguna Email Register', count: userStats.email_users },
        { value: 'company_admins', label: 'Company Admins', count: 0 },
        { value: 'regular_users', label: 'Pengguna Regular', count: 0 },
    ];

    const typeEmojis = {
        notification: '',
        marketing: '',
        system: '',
        alert: '',
    };

    const loadUsersPreview = async (filterType: string) => {
        setPreviewLoading(true);
        try {
            const response = await fetch('/admin/whatsapp-broadcast/users-preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    filter_type: filterType,
                    limit: 10,
                }),
            });

            const result = await response.json();
            if (result.users) {
                setUsersPreview(result.users);
                setUsersCount(result.total_count);
            }
        } catch (error) {
            console.error('Failed to load users preview:', error);
            toast({
                title: 'Error',
                description: 'Gagal memuat preview pengguna',
                variant: 'destructive',
            });
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleFilterChange = (value: string) => {
        setData('filter_type', value);
        loadUsersPreview(value);
    };

    const handleTemplateChange = (value: string) => {
        setData('template_id', value);
        const template = templates.find(t => t.id.toString() === value);
        setSelectedTemplate(template || null);
    };

    const handleSendBroadcast = (testMode = false) => {
        if (!data.template_id) {
            toast({
                title: 'Error',
                description: 'Silakan pilih template terlebih dahulu',
                variant: 'destructive',
            });
            return;
        }

        setSendingBroadcast(true);

        post('/admin/whatsapp-broadcast/send', {
            data: {
                ...data,
                test_mode: testMode,
            },
            onSuccess: (response: any) => {
                const broadcastData = response.props?.flash?.data;
                toast({
                    title: 'Success',
                    description: `${testMode ? 'Test broadcast' : 'Broadcast'} berhasil dikirim!`,
                });
                
                if (broadcastData) {
                }
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Gagal mengirim broadcast',
                    variant: 'destructive',
                });
            },
            onFinish: () => setSendingBroadcast(false),
        });
    };

    return (
        <AppLayout>
            <Head title="WhatsApp Massal" />

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
                        <h1 className="text-2xl font-bold">WhatsApp Massal</h1>
                        <p className="text-gray-600">
                            Kirim pesan WhatsApp ke banyak pengguna sekaligus
                        </p>
                    </div>
                </div>

                {/* User Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                                    <p className="text-2xl font-bold">{userStats.total_users}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Punya Nomor WA</p>
                                    <p className="text-2xl font-bold">{userStats.users_with_phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 bg-red-500 rounded-full" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Google Users</p>
                                    <p className="text-2xl font-bold">{userStats.google_users}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 bg-blue-500 rounded-full" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Email Users</p>
                                    <p className="text-2xl font-bold">{userStats.email_users}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Broadcast Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Konfigurasi Broadcast</CardTitle>
                            <CardDescription>Pilih template dan target pengguna untuk broadcast</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Template Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="template">Template WhatsApp *</Label>
                                <Select value={data.template_id} onValueChange={handleTemplateChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih template..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map((template) => (
                                            <SelectItem key={template.id} value={template.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <span>{typeEmojis[template.type]}</span>
                                                    <span>{template.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.template_id && <p className="text-sm text-red-600">{errors.template_id}</p>}
                            </div>

                            {/* Filter Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="filter">Target Pengguna *</Label>
                                <Select value={data.filter_type} onValueChange={handleFilterChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{option.label}</span>
                                                    <Badge variant="outline" className="ml-2">
                                                        {option.count}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Template Preview */}
                            {selectedTemplate && (
                                <div className="space-y-2">
                                    <Label>Preview Template</Label>
                                    <div className="bg-gray-50 border rounded p-3">
                                        <p className="text-sm font-medium text-gray-700">
                                            {typeEmojis[selectedTemplate.type]} {selectedTemplate.name}
                                        </p>
                                        {selectedTemplate.description && (
                                            <p className="text-xs text-gray-500 mt-1">{selectedTemplate.description}</p>
                                        )}
                                        <Separator className="my-2" />
                                        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans">
                                            {selectedTemplate.message}
                                        </pre>
                                        {selectedTemplate.variables.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs font-medium text-gray-600">Variabel:</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {selectedTemplate.variables.map((variable, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {`{${variable}}`}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Send Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => handleSendBroadcast(true)}
                                    disabled={sendingBroadcast || !data.template_id}
                                    className="flex-1"
                                >
                                    <TestTube className="h-4 w-4 mr-2" />
                                    {sendingBroadcast ? 'Mengirim...' : 'Test (5 User)'}
                                </Button>
                                <Button 
                                    onClick={() => handleSendBroadcast(false)}
                                    disabled={sendingBroadcast || !data.template_id}
                                    className="flex-1"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {sendingBroadcast ? 'Mengirim...' : 'Kirim Broadcast'}
                                </Button>
                            </div>

                            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-yellow-700">
                                    <p className="font-medium">Perhatian:</p>
                                    <p>Broadcast akan dikirim hanya ke pengguna yang memiliki nomor WhatsApp. Test mode akan mengirim ke maksimal 5 pengguna.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview Penerima</CardTitle>
                            <CardDescription>
                                {usersCount > 0 ? `Menampilkan ${Math.min(10, usersPreview.length)} dari ${usersCount} pengguna` : 'Pilih filter untuk melihat preview'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {previewLoading ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="text-sm text-gray-500">Memuat preview pengguna...</div>
                                </div>
                            ) : usersPreview.length > 0 ? (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {usersPreview.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                {user.phone && (
                                                    <p className="text-xs text-green-600">{user.phone}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {user.role}
                                                </Badge>
                                                <div className={`h-2 w-2 rounded-full ${user.has_phone ? 'bg-green-500' : 'bg-red-500'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-32 text-gray-500">
                                    <div className="text-center">
                                        <Eye className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm">Pilih filter untuk melihat preview pengguna</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
