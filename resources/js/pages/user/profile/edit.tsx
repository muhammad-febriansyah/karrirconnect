import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { User, Lock, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { Link } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
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
}

interface ProfileEditProps {
    user: User;
    profile?: UserProfile;
}

export default function ProfileEdit({ user, profile }: ProfileEditProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    
    const { data: profileData, setData: setProfileData, patch: patchProfile, processing: profileProcessing, errors: profileErrors } = useForm({
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
    });

    const { data: passwordData, setData: setPasswordData, patch: patchPassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patchProfile('/user/profile');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patchPassword('/user/profile/password', {
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <>
            <Head title="Edit Profil" />
            
            <div className="min-h-screen bg-gray-50">
                <ModernNavbar />
                
                <main className="pt-20 pb-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <div className="border-b border-gray-200 mb-8">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'profile'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <User className="h-4 w-4 inline mr-2" />
                                    Informasi Profil
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'password'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Lock className="h-4 w-4 inline mr-2" />
                                    Keamanan
                                </button>
                            </nav>
                        </div>

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="border-0 shadow-md">
                                    <CardHeader>
                                        <CardTitle>Informasi Personal</CardTitle>
                                        <CardDescription>
                                            Update informasi personal dan kontak Anda
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                                            {/* Basic Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Nama Lengkap *</Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData('name', e.target.value)}
                                                        className={profileErrors.name ? 'border-red-300' : ''}
                                                        required
                                                    />
                                                    {profileErrors.name && (
                                                        <p className="text-sm text-red-600">{profileErrors.name}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={profileData.email}
                                                        onChange={(e) => setProfileData('email', e.target.value)}
                                                        className={profileErrors.email ? 'border-red-300' : ''}
                                                        required
                                                    />
                                                    {profileErrors.email && (
                                                        <p className="text-sm text-red-600">{profileErrors.email}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="first_name">Nama Depan</Label>
                                                    <Input
                                                        id="first_name"
                                                        type="text"
                                                        value={profileData.first_name}
                                                        onChange={(e) => setProfileData('first_name', e.target.value)}
                                                        className={profileErrors.first_name ? 'border-red-300' : ''}
                                                    />
                                                    {profileErrors.first_name && (
                                                        <p className="text-sm text-red-600">{profileErrors.first_name}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="last_name">Nama Belakang</Label>
                                                    <Input
                                                        id="last_name"
                                                        type="text"
                                                        value={profileData.last_name}
                                                        onChange={(e) => setProfileData('last_name', e.target.value)}
                                                        className={profileErrors.last_name ? 'border-red-300' : ''}
                                                    />
                                                    {profileErrors.last_name && (
                                                        <p className="text-sm text-red-600">{profileErrors.last_name}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData('phone', e.target.value)}
                                                        className={profileErrors.phone ? 'border-red-300' : ''}
                                                    />
                                                    {profileErrors.phone && (
                                                        <p className="text-sm text-red-600">{profileErrors.phone}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="location">Lokasi</Label>
                                                    <Input
                                                        id="location"
                                                        type="text"
                                                        value={profileData.location}
                                                        onChange={(e) => setProfileData('location', e.target.value)}
                                                        className={profileErrors.location ? 'border-red-300' : ''}
                                                        placeholder="Jakarta, Indonesia"
                                                    />
                                                    {profileErrors.location && (
                                                        <p className="text-sm text-red-600">{profileErrors.location}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="current_position">Posisi Saat Ini</Label>
                                                <Input
                                                    id="current_position"
                                                    type="text"
                                                    value={profileData.current_position}
                                                    onChange={(e) => setProfileData('current_position', e.target.value)}
                                                    className={profileErrors.current_position ? 'border-red-300' : ''}
                                                    placeholder="Frontend Developer"
                                                />
                                                {profileErrors.current_position && (
                                                    <p className="text-sm text-red-600">{profileErrors.current_position}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio/Tentang Saya</Label>
                                                <Textarea
                                                    id="bio"
                                                    value={profileData.bio}
                                                    onChange={(e) => setProfileData('bio', e.target.value)}
                                                    className={profileErrors.bio ? 'border-red-300' : ''}
                                                    rows={4}
                                                    placeholder="Ceritakan tentang diri Anda..."
                                                />
                                                {profileErrors.bio && (
                                                    <p className="text-sm text-red-600">{profileErrors.bio}</p>
                                                )}
                                            </div>

                                            <Separator />

                                            {/* Social Links */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-4">Link Profil</h3>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="portfolio_url">Portfolio Website</Label>
                                                        <Input
                                                            id="portfolio_url"
                                                            type="url"
                                                            value={profileData.portfolio_url}
                                                            onChange={(e) => setProfileData('portfolio_url', e.target.value)}
                                                            className={profileErrors.portfolio_url ? 'border-red-300' : ''}
                                                            placeholder="https://myportfolio.com"
                                                        />
                                                        {profileErrors.portfolio_url && (
                                                            <p className="text-sm text-red-600">{profileErrors.portfolio_url}</p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="linkedin_url">LinkedIn</Label>
                                                            <Input
                                                                id="linkedin_url"
                                                                type="url"
                                                                value={profileData.linkedin_url}
                                                                onChange={(e) => setProfileData('linkedin_url', e.target.value)}
                                                                className={profileErrors.linkedin_url ? 'border-red-300' : ''}
                                                                placeholder="https://linkedin.com/in/username"
                                                            />
                                                            {profileErrors.linkedin_url && (
                                                                <p className="text-sm text-red-600">{profileErrors.linkedin_url}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="github_url">GitHub</Label>
                                                            <Input
                                                                id="github_url"
                                                                type="url"
                                                                value={profileData.github_url}
                                                                onChange={(e) => setProfileData('github_url', e.target.value)}
                                                                className={profileErrors.github_url ? 'border-red-300' : ''}
                                                                placeholder="https://github.com/username"
                                                            />
                                                            {profileErrors.github_url && (
                                                                <p className="text-sm text-red-600">{profileErrors.github_url}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={profileProcessing}>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {profileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="border-0 shadow-md">
                                    <CardHeader>
                                        <CardTitle>Ubah Password</CardTitle>
                                        <CardDescription>
                                            Update password untuk keamanan akun Anda
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="current_password">Password Saat Ini</Label>
                                                <Input
                                                    id="current_password"
                                                    type="password"
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                    className={passwordErrors.current_password ? 'border-red-300' : ''}
                                                    required
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
                                                    className={passwordErrors.password ? 'border-red-300' : ''}
                                                    required
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
                                                    className={passwordErrors.password_confirmation ? 'border-red-300' : ''}
                                                    required
                                                />
                                                {passwordErrors.password_confirmation && (
                                                    <p className="text-sm text-red-600">{passwordErrors.password_confirmation}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={passwordProcessing}>
                                                    <Lock className="h-4 w-4 mr-2" />
                                                    {passwordProcessing ? 'Mengubah...' : 'Ubah Password'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </main>
                
                <ModernFooter />
            </div>
        </>
    );
}