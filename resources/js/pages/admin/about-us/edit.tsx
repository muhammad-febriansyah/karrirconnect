import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { AboutUs } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Save, Plus, Trash2, Eye, Users, Award, Briefcase, Heart, Target, Globe } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    aboutUs: AboutUs;
}

interface FormData {
    title: string;
    description: string;
    vision: string;
    mission: string;
    values: Array<{
        title: string;
        description: string;
        icon: string;
    }>;
    features: string[];
    stats: Array<{
        number: string;
        label: string;
        icon: string;
    }>;
    team: Array<{
        name: string;
        position: string;
        bio: string;
        image: string;
    }>;
    contact: {
        email: string[];
        phone: string[];
        address: string[];
    };
    cta_title: string;
    cta_description: string;
    is_active: boolean;
}

export default function EditAboutUs({ aboutUs }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: aboutUs.title || 'KarirConnect',
        description: aboutUs.description || '',
        vision: aboutUs.vision || '',
        mission: aboutUs.mission || '',
        values: aboutUs.values || [],
        features: aboutUs.features || [],
        stats: aboutUs.stats || [],
        team: aboutUs.team || [],
        contact: aboutUs.contact || { email: [], phone: [], address: [] },
        cta_title: aboutUs.cta_title || '',
        cta_description: aboutUs.cta_description || '',
        is_active: aboutUs.is_active ?? true,
    });

    const [activeTab, setActiveTab] = useState('basic');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/about-us', {
            onSuccess: () => {
                toast.success('Tentang Kami Berhasil Diperbarui!', {
                    description: 'Informasi tentang kami telah berhasil diperbarui.',
                    duration: 4000,
                });
            },
            onError: () => {
                toast.error('Gagal Memperbarui Data', {
                    description: 'Terjadi kesalahan saat memperbarui informasi tentang kami.',
                    duration: 4000,
                });
            },
        });
    };

    const addValue = () => {
        setData('values', [...data.values, { title: '', description: '', icon: 'heart' }]);
    };

    const removeValue = (index: number) => {
        setData('values', data.values.filter((_, i) => i !== index));
    };

    const updateValue = (index: number, field: keyof typeof data.values[0], value: string) => {
        const newValues = [...data.values];
        newValues[index] = { ...newValues[index], [field]: value };
        setData('values', newValues);
    };

    const addFeature = () => {
        setData('features', [...data.features, '']);
    };

    const removeFeature = (index: number) => {
        setData('features', data.features.filter((_, i) => i !== index));
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData('features', newFeatures);
    };

    const addStat = () => {
        setData('stats', [...data.stats, { number: '', label: '', icon: 'award' }]);
    };

    const removeStat = (index: number) => {
        setData('stats', data.stats.filter((_, i) => i !== index));
    };

    const updateStat = (index: number, field: keyof typeof data.stats[0], value: string) => {
        const newStats = [...data.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setData('stats', newStats);
    };

    const addTeamMember = () => {
        setData('team', [...data.team, { name: '', position: '', bio: '', image: '' }]);
    };

    const removeTeamMember = (index: number) => {
        setData('team', data.team.filter((_, i) => i !== index));
    };

    const updateTeamMember = (index: number, field: keyof typeof data.team[0], value: string) => {
        const newTeam = [...data.team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setData('team', newTeam);
    };

    const tabs = [
        { id: 'basic', label: 'Informasi Dasar' },
        { id: 'values', label: 'Nilai-Nilai' },
        { id: 'features', label: 'Fitur' },
        { id: 'stats', label: 'Statistik' },
        { id: 'team', label: 'Tim' },
        { id: 'contact', label: 'Kontak' },
        { id: 'cta', label: 'Call to Action' },
    ];

    return (
        <AppLayout>
            <Head title="Edit Tentang Kami" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Edit Tentang Kami
                        </h1>
                        <p className="text-gray-600">Kelola informasi tentang perusahaan</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tab Navigation */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-wrap gap-2">
                                {tabs.map((tab) => (
                                    <Button
                                        key={tab.id}
                                        type="button"
                                        variant={activeTab === tab.id ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.label}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Information */}
                    {activeTab === 'basic' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul/Nama Perusahaan</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Nama perusahaan"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Deskripsi singkat tentang perusahaan"
                                        rows={4}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vision">Visi</Label>
                                    <Textarea
                                        id="vision"
                                        value={data.vision}
                                        onChange={(e) => setData('vision', e.target.value)}
                                        placeholder="Visi perusahaan"
                                        rows={3}
                                    />
                                    <InputError message={errors.vision} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mission">Misi</Label>
                                    <Textarea
                                        id="mission"
                                        value={data.mission}
                                        onChange={(e) => setData('mission', e.target.value)}
                                        placeholder="Misi perusahaan"
                                        rows={3}
                                    />
                                    <InputError message={errors.mission} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <Label htmlFor="is_active">Aktif</Label>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Values */}
                    {activeTab === 'values' && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Nilai-Nilai Perusahaan</CardTitle>
                                    <Button type="button" onClick={addValue} size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Nilai
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.values.map((value, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">Nilai {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeValue(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Judul Nilai</Label>
                                                <Input
                                                    value={value.title}
                                                    onChange={(e) => updateValue(index, 'title', e.target.value)}
                                                    placeholder="Contoh: Kepedulian"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Icon</Label>
                                                <Input
                                                    value={value.icon}
                                                    onChange={(e) => updateValue(index, 'icon', e.target.value)}
                                                    placeholder="heart, users, target, globe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Deskripsi</Label>
                                            <Textarea
                                                value={value.description}
                                                onChange={(e) => updateValue(index, 'description', e.target.value)}
                                                placeholder="Deskripsi nilai"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Features */}
                    {activeTab === 'features' && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Fitur Unggulan</CardTitle>
                                    <Button type="button" onClick={addFeature} size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Fitur
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            placeholder="Nama fitur"
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFeature(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Statistics */}
                    {activeTab === 'stats' && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Statistik</CardTitle>
                                    <Button type="button" onClick={addStat} size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Statistik
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.stats.map((stat, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">Statistik {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeStat(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label>Angka</Label>
                                                <Input
                                                    value={stat.number}
                                                    onChange={(e) => updateStat(index, 'number', e.target.value)}
                                                    placeholder="1000+"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Label</Label>
                                                <Input
                                                    value={stat.label}
                                                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                    placeholder="Perusahaan Terdaftar"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Icon</Label>
                                                <Input
                                                    value={stat.icon}
                                                    onChange={(e) => updateStat(index, 'icon', e.target.value)}
                                                    placeholder="building, users, briefcase, award"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Team */}
                    {activeTab === 'team' && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Tim</CardTitle>
                                    <Button type="button" onClick={addTeamMember} size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Anggota Tim
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.team.map((member, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">Anggota Tim {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeTeamMember(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nama</Label>
                                                <Input
                                                    value={member.name}
                                                    onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                    placeholder="Nama lengkap"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Posisi</Label>
                                                <Input
                                                    value={member.position}
                                                    onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                                                    placeholder="CEO, CTO, dll"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Bio</Label>
                                            <Textarea
                                                value={member.bio}
                                                onChange={(e) => updateTeamMember(index, 'bio', e.target.value)}
                                                placeholder="Bio singkat"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>URL Gambar</Label>
                                            <Input
                                                value={member.image}
                                                onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                                                placeholder="/images/team/person.jpg"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Contact */}
                    {activeTab === 'contact' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Kontak</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <Label>Email</Label>
                                    {data.contact.email.map((email, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={email}
                                                onChange={(e) => {
                                                    const newEmails = [...data.contact.email];
                                                    newEmails[index] = e.target.value;
                                                    setData('contact', { ...data.contact, email: newEmails });
                                                }}
                                                placeholder="email@domain.com"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const newEmails = data.contact.email.filter((_, i) => i !== index);
                                                    setData('contact', { ...data.contact, email: newEmails });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setData('contact', { ...data.contact, email: [...data.contact.email, ''] })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Email
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <Label>Telepon</Label>
                                    {data.contact.phone.map((phone, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={phone}
                                                onChange={(e) => {
                                                    const newPhones = [...data.contact.phone];
                                                    newPhones[index] = e.target.value;
                                                    setData('contact', { ...data.contact, phone: newPhones });
                                                }}
                                                placeholder="+62 xxx xxxx xxxx"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const newPhones = data.contact.phone.filter((_, i) => i !== index);
                                                    setData('contact', { ...data.contact, phone: newPhones });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setData('contact', { ...data.contact, phone: [...data.contact.phone, ''] })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Telepon
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <Label>Alamat</Label>
                                    {data.contact.address.map((address, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={address}
                                                onChange={(e) => {
                                                    const newAddresses = [...data.contact.address];
                                                    newAddresses[index] = e.target.value;
                                                    setData('contact', { ...data.contact, address: newAddresses });
                                                }}
                                                placeholder="Alamat lengkap"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const newAddresses = data.contact.address.filter((_, i) => i !== index);
                                                    setData('contact', { ...data.contact, address: newAddresses });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setData('contact', { ...data.contact, address: [...data.contact.address, ''] })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Alamat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* CTA */}
                    {activeTab === 'cta' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Call to Action</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cta_title">Judul CTA</Label>
                                    <Input
                                        id="cta_title"
                                        value={data.cta_title}
                                        onChange={(e) => setData('cta_title', e.target.value)}
                                        placeholder="Judul call to action"
                                    />
                                    <InputError message={errors.cta_title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cta_description">Deskripsi CTA</Label>
                                    <Textarea
                                        id="cta_description"
                                        value={data.cta_description}
                                        onChange={(e) => setData('cta_description', e.target.value)}
                                        placeholder="Deskripsi call to action"
                                        rows={3}
                                    />
                                    <InputError message={errors.cta_description} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}