import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Eye, Users, Clock, CheckCircle, XCircle, Search, Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';

interface JobInvitation {
    id: number;
    status: string;
    message: string;
    created_at: string;
    responded_at: string | null;
    candidate: {
        id: number;
        name: string;
        email: string;
        profile: {
            avatar: string | null;
        } | null;
    };
    jobListing: {
        id: number;
        title: string;
        slug: string;
    } | null;
    sender: {
        id: number;
        name: string;
    };
}

interface PageProps {
    invitations: {
        data: JobInvitation[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: {
        total_invitations: number;
        pending_invitations: number;
        accepted_invitations: number;
        declined_invitations: number;
    };
    company: {
        id: number;
        name: string;
        logo: string | null;
    };
    filters: {
        search: string | null;
        status: string | null;
        per_page: number;
    };
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'accepted':
            return 'bg-green-100 text-green-800';
        case 'declined':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Menunggu';
        case 'accepted':
            return 'Diterima';
        case 'declined':
            return 'Ditolak';
        default:
            return status;
    }
};

export default function Index({ invitations, stats, company, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [isLoading, setIsLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(Date.now());

    const handleSearch = useCallback(() => {
        setIsLoading(true);
        router.get(route('company.job-invitations.index'), {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
            per_page: perPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    }, [search, status, perPage]);

    const handleRefresh = useCallback(() => {
        setIsLoading(true);
        setLastRefresh(Date.now());
        router.get(route('company.job-invitations.index'), {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
            per_page: perPage,
        }, {
            preserveState: false, // Force refresh data
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    }, [search, status, perPage]);

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setPerPage(10);
        router.get(route('company.job-invitations.index'));
    };

    // Auto-search with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search || status !== filters.status || perPage !== filters.per_page) {
                handleSearch();
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [search, status, perPage, handleSearch]);

    // Auto-refresh every 30 seconds when enabled
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            handleRefresh();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [autoRefresh, handleRefresh]);

    // Refresh when page becomes visible (user switches back to tab)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && autoRefresh) {
                // Add a small delay to ensure the page is fully visible
                setTimeout(() => {
                    handleRefresh();
                }, 1000);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [autoRefresh, handleRefresh]);
    return (
        <AppLayout>
            <Head title="Job Invitations - Company Dashboard" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Invitations</h1>
                    <p className="text-gray-600">Kelola undangan kerja yang telah dikirim kepada kandidat</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Users className="h-8 w-8 text-blue-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Undangan</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total_invitations}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Clock className="h-8 w-8 text-yellow-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Menunggu</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.pending_invitations}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Diterima</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.accepted_invitations}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Ditolak</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.declined_invitations}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Search and Filter */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Search className="h-5 w-5 text-gray-500" />
                                    <CardTitle className="text-lg">Cari & Filter Job Invitations</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRefresh}
                                        disabled={isLoading}
                                    >
                                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </Button>
                                    <Button
                                        variant={autoRefresh ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setAutoRefresh(!autoRefresh)}
                                    >
                                        {autoRefresh ? 'Auto ON' : 'Auto OFF'}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleReset}>
                                        Reset
                                    </Button>
                                </div>
                            </div>
                            {autoRefresh && (
                                <div className="text-xs text-gray-500 mt-2">
                                    Auto-refresh setiap 30 detik • Terakhir diperbarui: {new Date(lastRefresh).toLocaleTimeString('id-ID')}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search Input */}
                                <div className="md:col-span-2">
                                    <Input
                                        placeholder="Cari nama kandidat, email, atau posisi..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Status</SelectItem>
                                            <SelectItem value="pending">Menunggu</SelectItem>
                                            <SelectItem value="accepted">Diterima</SelectItem>
                                            <SelectItem value="declined">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Manual Search Button */}
                                <div>
                                    <Button onClick={handleSearch} variant="outline" className="w-full">
                                        <Search className="h-4 w-4 mr-2" />
                                        Cari Manual
                                    </Button>
                                </div>
                            </div>

                            {/* Per Page and Results Info */}
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <span>Tampilkan:</span>
                                    <Select value={perPage.toString()} onValueChange={(value) => setPerPage(parseInt(value))}>
                                        <SelectTrigger className="w-20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span>per halaman</span>
                                </div>
                                <div>
                                    Menampilkan {invitations.data.length} dari {invitations.total} invitations
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Invitations List */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Daftar Undangan Kerja</CardTitle>
                                    <CardDescription>
                                        Undangan yang telah dikirim kepada kandidat pilihan
                                    </CardDescription>
                                </div>
                                {isLoading && (
                                    <div className="flex items-center text-sm text-blue-600">
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Memperbarui...
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {invitations.data.length > 0 ? (
                                <div className="space-y-4">
                                    {invitations.data.map((invitation) => (
                                        <div key={invitation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={invitation.candidate.profile?.avatar ? `/storage/${invitation.candidate.profile.avatar}` : undefined}
                                                        />
                                                        <AvatarFallback>
                                                            {invitation.candidate.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {invitation.candidate.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {invitation.candidate.email}
                                                        </p>
                                                        <p className="text-sm text-gray-900 font-medium mt-1">
                                                            {invitation.jobListing?.title || 'General Job Invitation'}
                                                        </p>
                                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                            <span>Dikirim: {new Date(invitation.created_at).toLocaleDateString('id-ID')}</span>
                                                            {invitation.responded_at && (
                                                                <span>Direspon: {new Date(invitation.responded_at).toLocaleDateString('id-ID')}</span>
                                                            )}
                                                        </div>
                                                        {invitation.message && (
                                                            <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                                                                {invitation.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end space-y-2">
                                                    <Badge className={getStatusColor(invitation.status)}>
                                                        {getStatusText(invitation.status)}
                                                    </Badge>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                                            onClick={() => router.visit(route('company.job-invitations.messages.index', invitation.id))}
                                                        >
                                                            <MessageCircle className="h-4 w-4 mr-1" />
                                                            Chat dengan Kandidat
                                                        </Button>
                                                        {invitation.jobListing && (
                                                            <Button asChild variant="outline" size="sm">
                                                                <Link href={`/jobs/${invitation.jobListing.slug}`}>
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    Lihat Job
                                                                </Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Belum ada undangan kerja yang dikirim</p>
                                    <Button asChild className="mt-4">
                                        <Link href={route('company.talent-database')}>
                                            Jelajahi Talent Database
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            {/* Pagination */}
                            {invitations.data.length > 0 && invitations.last_page > 1 && (
                                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                    <div className="text-sm text-gray-600">
                                        Halaman {invitations.current_page} dari {invitations.last_page}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {invitations.links.map((link, index) => {
                                            if (!link.label) return null;

                                            const isActive = link.active;
                                            const isDisabled = !link.url;

                                            return (
                                                <Button
                                                    key={index}
                                                    variant={isActive ? "default" : "outline"}
                                                    size="sm"
                                                    disabled={isDisabled}
                                                    onClick={() => {
                                                        if (!isDisabled && link.url) {
                                                            router.visit(link.url, {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                    className={`min-w-[40px] ${isActive ? 'bg-blue-600 text-white' : ''}`}
                                                >
                                                    {link.label === '&laquo; Previous' ? (
                                                        <ChevronLeft className="h-4 w-4" />
                                                    ) : link.label === 'Next &raquo;' ? (
                                                        <ChevronRight className="h-4 w-4" />
                                                    ) : (
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    )}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}