import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Award, Hash, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateSkill() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('admin.skills.store'), {
            onSuccess: () => {
                toast.success('Skill berhasil ditambahkan!', {
                    description: 'Skill baru telah berhasil ditambahkan.',
                    duration: 4000,
                });
            },
            onError: (errors) => {
                if (errors.error) {
                    toast.error(errors.error);
                } else {
                    toast.error('Gagal Menambah Skill', {
                        description: 'Terjadi kesalahan saat menambahkan skill.',
                        duration: 4000,
                    });
                }
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Tambah Skill Baru" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col items-start gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.visit('/admin/skills')} type="button">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Skills
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tambah Skill Baru</h1>
                        <p className="mt-2 text-gray-600">Buat skill baru yang akan tersedia untuk pengguna</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-full">
                    <Card className="shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Award className="h-5 w-5 text-blue-600" />
                                Informasi Skill
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 p-6">
                            {/* Skill Name */}
                            <div className="space-y-3">
                                <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium text-gray-700">
                                    <Hash className="h-4 w-4 text-gray-500" />
                                    Nama Skill *
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} transition-colors`}
                                    placeholder="Contoh: React.js, Python, Digital Marketing"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Gunakan nama yang spesifik dan mudah dipahami
                                </p>
                            </div>


                            {/* Description */}
                            <div className="space-y-3">
                                <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium text-gray-700">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    Deskripsi
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={`${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} transition-colors`}
                                    placeholder="Jelaskan tentang skill ini, kegunaan, atau konteks penggunaan..."
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Deskripsi membantu pengguna memahami skill ini (opsional)
                                </p>
                            </div>

                            {/* Status */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-base font-medium text-gray-700">
                                    <CheckCircle className="h-4 w-4 text-gray-500" />
                                    Status
                                </Label>
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                                    />
                                    <div>
                                        <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                                            Status Aktif
                                        </Label>
                                        <p className="text-xs text-gray-500">
                                            {data.is_active 
                                                ? 'Skill ini akan tersedia untuk pengguna' 
                                                : 'Skill ini akan disembunyikan dari pengguna'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-6">
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => router.visit('/admin/skills')}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Skill'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}