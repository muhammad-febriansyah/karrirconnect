import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Award, Users, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Skill {
    id: number;
    name: string;
    category: string;
    description?: string;
    is_active: boolean;
    users_count?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    skill: Skill;
}

export default function EditSkill({ skill }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: skill.name || '',
        description: skill.description || '',
        is_active: skill.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        put(route('admin.skills.update', skill.id), {
            onSuccess: () => {
                toast.success('Skill berhasil diperbarui!');
            },
            onError: (errors) => {
                if (errors.error) {
                    toast.error(errors.error);
                } else {
                    toast.error('Terjadi kesalahan saat memperbarui skill');
                }
            }
        });
    };


    return (
        <AppLayout>
            <Head title={`Edit Skill: ${skill.name}`} />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Link
                        href={route('admin.skills.index')}
                        className="flex items-center text-gray-600 hover:text-gray-900 w-fit"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Kembali
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Skill</h1>
                        <p className="text-gray-600">
                            Perbarui informasi skill "{skill.name}"
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Informasi Skill
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Skill Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Skill *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: React.js, Python, Digital Marketing"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            Gunakan nama yang spesifik dan mudah dipahami
                                        </p>
                                    </div>


                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Jelaskan tentang skill ini, kegunaan, atau konteks penggunaan..."
                                            rows={4}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-600">{errors.description}</p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            Deskripsi membantu pengguna memahami skill ini
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', checked)}
                                            />
                                            <div>
                                                <Label htmlFor="is_active" className="font-medium">
                                                    Status Aktif
                                                </Label>
                                                <p className="text-sm text-gray-500">
                                                    {data.is_active 
                                                        ? 'Skill ini akan tersedia untuk pengguna' 
                                                        : 'Skill ini akan disembunyikan dari pengguna'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        {!data.is_active && skill.users_count && skill.users_count > 0 && (
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                <div className="flex items-start gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-amber-800">Perhatian</p>
                                                        <p className="text-sm text-amber-700">
                                                            Skill ini sedang digunakan oleh {skill.users_count} pengguna. 
                                                            Menonaktifkan skill akan menyembunyikannya dari daftar skill yang tersedia,
                                                            namun data pengguna yang sudah menggunakan skill ini tetap tersimpan.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Skill Stats - Hidden */}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Statistik Skill</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Users className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{skill.users_count || 0}</p>
                                            <p className="text-sm text-gray-500">Pengguna menggunakan skill ini</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Calendar className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {new Date(skill.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                            <p className="text-sm text-gray-500">Tanggal dibuat</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-sm text-gray-500">Status saat ini:</p>
                                        <Badge
                                            variant={skill.is_active ? "default" : "secondary"}
                                            className={skill.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                        >
                                            {skill.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card> */}

                            {/* Guidelines Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Panduan Edit Skill</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-sm text-green-700">Tips Edit:</h4>
                                            <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                                <li>• Pastikan nama tetap jelas dan spesifik</li>
                                                <li>• Gunakan kategori yang konsisten</li>
                                                <li>• Perbarui deskripsi jika diperlukan</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm text-amber-700">Hati-hati:</h4>
                                            <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                                <li>• Mengubah nama akan mempengaruhi pencarian</li>
                                                <li>• Mengubah kategori dapat mempengaruhi filter</li>
                                                <li>• Menonaktifkan skill akan menyembunyikannya</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <Button 
                                            type="submit" 
                                            disabled={processing} 
                                            className="w-full"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            asChild 
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            <Link href={route('admin.skills.index')}>
                                                Batal
                                            </Link>
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