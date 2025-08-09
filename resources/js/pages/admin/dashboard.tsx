import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Users, Building2, Briefcase, FileText, TrendingUp, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Stats {
  total_users: number;
  total_companies: number;
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  pending_applications: number;
  featured_jobs: number;
  verified_companies: number;
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
  user: {
    name: string;
    profile?: {
      first_name?: string;
      last_name?: string;
    };
  };
  jobListing: {
    title: string;
    company: {
      name: string;
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
}

interface MonthlyData {
  month: string;
  users: number;
  jobs: number;
  applications: number;
  companies: number;
}

interface Props {
  stats: Stats;
  recentJobs: Job[];
  recentApplications: Application[];
  recentCompanies: Company[];
  monthlyStats: MonthlyData[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'closed': return 'bg-red-100 text-red-800';
    case 'paused': return 'bg-yellow-100 text-yellow-800';
    case 'pending': return 'bg-blue-100 text-blue-800';
    case 'hired': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminDashboard({ stats, recentJobs, recentApplications, recentCompanies, monthlyStats }: Props) {
  return (
    <AppLayout>
      <Head title="Dashboard Admin" />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Admin</h1>
            <p className="text-gray-600">Gambaran umum portal pekerjaan Anda</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Pencari kerja aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perusahaan</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_companies.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.verified_companies} terverifikasi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daftar Pekerjaan</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_jobs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active_jobs} aktif, {stats.featured_jobs} unggulan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lamaran</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_applications.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pending_applications} menunggu
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pekerjaan Terbaru</CardTitle>
              <CardDescription>Pekerjaan terbaru yang diposting di platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
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
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {application.user.profile?.first_name} {application.user.profile?.last_name} 
                      {!application.user.profile?.first_name && application.user.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {application.jobListing.title} at {application.jobListing.company.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Perusahaan Terbaru</CardTitle>
            <CardDescription>Perusahaan terbaru yang bergabung dengan platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCompanies.map((company) => (
                <div key={company.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
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
                  <p className="text-xs text-gray-500 mb-2">
                    {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}
                  </p>
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
      </div>
    </AppLayout>
  );
}