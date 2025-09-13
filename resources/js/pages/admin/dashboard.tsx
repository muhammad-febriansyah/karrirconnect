import DashboardCharts from '@/components/dashboard-charts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Briefcase, Building2, FileText, PieChart, Plus, TrendingUp, Users, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Stats {
    total_users: number;
    total_companies: number;
    total_jobs: number;
    active_jobs: number;
    total_applications: number;
    pending_applications: number;
    featured_jobs: number;
    verified_companies: number;
    draft_jobs?: number;
    company_points?: number;
    hired_applications?: number;
}

interface Job {
    id: number;
    title: string;
    status: string;
    featured: boolean;
    created_at: string;
    company: {
        id: number;
        name: string;
    };
    category: {
        id: number;
        name: string;
    };
    applications_count?: number;
}

interface Application {
    id: number;
    status: string;
    created_at: string;
    user?: {
        name?: string;
        profile?: {
            first_name?: string;
            last_name?: string;
        };
    };
    jobListing?: {
        title?: string;
        company?: {
            name?: string;
        };
    };
}

interface Company {
    id: number;
    name: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    job_listings_count?: number;
    max_active_jobs?: number;
    job_posting_points?: number;
}

interface MonthlyData {
    month: string;
    users: number;
    jobs: number;
    applications: number;
    companies: number;
}

interface ChartData {
    // Super Admin Data
    usersStats?: {
        total: number;
        monthly: number[];
        byRole: { role: string; count: number }[];
    };
    companiesStats?: {
        total: number;
        verified: number;
        monthly: number[];
    };
    jobsStats?: {
        total: number;
        active: number;
        monthly: number[];
        byCategory: { category: string; count: number }[];
    };
    applicationsStats?: {
        total: number;
        monthly: number[];
        byStatus: { status: string; count: number }[];
    };
    // Company Admin Data
    companyJobsStats?: {
        total: number;
        active: number;
        expired: number;
        monthly: number[];
    };
    companyApplicationsStats?: {
        total: number;
        pending: number;
        accepted: number;
        rejected: number;
        monthly: number[];
        byJob: { job_title: string; count: number }[];
    };
}

interface Props {
    stats: Stats;
    recentJobs: Job[];
    recentApplications: Application[];
    recentCompanies?: Company[];
    monthlyStats: MonthlyData[];
    userRole: string;
    company?: Company;
    chartData?: ChartData;
}

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} bulan lalu`;
    return `${Math.floor(diffInSeconds / 31536000)} tahun lalu`;
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'published':
            return 'bg-green-100 text-green-800';
        case 'draft':
            return 'bg-gray-100 text-gray-800';
        case 'closed':
            return 'bg-red-100 text-red-800';
        case 'paused':
            return 'bg-yellow-100 text-yellow-800';
        case 'pending':
            return 'bg-blue-100 text-blue-800';
        case 'hired':
            return 'bg-green-100 text-green-800';
        case 'rejected':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function AdminDashboard({
    stats,
    recentJobs,
    recentApplications,
    recentCompanies,
    monthlyStats,
    userRole,
    company,
    chartData,
}: Props) {
    // Debug: Log data untuk melihat apa yang diterima
    console.log('Recent Applications:', recentApplications);

    return (
        <AppLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold">{userRole === 'company_admin' ? 'Dashboard Perusahaan' : 'Dashboard Admin'}</h1>
                            {userRole === 'company_admin' && company && company.is_verified && company.verification_status === 'verified' && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verified Company
                                </Badge>
                            )}
                        </div>
                        {userRole === 'company_admin' && company && (
                            <p className="text-gray-600 font-medium">{company.name}</p>
                        )}
                        <p className="text-gray-600">
                            {userRole === 'company_admin' ? `Kelola lowongan dan lamaran ${company?.name}` : 'Gambaran umum portal pekerjaan Anda'}
                        </p>
                    </div>
                </div>

                {/* Company Verification Alert - Only for unverified company admins */}
                {userRole === 'company_admin' && company && !company.is_verified && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertDescription className="flex items-center justify-between">
                            <span className="text-yellow-800">
                                Verifikasi perusahaan anda untuk posting lowongan pekerjaan dan dapatkan akses ke banyak fitur.
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-4 border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                                asChild
                            >
                                <Link href={route('admin.company.verify')}>
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Verifikasi Perusahaan
                                </Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Company Verification Success Alert */}
                {userRole === 'company_admin' && company && company.is_verified && company.verification_status === 'verified' && (
                    <Alert className="border-green-200 bg-green-100">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    Perusahaan Anda telah diverifikasi dan dapat mengakses semua fitur premium.
                                </span>
                                <Badge className="bg-green-100 text-green-800 border-green-200 ml-3">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {userRole === 'super_admin' ? (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_users?.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">Pencari kerja aktif</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Perusahaan</CardTitle>
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_companies?.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">{stats.verified_companies} terverifikasi</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Lowongan</CardTitle>
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_jobs?.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.active_jobs} aktif, {stats.featured_jobs} unggulan
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Lamaran</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_applications?.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">{stats.pending_applications} menunggu review</p>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Lowongan Saya</CardTitle>
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_jobs?.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.active_jobs} aktif, {stats.draft_jobs} draft
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Poin Tersedia</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.company_points}</div>
                                    <p className="text-xs text-muted-foreground">poin posting lowongan</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Lowongan Aktif</CardTitle>
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.active_jobs}</div>
                                    <p className="text-xs text-muted-foreground">Lowongan aktif</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Biaya Posting</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1 poin</div>
                                    <p className="text-xs text-muted-foreground">per posisi tambahan (1 gratis)</p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Enhanced Charts Section */}
                {chartData && (
                    <div className="mb-8">
                        <div className="mb-6">
                            <h2 className="mb-2 text-xl font-semibold">Analisis Data</h2>
                            <p className="text-gray-600">
                                {userRole === 'company_admin'
                                    ? 'Grafik dan statistik untuk lowongan dan lamaran perusahaan Anda'
                                    : 'Visualisasi data platform secara keseluruhan'}
                            </p>
                        </div>
                        <DashboardCharts role={userRole as 'super_admin' | 'company_admin'} data={chartData} />
                    </div>
                )}

                {/* Legacy charts fallback */}
                {!chartData && monthlyStats && monthlyStats.length > 0 && userRole === 'company_admin' && (
                    <div className="mb-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="mr-2 h-5 w-5 text-[#2347FA]" />
                                    Tren Lamaran Bulanan
                                </CardTitle>
                                <CardDescription>Grafik perkembangan lamaran dalam 12 bulan terakhir</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart
                                        data={monthlyStats.map((stat) => ({
                                            month: stat.month,
                                            applications: stat.applications || 0,
                                        }))}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                                        <YAxis />
                                        <Tooltip labelFormatter={(label) => `Bulan: ${label}`} formatter={(value: number) => [value, 'Lamaran']} />
                                        <Line
                                            type="monotone"
                                            dataKey="applications"
                                            stroke="#2347FA"
                                            strokeWidth={3}
                                            dot={{ fill: '#2347FA', strokeWidth: 2, r: 5 }}
                                            activeDot={{ r: 7, stroke: '#2347FA', strokeWidth: 2, fill: '#ffffff' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Status Lamaran - Single column below the trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BarChart3 className="mr-2 h-5 w-5 text-[#2347FA]" />
                                    Status Lamaran
                                </CardTitle>
                                <CardDescription>Distribusi status lamaran untuk perusahaan Anda</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={[
                                            { name: 'Pending', value: stats.pending_applications, fill: '#F59E0B' },
                                            { name: 'Hired', value: stats.hired_applications || 0, fill: '#10B981' },
                                            { name: 'Total', value: stats.total_applications, fill: '#2347FA' },
                                        ]}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#2347FA" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Company admin additional charts */}
                {!chartData && userRole === 'company_admin' && (
                    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="mr-2 h-5 w-5 text-[#2347FA]" />
                                    Poin Perusahaan
                                </CardTitle>
                                <CardDescription>Sisa poin untuk posting pekerjaan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold text-[#2347FA]">{stats.company_points || 0}</div>
                                    <p className="mb-4 text-gray-600">Poin tersedia</p>
                                    <div className="text-sm text-gray-500">Setiap posting pekerjaan membutuhkan 1 poin</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <PieChart className="mr-2 h-5 w-5 text-[#2347FA]" />
                                    Status Lowongan
                                </CardTitle>
                                <CardDescription>Distribusi status lowongan pekerjaan Anda</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={[
                                                { name: 'Aktif', value: stats.active_jobs || 0, fill: '#10B981' },
                                                { name: 'Draft', value: stats.draft_jobs || 0, fill: '#F59E0B' },
                                                {
                                                    name: 'Tutup',
                                                    value: (stats.total_jobs || 0) - (stats.active_jobs || 0) - (stats.draft_jobs || 0),
                                                    fill: '#EF4444',
                                                },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            dataKey="value"
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                        >
                                            <Cell fill="#10B981" />
                                            <Cell fill="#F59E0B" />
                                            <Cell fill="#EF4444" />
                                        </Pie>
                                        <Tooltip formatter={(value: number, name: string) => [value, name]} />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Jobs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Pekerjaan Terbaru</CardTitle>
                            <CardDescription>Pekerjaan terbaru yang diposting di platform</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentJobs.map((job) => (
                                <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{job.title}</h4>
                                            {job.featured && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Unggulan
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{job.company.name}</p>
                                        <p className="text-xs text-gray-500">{formatTimeAgo(job.created_at)}</p>
                                    </div>
                                    <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Applications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lamaran Terbaru</CardTitle>
                            <CardDescription>Lamaran kerja terbaru</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentApplications.map((application) => {
                                console.log('Processing application:', {
                                    id: application.id,
                                    jobListing: application.jobListing,
                                    title: application.jobListing?.title,
                                    company: application.jobListing?.company,
                                });

                                return (
                                    <div key={application.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex-1">
                                            <h4 className="font-medium">
                                                {application.user?.profile?.first_name} {application.user?.profile?.last_name}
                                                {!application.user?.profile?.first_name && application.user?.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {application.jobListing?.title && application.jobListing?.company?.name
                                                    ? `${application.jobListing.title} di ${application.jobListing.company.name}`
                                                    : 'Data lamaran tidak tersedia'}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatTimeAgo(application.created_at)}</p>
                                        </div>
                                        <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Companies - Only for Super Admin */}
                {userRole === 'super_admin' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Perusahaan Terbaru</CardTitle>
                            <CardDescription>Perusahaan terbaru yang bergabung dengan platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {recentCompanies?.map((company) => (
                                    <div key={company.id} className="rounded-lg border p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h4 className="font-medium">{company.name}</h4>
                                            <div className="flex gap-1">
                                                {company.is_verified && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Terverifikasi
                                                    </Badge>
                                                )}
                                                {company.is_active && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Aktif
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <p className="mb-2 text-xs text-gray-500">{formatTimeAgo(company.created_at)}</p>
                                        {company.job_listings_count !== undefined && (
                                            <p className="text-sm text-gray-600">
                                                {company.job_listings_count} job{company.job_listings_count !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
