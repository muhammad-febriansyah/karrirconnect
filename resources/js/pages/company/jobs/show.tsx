import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Play,
  Pause,
  Eye,
  Users,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  Download,
  FileText
} from 'lucide-react';

interface JobListing {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
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
  skills: Array<{
    id: number;
    name: string;
  }>;
  applications?: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    applied_at: string;
    status: string;
  }>;
}

interface Props {
  job: JobListing;
}

export default function ShowJob({ job }: Props) {
  const toggleStatus = () => {
    router.post(`/company/jobs/${job.id}/toggle-status`);
  };

  const deleteJob = () => {
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
      <Head title={`Detail: ${job.title}`} />
      
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.get('/company/jobs')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-600">{job.category.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href={`/company/jobs/${job.id}/edit`}>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            
            {job.status !== 'closed' && (
              <Button 
                variant="outline"
                onClick={toggleStatus}
                className="flex items-center gap-2"
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
              variant="destructive"
              onClick={deleteJob}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Status & Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Status & Statistik</span>
                  <div className="flex items-center gap-2">
                    {job.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {getStatusBadge(job.status)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">{job.views_count}</p>
                    <p className="text-sm text-blue-600">Dilihat</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">{job.applications_count}</p>
                    <p className="text-sm text-green-600">Pelamar</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Briefcase className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-700">{job.positions_available}</p>
                    <p className="text-sm text-purple-600">Posisi</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-orange-700">
                      {new Date(job.created_at).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-sm text-orange-600">Dipublikasi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi Pekerjaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Persyaratan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefit & Fasilitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{job.benefits}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills yang Dibutuhkan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Applications */}
            {job.applications && job.applications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Pelamar Terbaru</span>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {job.applications.slice(0, 5).map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{application.user.name}</p>
                          <p className="text-sm text-gray-600">{application.user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(application.applied_at).toLocaleDateString('id-ID')}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {job.applications.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm">
                        Lihat Semua Pelamar ({job.applications_count})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detail Lowongan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Tipe Pekerjaan</p>
                    <p className="font-medium">{job.employment_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Lokasi</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Sistem Kerja</p>
                    <p className="font-medium">{job.work_arrangement}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Level Pengalaman</p>
                    <p className="font-medium">{job.experience_level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Gaji</p>
                    <p className="font-medium">
                      {formatSalary(job.salary_min, job.salary_max, job.salary_negotiable)}
                    </p>
                  </div>
                </div>

                {job.application_deadline && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Batas Melamar</p>
                      <p className="font-medium">
                        {new Date(job.application_deadline).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Lihat Preview Publik
                </Button>
                
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Pelamar
                </Button>
                
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Kelola Pelamar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}