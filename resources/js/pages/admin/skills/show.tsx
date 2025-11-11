import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { 
    ArrowLeft, 
    Edit, 
    Users, 
    Calendar, 
    Award,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    pivot?: {
        proficiency_level: string;
        years_of_experience: number;
    };
}

interface Skill {
    id: number;
    name: string;
    category: string;
    description?: string;
    is_active: boolean;
    users_count?: number;
    created_at: string;
    updated_at: string;
    users: User[];
}

interface Props {
    skill: Skill;
}

export default function ShowSkill({ skill }: Props) {
    const handleToggleStatus = () => {
        router.post(route('admin.skills.toggle-status', skill.id), {}, {
            onSuccess: () => {
                const action = skill.is_active ? 'dinonaktifkan' : 'diaktifkan';
                toast.success(`Skill "${skill.name}" berhasil ${action}!`);
            },
            onError: () => {
                toast.error('Gagal mengubah status skill');
            }
        });
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Aktif
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
                <XCircle className="w-3 h-3 mr-1" />
                Nonaktif
            </Badge>
        );
    };

    const getCategoryBadge = (category: string) => {
        const colors = {
            'Programming': 'bg-blue-100 text-blue-800',
            'Design': 'bg-purple-100 text-purple-800',
            'Marketing': 'bg-green-100 text-green-800',
            'Business': 'bg-yellow-100 text-yellow-800',
            'Technical': 'bg-indigo-100 text-indigo-800',
        };

        const color = (colors as any)[category] || 'bg-gray-100 text-gray-800';

        return (
            <Badge variant="outline" className={color}>
                {category}
            </Badge>
        );
    };

    const getProficiencyBadge = (level: string) => {
        const colors = {
            'Beginner': 'bg-gray-100 text-gray-800',
            'Intermediate': 'bg-blue-100 text-blue-800', 
            'Advanced': 'bg-green-100 text-green-800',
            'Expert': 'bg-purple-100 text-purple-800',
        };

        const labels = {
            'Beginner': 'Pemula',
            'Intermediate': 'Menengah',
            'Advanced': 'Mahir', 
            'Expert': 'Ahli',
        };

        const color = (colors as any)[level] || 'bg-gray-100 text-gray-800';
        const label = (labels as any)[level] || level;

        return (
            <Badge variant="outline" className={color}>
                {label}
            </Badge>
        );
    };

    const getExperienceStats = () => {
        if (!skill.users || skill.users.length === 0) return null;

        const experiences = skill.users
            .filter(u => u.pivot?.years_of_experience !== undefined)
            .map(u => u.pivot!.years_of_experience);
        
        if (experiences.length === 0) return null;
        
        const avgExperience = experiences.reduce((a, b) => a + b, 0) / experiences.length;
        const maxExperience = Math.max(...experiences);
        const minExperience = Math.min(...experiences);

        return {
            average: Math.round(avgExperience * 10) / 10,
            max: maxExperience,
            min: minExperience
        };
    };

    const getProficiencyStats = () => {
        if (!skill.users || skill.users.length === 0) return {};

        const proficiencyCount = skill.users
            .filter(user => user.pivot?.proficiency_level)
            .reduce((acc, user) => {
                const level = user.pivot!.proficiency_level;
                acc[level] = (acc[level] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        return proficiencyCount;
    };

    const experienceStats = getExperienceStats();
    const proficiencyStats = getProficiencyStats();

    return (
        <AppLayout>
            <Head title={`Detail Skill: ${skill.name}`} />
            
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">{skill.name}</h1>
                            <p className="text-gray-600">
                                Detail skill dan pengguna yang menggunakannya
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={handleToggleStatus}
                            >
                                {skill.is_active ? (
                                    <>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Nonaktifkan
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Aktifkan
                                    </>
                                )}
                            </Button>
                            <Link href={route('admin.skills.edit', skill.id)}>
                                <Button>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Skill
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Skill Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Informasi Skill
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nama Skill</label>
                                        <p className="text-lg font-semibold">{skill.name}</p>
                                    </div>
                                    {/* <div>
                                        <label className="text-sm font-medium text-gray-500">Kategori</label>
                                        <div className="mt-1">
                                            {getCategoryBadge(skill.category)}
                                        </div>
                                    </div> */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div className="mt-1">
                                            {getStatusBadge(skill.is_active)}
                                        </div>
                                    </div>
                                    {/* <div>
                                        <label className="text-sm font-medium text-gray-500">Total Pengguna</label>
                                        <p className="text-lg font-semibold">{skill.users_count || 0}</p>
                                    </div> */}
                                </div>
                                
                                {skill.description && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                                        <p className="mt-1 text-gray-900">{skill.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Dibuat</label>
                                        <p className="font-medium">
                                            {new Date(skill.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Terakhir Diperbarui</label>
                                        <p className="font-medium">
                                            {new Date(skill.updated_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Users List */}
                        {skill.users && skill.users.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Pengguna yang Menggunakan Skill Ini ({skill.users.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Pengguna</TableHead>
                                                    <TableHead>Tingkat Keahlian</TableHead>
                                                    <TableHead>Pengalaman</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {skill.users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                    {user.avatar_url ? (
                                                                        <img
                                                                            src={user.avatar_url}
                                                                            alt={user.name}
                                                                            className="w-8 h-8 rounded-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-sm font-medium text-gray-600">
                                                                            {user.name.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">{user.name}</p>
                                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {user.pivot?.proficiency_level 
                                                                ? getProficiencyBadge(user.pivot.proficiency_level)
                                                                : <span className="text-gray-400">-</span>
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-medium">
                                                                {user.pivot?.years_of_experience 
                                                                    ? `${user.pivot.years_of_experience} tahun`
                                                                    : '-'
                                                                }
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats - Hidden */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Statistik Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{skill.users_count || 0}</p>
                                        <p className="text-sm text-gray-500">Total Pengguna</p>
                                    </div>
                                </div>

                                {experienceStats && (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{experienceStats.average} tahun</p>
                                                <p className="text-sm text-gray-500">Rata-rata Pengalaman</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Clock className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{experienceStats.min} - {experienceStats.max} tahun</p>
                                                <p className="text-sm text-gray-500">Rentang Pengalaman</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card> */}

                        {/* Proficiency Distribution */}
                        {Object.keys(proficiencyStats).length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Distribusi Keahlian</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {Object.entries(proficiencyStats).map(([level, count]) => (
                                        <div key={level} className="flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                {level === 'Beginner' ? 'Pemula' : 
                                                 level === 'Intermediate' ? 'Menengah' :
                                                 level === 'Advanced' ? 'Mahir' :
                                                 level === 'Expert' ? 'Ahli' : level}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="h-2 bg-blue-600 rounded-full"
                                                        style={{ 
                                                            width: `${(count / (skill.users_count || 1)) * 100}%` 
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold w-6">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Timestamps - Hidden */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi Waktu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">Dibuat</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(skill.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">Terakhir Diperbarui</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(skill.updated_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card> */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}