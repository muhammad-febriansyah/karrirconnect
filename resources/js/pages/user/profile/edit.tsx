import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Lock, Save, ArrowLeft, Plus, Trash2, Upload, FileText, Image, Briefcase, GraduationCap, Award, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';
// import ModernNavbar from '@/components/modern-navbar';
// import ModernFooter from '@/components/modern-footer';
import { Link } from '@inertiajs/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import MainLayout from '@/layouts/main-layout';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

interface UserProfile {
    id?: number;
    first_name?: string;
    last_name?: string;
    phone?: string;
    bio?: string;
    location?: string;
    current_position?: string;
    portfolio_url?: string;
    linkedin_url?: string;
    github_url?: string;
    expected_salary_min?: number;
    expected_salary_max?: number;
    salary_currency?: string;
    open_to_work?: boolean;
    experience?: any[];
    education?: any[];
    avatar?: string;
    resume?: string;
}

interface Skill {
    id: number;
    name: string;
    category: string;
    pivot?: {
        proficiency_level: string;
        years_of_experience: number;
    };
}

interface ProfileEditProps {
    user: User;
    profile?: UserProfile;
    userSkills: Skill[];
    allSkills: Skill[];
}

type ProfileTab = 'profile' | 'experience' | 'education' | 'skills' | 'files' | 'password';

// Helper function to check profile completeness
const checkProfileCompleteness = (profile: UserProfile | undefined, userSkills: Skill[]) => {
    if (!profile) {
        return {
            isComplete: false,
            missingFields: [
                'Nama depan',
                'Nama belakang', 
                'Nomor telepon',
                'Lokasi',
                'Deskripsi diri',
                'Posisi saat ini',
                'Pengalaman kerja atau pendidikan',
                'Keahlian/Skills'
            ]
        };
    }

    const missingFields = [];
    
    // Check basic required fields
    if (!profile.first_name) missingFields.push('Nama depan');
    if (!profile.last_name) missingFields.push('Nama belakang');
    if (!profile.phone) missingFields.push('Nomor telepon');
    if (!profile.location) missingFields.push('Lokasi');
    if (!profile.bio) missingFields.push('Deskripsi diri');
    if (!profile.current_position) missingFields.push('Posisi saat ini');
    
    // Check experience or education
    const hasExperience = profile.experience && Array.isArray(profile.experience) && profile.experience.length > 0;
    const hasEducation = profile.education && Array.isArray(profile.education) && profile.education.length > 0;
    
    if (!hasExperience && !hasEducation) {
        missingFields.push('Pengalaman kerja atau pendidikan');
    }
    
    // Check skills
    if (!userSkills || userSkills.length === 0) {
        missingFields.push('Keahlian/Skills');
    }
    
    return {
        isComplete: missingFields.length === 0,
        missingFields
    };
};

export default function ProfileEdit({ user, profile, userSkills, allSkills }: ProfileEditProps) {
    const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
    const handleTabChange = (value: ProfileTab) => {
        setActiveTab(value);
    };
    
    // Check profile completeness
    const profileCompleteness = checkProfileCompleteness(profile, userSkills);
    
    // Initialize form data
    const initialExperience = profile?.experience || [];
    const initialEducation = profile?.education || [];
    const initialSkills = userSkills.map(skill => ({
        skill_id: skill.id,
        proficiency_level: skill.pivot?.proficiency_level || 'Beginner',
        years_of_experience: skill.pivot?.years_of_experience || 0
    }));

    const { data: profileData, setData: setProfileData, post: postProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        name: user.name || '',
        email: user.email || '',
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        phone: profile?.phone || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        current_position: profile?.current_position || '',
        portfolio_url: profile?.portfolio_url || '',
        linkedin_url: profile?.linkedin_url || '',
        github_url: profile?.github_url || '',
        expected_salary_min: profile?.expected_salary_min || '',
        expected_salary_max: profile?.expected_salary_max || '',
        salary_currency: profile?.salary_currency || 'IDR',
        open_to_work: profile?.open_to_work ?? true,
        experience: initialExperience,
        education: initialEducation,
        skills: initialSkills,
        avatar: null as File | null,
        resume: null as File | null,
    });

    const { data: passwordData, setData: setPasswordData, patch: patchPassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check total form data size before submitting
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            const value = profileData[key as keyof typeof profileData];
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== null && value !== undefined) {
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
            }
        });

        // Calculate approximate form size (rough estimate)
        let totalSize = 0;
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                totalSize += value.size;
            } else {
                totalSize += new Blob([String(value)]).size;
            }
        }

        // Warn if size is approaching limit (450MB to be safe with 512MB limit)
        if (totalSize > 450 * 1024 * 1024) {
            toast.warning('Data terlalu besar', {
                description: 'Total ukuran data mendekati batas maksimal. Pertimbangkan untuk mengurangi ukuran file atau jumlah data.',
                duration: 5000,
            });
        }

        postProfile('/user/profile', {
            forceFormData: true,
            onError: (errors: any) => {
                // Check for PostTooLargeException specifically
                if (errors?.message?.includes('PostTooLargeException') ||
                    errors?.message?.includes('Content Too Large') ||
                    errors?.message?.includes('POST data is too large')) {
                    toast.error('Data terlalu besar untuk dikirim', {
                        description: 'Ukuran total data (termasuk file) melebihi batas maksimal. Silakan kurangi ukuran file atau jumlah data yang Anda input.',
                        duration: 7000,
                    });
                } else {
                    toast.error('Gagal memperbarui profil', {
                        description: 'Terjadi kesalahan saat menyimpan profil. Silakan periksa kembali data Anda.',
                    });
                }
            },
            onSuccess: () => {
                toast.success('Profil berhasil diperbarui!', {
                    description: 'Data profil Anda telah berhasil disimpan.',
                });
            }
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patchPassword('/user/profile/password', {
            onSuccess: () => {
                resetPassword();
                toast.success('Password berhasil diperbarui!', {
                    description: 'Password Anda telah berhasil diubah.',
                });
            },
            onError: (errors) => {
                console.error('Password update errors:', errors);
                toast.error('Gagal memperbarui password', {
                    description: 'Terjadi kesalahan saat mengubah password. Periksa kembali data Anda.',
                });
            }
        });
    };

    // Format number to Rupiah display
    const formatRupiah = (value: string | number) => {
        if (!value) return '';
        const number = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
        return new Intl.NumberFormat('id-ID').format(number);
    };

    // Handle Rupiah input
    const handleRupiahInput = (field: 'expected_salary_min' | 'expected_salary_max', value: string) => {
        // Remove all non-digit characters
        const numericValue = value.replace(/\D/g, '');
        setProfileData(field, numericValue);
    };

    // Experience handlers
    const addExperience = () => {
        setProfileData('experience', [
            ...profileData.experience,
            {
                company: '',
                position: '',
                start_date: '',
                end_date: '',
                is_current: false,
                description: ''
            }
        ]);
    };

    const removeExperience = (index: number) => {
        const newExperience = profileData.experience.filter((_, i) => i !== index);
        setProfileData('experience', newExperience);
    };

    const updateExperience = (index: number, field: string, value: any) => {
        const newExperience = [...profileData.experience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        setProfileData('experience', newExperience);
    };

    // Education handlers
    const addEducation = () => {
        setProfileData('education', [
            ...profileData.education,
            {
                institution: '',
                degree: '',
                field_of_study: '',
                start_date: '',
                end_date: '',
                is_current: false,
                description: ''
            }
        ]);
    };

    const removeEducation = (index: number) => {
        const newEducation = profileData.education.filter((_, i) => i !== index);
        setProfileData('education', newEducation);
    };

    const updateEducation = (index: number, field: string, value: any) => {
        const newEducation = [...profileData.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        setProfileData('education', newEducation);
    };

    // Skills handlers
    const addSkill = () => {
        setProfileData('skills', [
            ...profileData.skills,
            {
                skill_id: '',
                proficiency_level: 'Beginner',
                years_of_experience: 0
            }
        ]);
    };

    const removeSkill = (index: number) => {
        const newSkills = profileData.skills.filter((_, i) => i !== index);
        setProfileData('skills', newSkills);
    };

    const updateSkill = (index: number, field: string, value: any) => {
        const newSkills = [...profileData.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        setProfileData('skills', newSkills);
    };

    const tabs = [
        { id: 'profile', label: 'Profil Dasar', icon: User },
        { id: 'experience', label: 'Pengalaman', icon: Briefcase },
        { id: 'education', label: 'Pendidikan', icon: GraduationCap },
        { id: 'skills', label: 'Keahlian', icon: Award },
        { id: 'files', label: 'File & Foto', icon: FileText },
        { id: 'password', label: 'Password', icon: Lock },
    ];

    return (
        <MainLayout currentPage="profile">
            <Head title="Edit Profil" />
                
                <main className="pt-20 pb-12">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <Link 
                                href="/user/dashboard"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Profil</h1>
                            <p className="text-gray-600 mt-2">Kelola informasi personal dan pengaturan akun Anda</p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="mb-8 space-y-4">
                            <div className="md:hidden">
                                <Select value={activeTab} onValueChange={(value) => handleTabChange(value as ProfileTab)}>
                                    <SelectTrigger className="w-full" aria-label="Pilih bagian profil">
                                        <SelectValue placeholder="Pilih bagian profil" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tabs.map((tab) => (
                                            <SelectItem key={tab.id} value={tab.id}>
                                                {tab.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="hidden md:block">
                                <div className="border-b border-gray-200">
                                    <nav className="-mb-px flex flex-wrap gap-4 overflow-x-auto pb-1">
                                        {tabs.map((tab) => {
                                            const IconComponent = tab.icon;
                                            const isActive = activeTab === tab.id;
                                            return (
                                                <button
                                                    type="button"
                                                    key={tab.id}
                                                    onClick={() => handleTabChange(tab.id)}
                                                    className={`group inline-flex min-w-max items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                                                        isActive
                                                            ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
                                                            : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                                                    }`}
                                                    aria-pressed={isActive}
                                                    aria-current={isActive ? 'page' : undefined}
                                                    aria-label={tab.label}
                                                >
                                                    <IconComponent className="h-4 w-4" />
                                                    {tab.label}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Profile Completion Alert */}
                        {!profileCompleteness.isComplete && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6"
                            >
                                <Alert className="border-amber-200 bg-amber-50">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    <AlertDescription className="text-amber-800">
                                        <div className="font-medium mb-2">
                                            Profil Belum Lengkap - Diperlukan untuk Melamar Pekerjaan
                                        </div>
                                        <p className="mb-3 text-sm">
                                            Untuk dapat melamar pekerjaan, Anda perlu melengkapi informasi berikut:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 text-sm mb-3">
                                            {profileCompleteness.missingFields.map((field, index) => (
                                                <li key={index}>{field}</li>
                                            ))}
                                        </ul>
                                        <p className="text-xs text-amber-700">
                                            <strong>Tips:</strong> Profil yang lengkap meningkatkan peluang Anda dilihat oleh recruiter dan mendapatkan pekerjaan yang sesuai.
                                        </p>
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        {/* Profile Complete Notification */}
                        {profileCompleteness.isComplete && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6"
                            >
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        <div className="font-medium mb-1">
                                            Profil Lengkap - Siap untuk Melamar Pekerjaan
                                        </div>
                                        <p className="text-sm">
                                            Selamat! Profil Anda sudah lengkap dan siap untuk melamar berbagai pekerjaan. 
                                            <Link href="/jobs" className="font-medium underline ml-1 hover:text-green-900">
                                                Jelajahi lowongan kerja →
                                            </Link>
                                        </p>
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        {/* Error Display */}
                        {profileErrors.general && (
                            <Alert className="mb-6">
                                <AlertDescription className="text-red-600">
                                    {profileErrors.general}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Tab Content */}
                        <form onSubmit={handleProfileSubmit} className="space-y-8">
                            {/* Basic Profile Tab */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Informasi Dasar</CardTitle>
                                            <CardDescription>
                                                Informasi pribadi dan kontak Anda
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Nama Lengkap</Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData('name', e.target.value)}
                                                        required
                                                    />
                                                    {profileErrors.name && <p className="text-sm text-red-600">{profileErrors.name}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={profileData.email}
                                                        onChange={(e) => setProfileData('email', e.target.value)}
                                                        required
                                                    />
                                                    {profileErrors.email && <p className="text-sm text-red-600">{profileErrors.email}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="first_name">Nama Depan</Label>
                                                    <Input
                                                        id="first_name"
                                                        type="text"
                                                        value={profileData.first_name}
                                                        onChange={(e) => setProfileData('first_name', e.target.value)}
                                                    />
                                                    {profileErrors.first_name && <p className="text-sm text-red-600">{profileErrors.first_name}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="last_name">Nama Belakang</Label>
                                                    <Input
                                                        id="last_name"
                                                        type="text"
                                                        value={profileData.last_name}
                                                        onChange={(e) => setProfileData('last_name', e.target.value)}
                                                    />
                                                    {profileErrors.last_name && <p className="text-sm text-red-600">{profileErrors.last_name}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData('phone', e.target.value)}
                                                    />
                                                    {profileErrors.phone && <p className="text-sm text-red-600">{profileErrors.phone}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="location">Lokasi</Label>
                                                    <Input
                                                        id="location"
                                                        type="text"
                                                        value={profileData.location}
                                                        onChange={(e) => setProfileData('location', e.target.value)}
                                                        placeholder="Contoh: Jakarta, Indonesia"
                                                    />
                                                    {profileErrors.location && <p className="text-sm text-red-600">{profileErrors.location}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="current_position">Posisi Saat Ini</Label>
                                                    <Input
                                                        id="current_position"
                                                        type="text"
                                                        value={profileData.current_position}
                                                        onChange={(e) => setProfileData('current_position', e.target.value)}
                                                        placeholder="Contoh: Software Engineer"
                                                    />
                                                    {profileErrors.current_position && <p className="text-sm text-red-600">{profileErrors.current_position}</p>}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio/Deskripsi Diri</Label>
                                                <Textarea
                                                    id="bio"
                                                    rows={4}
                                                    value={profileData.bio}
                                                    onChange={(e) => setProfileData('bio', e.target.value)}
                                                    placeholder="Ceritakan tentang diri Anda, keahlian, dan pengalaman profesional..."
                                                />
                                                {profileErrors.bio && <p className="text-sm text-red-600">{profileErrors.bio}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Profil Profesional</CardTitle>
                                            <CardDescription>
                                                Tautan ke profil profesional dan media sosial Anda
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                                <Input
                                                    id="linkedin_url"
                                                    type="url"
                                                    value={profileData.linkedin_url}
                                                    onChange={(e) => setProfileData('linkedin_url', e.target.value)}
                                                    placeholder="https://linkedin.com/in/nama-anda"
                                                />
                                                <p className="text-xs text-gray-500">LinkedIn membantu recruiter mengetahui profil profesional Anda</p>
                                                {profileErrors.linkedin_url && <p className="text-sm text-red-600">{profileErrors.linkedin_url}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="portfolio_url">Website/Portfolio (Opsional)</Label>
                                                <Input
                                                    id="portfolio_url"
                                                    type="url"
                                                    value={profileData.portfolio_url}
                                                    onChange={(e) => setProfileData('portfolio_url', e.target.value)}
                                                    placeholder="https://website-anda.com"
                                                />
                                                <p className="text-xs text-gray-500">Website pribadi, portfolio, blog, atau profil bisnis online</p>
                                                {profileErrors.portfolio_url && <p className="text-sm text-red-600">{profileErrors.portfolio_url}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="github_url">GitHub URL (Khusus IT/Developer)</Label>
                                                <Input
                                                    id="github_url"
                                                    type="url"
                                                    value={profileData.github_url}
                                                    onChange={(e) => setProfileData('github_url', e.target.value)}
                                                    placeholder="https://github.com/username-anda"
                                                />
                                                <p className="text-xs text-gray-500">Hanya untuk posisi IT/Developer - opsional untuk profesi lainnya</p>
                                                {profileErrors.github_url && <p className="text-sm text-red-600">{profileErrors.github_url}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Ekspektasi Gaji</CardTitle>
                                            <CardDescription>
                                                Rentang gaji yang Anda harapkan (opsional)
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="expected_salary_min">Gaji Minimum</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rp</span>
                                                        <Input
                                                            id="expected_salary_min"
                                                            type="text"
                                                            value={formatRupiah(profileData.expected_salary_min)}
                                                            onChange={(e) => handleRupiahInput('expected_salary_min', e.target.value)}
                                                            placeholder="5.000.000"
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500">Gaji minimum yang Anda terima</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="expected_salary_max">Gaji Maksimum</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rp</span>
                                                        <Input
                                                            id="expected_salary_max"
                                                            type="text"
                                                            value={formatRupiah(profileData.expected_salary_max)}
                                                            onChange={(e) => handleRupiahInput('expected_salary_max', e.target.value)}
                                                            placeholder="10.000.000"
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500">Gaji maksimum yang Anda harapkan</p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">Tips Menentukan Gaji</h4>
                                                <ul className="text-sm text-blue-800 space-y-1">
                                                    <li>• Riset gaji standar untuk posisi serupa di industri Anda</li>
                                                    <li>• Pertimbangkan pengalaman, skill, dan lokasi kerja</li>
                                                    <li>• Buat rentang yang realistis (gap 20-30% antara min-max)</li>
                                                    <li>• Kosongkan jika ingin negosiasi langsung dengan perusahaan</li>
                                                </ul>
                                            </div>

                                            <div className="flex items-center space-x-2 pt-2">
                                                <Switch
                                                    id="open_to_work"
                                                    checked={profileData.open_to_work}
                                                    onCheckedChange={(checked) => setProfileData('open_to_work', checked)}
                                                />
                                                <div className="flex flex-col">
                                                    <Label htmlFor="open_to_work" className="font-medium">Sedang aktif mencari pekerjaan</Label>
                                                    <p className="text-xs text-gray-500">Tampilkan status "Open to Work" ke recruiter</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Experience Tab */}
                            {activeTab === 'experience' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <CardTitle>Pengalaman Kerja</CardTitle>
                                                    <CardDescription>
                                                        Tambahkan pengalaman kerja Anda
                                                    </CardDescription>
                                                </div>
                                                <Button type="button" onClick={addExperience} size="sm" className="w-full sm:w-auto">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Tambah Pengalaman
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {profileData.experience.map((exp: any, index: number) => (
                                                <div key={index} className="p-4 border rounded-lg space-y-4">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <h4 className="font-medium">Pengalaman {index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeExperience(index)}
                                                            className="w-full sm:w-auto"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Nama Perusahaan</Label>
                                                            <Input
                                                                value={exp.company || ''}
                                                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                                placeholder="PT. Contoh Indonesia"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Posisi/Jabatan</Label>
                                                            <Input
                                                                value={exp.position || ''}
                                                                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                                                placeholder="Software Engineer"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Tanggal Mulai</Label>
                                                            <Input
                                                                type="date"
                                                                value={exp.start_date || ''}
                                                                onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Tanggal Berakhir</Label>
                                                            <Input
                                                                type="date"
                                                                value={exp.end_date || ''}
                                                                onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                                                                disabled={exp.is_current}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            checked={exp.is_current || false}
                                                            onCheckedChange={(checked) => updateExperience(index, 'is_current', checked)}
                                                        />
                                                        <Label>Saat ini bekerja di sini</Label>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Deskripsi Pekerjaan</Label>
                                                        <Textarea
                                                            rows={3}
                                                            value={exp.description || ''}
                                                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                                            placeholder="Jelaskan tanggung jawab dan pencapaian Anda di posisi ini..."
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {profileData.experience.length === 0 && (
                                                <div className="text-center py-8 text-gray-500">
                                                    <p>Belum ada pengalaman kerja ditambahkan.</p>
                                                    <p className="text-sm">Klik "Tambah Pengalaman" untuk memulai.</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Education Tab */}
                            {activeTab === 'education' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <CardTitle>Riwayat Pendidikan</CardTitle>
                                                    <CardDescription>
                                                        Tambahkan riwayat pendidikan Anda
                                                    </CardDescription>
                                                </div>
                                                <Button type="button" onClick={addEducation} size="sm" className="w-full sm:w-auto">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Tambah Pendidikan
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {profileData.education.map((edu: any, index: number) => (
                                                <div key={index} className="p-4 border rounded-lg space-y-4">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <h4 className="font-medium">Pendidikan {index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeEducation(index)}
                                                            className="w-full sm:w-auto"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Institusi/Universitas</Label>
                                                            <Input
                                                                value={edu.institution || ''}
                                                                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                                placeholder="Universitas Indonesia"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Gelar/Tingkat</Label>
                                                            <Input
                                                                value={edu.degree || ''}
                                                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                                placeholder="Sarjana (S1)"
                                                            />
                                                        </div>
                                                        <div className="space-y-2 md:col-span-2">
                                                            <Label>Jurusan/Bidang Studi</Label>
                                                            <Input
                                                                value={edu.field_of_study || ''}
                                                                onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                                                                placeholder="Teknik Informatika"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Tanggal Mulai</Label>
                                                            <Input
                                                                type="date"
                                                                value={edu.start_date || ''}
                                                                onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Tanggal Lulus</Label>
                                                            <Input
                                                                type="date"
                                                                value={edu.end_date || ''}
                                                                onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                                                                disabled={edu.is_current}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            checked={edu.is_current || false}
                                                            onCheckedChange={(checked) => updateEducation(index, 'is_current', checked)}
                                                        />
                                                        <Label>Sedang menempuh pendidikan</Label>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Deskripsi/Prestasi</Label>
                                                        <Textarea
                                                            rows={3}
                                                            value={edu.description || ''}
                                                            onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                                            placeholder="IPK, prestasi, atau deskripsi lainnya..."
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {profileData.education.length === 0 && (
                                                <div className="text-center py-8 text-gray-500">
                                                    <p>Belum ada riwayat pendidikan ditambahkan.</p>
                                                    <p className="text-sm">Klik "Tambah Pendidikan" untuk memulai.</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === 'skills' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <CardTitle>Keahlian & Skills</CardTitle>
                                                    <CardDescription>
                                                        Tambahkan keahlian dan tingkat kemampuan Anda
                                                    </CardDescription>
                                                </div>
                                                <Button type="button" onClick={addSkill} size="sm" className="w-full sm:w-auto">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Tambah Keahlian
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {profileData.skills.map((skill: any, index: number) => (
                                                <div key={index} className="p-4 border rounded-lg">
                                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <h4 className="font-medium">Keahlian {index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeSkill(index)}
                                                            className="w-full sm:w-auto"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Skill/Keahlian</Label>
                                                            <Select value={skill.skill_id ? skill.skill_id.toString() : ""} onValueChange={(value) => updateSkill(index, 'skill_id', parseInt(value))}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pilih skill" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {allSkills.map((s) => (
                                                                        <SelectItem key={s.id} value={s.id.toString()}>
                                                                            {s.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Tingkat Keahlian</Label>
                                                            <Select value={skill.proficiency_level} onValueChange={(value) => updateSkill(index, 'proficiency_level', value)}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Beginner">Pemula</SelectItem>
                                                                    <SelectItem value="Intermediate">Menengah</SelectItem>
                                                                    <SelectItem value="Advanced">Mahir</SelectItem>
                                                                    <SelectItem value="Expert">Ahli</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Pengalaman (Tahun)</Label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="50"
                                                                value={skill.years_of_experience}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    // Remove leading zeros and parse
                                                                    const numValue = value === '' ? 0 : parseInt(value.replace(/^0+/, '') || '0');
                                                                    updateSkill(index, 'years_of_experience', numValue);
                                                                }}
                                                                onBlur={(e) => {
                                                                    // Remove leading zeros on blur
                                                                    const value = e.target.value;
                                                                    const numValue = value === '' ? 0 : parseInt(value.replace(/^0+/, '') || '0');
                                                                    updateSkill(index, 'years_of_experience', numValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {profileData.skills.length === 0 && (
                                                <div className="text-center py-8 text-gray-500">
                                                    <p>Belum ada keahlian ditambahkan.</p>
                                                    <p className="text-sm">Klik "Tambah Keahlian" untuk memulai.</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Files Tab */}
                            {activeTab === 'files' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Foto Profil & Dokumen</CardTitle>
                                            <CardDescription>
                                                Upload foto profil dan CV/Resume Anda
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="avatar">Foto Profil</Label>
                                                    <div className="mt-2">
                                                        <Input
                                                            id="avatar"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    // Check file size (2MB = 2 * 1024 * 1024 bytes)
                                                                    if (file.size > 2 * 1024 * 1024) {
                                                                        toast.error('Ukuran file terlalu besar', {
                                                                            description: 'Ukuran foto profil maksimal 2MB'
                                                                        });
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    
                                                                    // Check file type
                                                                    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                                                                    if (!validTypes.includes(file.type)) {
                                                                        toast.error('Format file tidak didukung', {
                                                                            description: 'Hanya file JPG, PNG, dan GIF yang diperbolehkan'
                                                                        });
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                }
                                                                setProfileData('avatar', file || null);
                                                            }}
                                                        />
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Format: JPG, PNG, GIF. Maksimal 2MB.
                                                        </p>
                                                    </div>
                                                    {profile?.avatar_url && (
                                                        <div className="mt-4">
                                                            <p className="text-sm font-medium text-gray-700">Foto saat ini:</p>
                                                            <img
                                                                src={profile.avatar_url}
                                                                alt="Current avatar"
                                                                className="mt-2 h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = '/favicon.svg';
                                                                    e.currentTarget.className = 'mt-2 h-20 w-20 rounded-full object-contain border-2 border-gray-200 bg-gray-100 p-2';
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                    {profileErrors.avatar && <p className="text-sm text-red-600">{profileErrors.avatar}</p>}
                                                </div>
                                                
                                                <Separator />
                                                
                                                <div>
                                                    <Label htmlFor="resume">CV/Resume</Label>
                                                    <div className="mt-2">
                                                        <Input
                                                            id="resume"
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    // Check file size (5MB = 5 * 1024 * 1024 bytes)
                                                                    if (file.size > 5 * 1024 * 1024) {
                                                                        toast.error('Ukuran file terlalu besar', {
                                                                            description: 'Ukuran CV/Resume maksimal 5MB'
                                                                        });
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    
                                                                    // Check file type
                                                                    const validTypes = [
                                                                        'application/pdf',
                                                                        'application/msword',
                                                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                                    ];
                                                                    if (!validTypes.includes(file.type)) {
                                                                        toast.error('Format file tidak didukung', {
                                                                            description: 'Hanya file PDF, DOC, dan DOCX yang diperbolehkan'
                                                                        });
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                }
                                                                setProfileData('resume', file || null);
                                                            }}
                                                        />
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Format: PDF, DOC, DOCX. Maksimal 5MB.
                                                        </p>
                                                    </div>
                                                    {profile?.resume && (
                                                        <div className="mt-4">
                                                            <p className="text-sm font-medium text-gray-700">CV/Resume saat ini:</p>
                                                            <a 
                                                                href={`/storage/${profile.resume}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700 transition-colors"
                                                                onClick={(e) => {
                                                                    // If file doesn't exist, prevent default and show error
                                                                    fetch(`/storage/${profile.resume}`, { method: 'HEAD' })
                                                                        .then(response => {
                                                                            if (!response.ok) {
                                                                                e.preventDefault();
                                                                                toast.error('File tidak ditemukan', {
                                                                                    description: 'CV/Resume tidak dapat diakses. Silakan upload ulang.'
                                                                                });
                                                                            }
                                                                        })
                                                                        .catch(() => {
                                                                            e.preventDefault();
                                                                            toast.error('File tidak dapat diakses', {
                                                                                description: 'Terjadi kesalahan saat mengakses CV/Resume.'
                                                                            });
                                                                        });
                                                                }}
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                                Lihat CV/Resume
                                                            </a>
                                                        </div>
                                                    )}
                                                    {profileErrors.resume && <p className="text-sm text-red-600">{profileErrors.resume}</p>}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Password Tab */}
                            {activeTab === 'password' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Ubah Password</CardTitle>
                                            <CardDescription>
                                                Pastikan akun Anda aman dengan password yang kuat
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4 max-w-md">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current_password">Password Saat Ini</Label>
                                                    <Input
                                                        id="current_password"
                                                        type="password"
                                                        value={passwordData.current_password}
                                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                    />
                                                    {passwordErrors.current_password && (
                                                        <p className="text-sm text-red-600">{passwordErrors.current_password}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="password">Password Baru</Label>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        value={passwordData.password}
                                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                                    />
                                                    {passwordErrors.password && (
                                                        <p className="text-sm text-red-600">{passwordErrors.password}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                                    <Input
                                                        id="password_confirmation"
                                                        type="password"
                                                        value={passwordData.password_confirmation}
                                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                    />
                                                    {passwordErrors.password_confirmation && (
                                                        <p className="text-sm text-red-600">{passwordErrors.password_confirmation}</p>
                                                    )}
                                                </div>
                                                <Button 
                                                    type="button" 
                                                    onClick={handlePasswordSubmit}
                                                    disabled={passwordProcessing}
                                                    className="w-full"
                                                >
                                                    {passwordProcessing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                                    <Lock className="mr-2 h-4 w-4" />
                                                    Ubah Password
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Submit Button for Profile Tabs */}
                            {activeTab !== 'password' && (
                                <div className="flex justify-end">
                                    <Button 
                                        type="submit" 
                                        disabled={profileProcessing}
                                        className="px-8"
                                    >
                                        {profileProcessing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>
                </main>
                
            </MainLayout>
    );
}
