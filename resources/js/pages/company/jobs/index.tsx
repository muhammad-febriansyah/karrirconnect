import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  Pause, 
  BarChart3,
  Users,
  Briefcase,
  FileText,
  Coins,
  Clock,
  MapPin,
  DollarSign
} from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';

interface JobListing {
  id: number;
  title: string;
  description: string;
  employment_type: string;
  work_arrangement: string;
  experience_level: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  salary_negotiable: boolean;
  status: 'draft' | 'published' | 'closed' | 'paused';
  featured: boolean;
  views_count: number;
  applications_count: number;
  positions_available: number;
  application_deadline?: string;
  created_at: string;
  category: {
    id: number;
    name: string;
  };
}

interface Company {
  id: number;
  name: string;
  job_posting_points: number;
}

interface Stats {
  total_jobs: number;
  active_jobs: number;
  draft_jobs: number;
  total_applications: number;
  current_points: number;
}

interface Props {
  jobs: {
    data: JobListing[];
    links: any[];
    meta: any;
  };
  stats: Stats;
  company: Company;
}

export default function CompanyJobsIndex({ jobs, stats, company }: Props) {
  const toggleStatus = (job: JobListing) => {
    router.post(`/company/jobs/${job.id}/toggle-status`);
  };

  const deleteJob = (job: JobListing) => {
    if (confirm(`Apakah Anda yakin ingin menghapus lowongan "${job.title}"?`)) {
      router.delete(`/company/jobs/${job.id}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      draft: 'Draft',
      published: 'Aktif',
      paused: 'Dijeda',
      closed: 'Ditutup'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const formatSalary = (min?: number, max?: number, negotiable?: boolean) => {
    if (negotiable) return 'Dapat dinegosiasi';
    if (!min && !max) return 'Tidak ditentukan';
    if (min && max) return `Rp ${min.toLocaleString('id-ID')} - ${max.toLocaleString('id-ID')}`;
    if (min) return `Mulai dari Rp ${min.toLocaleString('id-ID')}`;
    return `Hingga Rp ${max?.toLocaleString('id-ID')}`;
  };

  return (
    <AppLayout>
      <Head title="Kelola Lowongan" />
      
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kelola Lowongan
              </h1>
              <p className="text-gray-600 mt-1">Kelola semua lowongan pekerjaan perusahaan Anda</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/company/points/packages">
                <Button variant="outline" className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  {company.job_posting_points} Poin
                </Button>
              </Link>
              <Link href="/company/jobs/create">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4" />
                  Posting Lowongan Baru
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Lowongan</p>
                  <p className="text-2xl font-bold text-blue-700">
                    <NumberTicker value={stats.total_jobs} className="text-2xl font-bold text-blue-700" />
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Lowongan Aktif</p>
                  <p className="text-2xl font-bold text-green-700">
                    <NumberTicker value={stats.active_jobs} className="text-2xl font-bold text-green-700" />
                  </p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Draft</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    <NumberTicker value={stats.draft_jobs} className="text-2xl font-bold text-yellow-700" />
                  </p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Pelamar</p>
                  <p className="text-2xl font-bold text-purple-700">
                    <NumberTicker value={stats.total_applications} className="text-2xl font-bold text-purple-700" />
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Poin Tersisa</p>
                  <p className="text-2xl font-bold text-orange-700">
                    <NumberTicker value={stats.current_points} className="text-2xl font-bold text-orange-700" />
                  </p>
                </div>
                <Coins className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Point Warning */}
        {company.job_posting_points <= 2 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Coins className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-amber-800">Poin Hampir Habis!</h4>
                  <p className="text-sm text-amber-700">
                    Anda hanya memiliki {company.job_posting_points} poin tersisa. Beli paket poin untuk terus posting lowongan.
                  </p>
                </div>
                <Link href="/company/points/packages">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Beli Poin
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.data.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          {job.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              ⭐ Featured
                            </Badge>
                          )}
                          {getStatusBadge(job.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {job.description.length > 150 
                            ? job.description.substring(0, 150) + '...' 
                            : job.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.employment_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{job.applications_count} pelamar</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>{job.views_count} dilihat</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatSalary(job.salary_min, job.salary_max, job.salary_negotiable)}</span>
                      </div>
                      {job.application_deadline && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Deadline: {new Date(job.application_deadline).toLocaleDateString('id-ID')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/company/jobs/${job.id}`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Lihat
                      </Button>
                    </Link>
                    
                    <Link href={`/company/jobs/${job.id}/edit`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>

                    {job.status !== 'closed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleStatus(job)}
                        className="flex items-center gap-1"
                      >
                        {job.status === 'published' ? (
                          <>
                            <Pause className="h-4 w-4" />
                            Jeda
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Aktifkan
                          </>
                        )}
                      </Button>
                    )}

                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteJob(job)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {jobs.data.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum ada lowongan</h3>
              <p className="text-gray-600 mb-4">
                Mulai dengan membuat lowongan pekerjaan pertama untuk perusahaan Anda.
              </p>
              <Link href="/company/jobs/create">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Posting Lowongan Pertama
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {jobs.meta.last_page > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {jobs.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 text-sm rounded-md ${
                    link.active
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border hover:bg-gray-50'
                  } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}