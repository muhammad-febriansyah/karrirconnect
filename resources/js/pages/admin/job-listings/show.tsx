import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Eye, MapPin, Clock, Building2, Users, Calendar, DollarSign, Briefcase } from 'lucide-react';

interface JobListing {
  id: number;
  title: string;
  description: string;
  requirements: string;
  benefits?: string[];
  employment_type: string;
  work_arrangement: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  status: string;
  views_count: number;
  applications_count: number;
  created_at: string;
  application_deadline?: string;
  company: {
    id: number;
    name: string;
    logo?: string;
    description?: string;
  };
  category: {
    id: number;
    name: string;
  };
  creator: {
    id: number;
    name: string;
  };
  skills?: Array<{
    id: number;
    name: string;
  }>;
}

interface Props {
  jobListing: JobListing;
  userRole?: string;
}

export default function ShowJobListing({ jobListing, userRole }: Props) {
  const getStatusColor = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      archived: 'bg-blue-100 text-blue-800',
    };
    
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      draft: 'Draft',
      published: 'Dipublikasi',
      closed: 'Ditutup',
      archived: 'Diarsip',
    };
    
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const getEmploymentTypeLabel = (type: string) => {
    const typeLabels = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Kontrak',
      internship: 'Magang',
      freelance: 'Freelance',
    };
    
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getWorkArrangementLabel = (arrangement: string) => {
    const arrangementLabels = {
      onsite: 'Onsite',
      remote: 'Remote',
      hybrid: 'Hybrid',
    };
    
    return arrangementLabels[arrangement as keyof typeof arrangementLabels] || arrangement;
  };

  const getExperienceLevelLabel = (level: string) => {
    const levelLabels = {
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level',
      executive: 'Executive',
    };
    
    return levelLabels[level as keyof typeof levelLabels] || level;
  };

  const formatSalary = (min?: number, max?: number) => {
    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);
    
    if (min && max) {
      return `Rp ${formatNumber(min)} - Rp ${formatNumber(max)}`;
    } else if (min) {
      return `Rp ${formatNumber(min)}+`;
    } else if (max) {
      return `Hingga Rp ${formatNumber(max)}`;
    }
    return 'Negosiasi';
  };

  const toggleStatus = () => {
    router.post(route('admin.job-listings.toggle-status', jobListing.id), {}, {
      onSuccess: () => {
        // Handle success
      },
    });
  };

  return (
    <AppLayout>
      <Head title={`Detail Lowongan - ${jobListing.title}`} />
      
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => router.get(route('admin.job-listings.index'))}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Lowongan
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{jobListing.title}</h1>
              <p className="text-gray-600">{jobListing.company.name}</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(jobListing.status)}>
                {getStatusLabel(jobListing.status)}
              </Badge>
              
              {userRole === 'company_admin' && (
                <>
                  <Link href={route('admin.job-listings.edit', jobListing.id)}>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Lowongan
                    </Button>
                  </Link>

                  <Button 
                    variant="outline"
                    onClick={toggleStatus}
                  >
                    {jobListing.status === 'published' ? 'Tutup Lowongan' : 'Publikasi Lowongan'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Lowongan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <p className="text-gray-600">Tipe</p>
                      <p className="font-medium">{getEmploymentTypeLabel(jobListing.employment_type)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <p className="text-gray-600">Lokasi</p>
                      <p className="font-medium">{jobListing.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <p className="text-gray-600">Pengaturan</p>
                      <p className="font-medium">{getWorkArrangementLabel(jobListing.work_arrangement)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <p className="text-gray-600">Level</p>
                      <p className="font-medium">{getExperienceLevelLabel(jobListing.experience_level)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="text-gray-600">Gaji</p>
                    <p className="font-medium">{formatSalary(jobListing.salary_min, jobListing.salary_max)}</p>
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
                <div 
                  className="prose max-w-none prose-sm"
                  dangerouslySetInnerHTML={{ __html: jobListing.description }}
                />
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Kualifikasi & Persyaratan</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none prose-sm"
                  dangerouslySetInnerHTML={{ __html: jobListing.requirements }}
                />
              </CardContent>
            </Card>

            {/* Skills */}
            {jobListing.skills && jobListing.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skill yang Dibutuhkan</CardTitle>
                </CardHeader>
                <CardContent>
                  {jobListing.skills && Array.isArray(jobListing.skills) && jobListing.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {jobListing.skills.map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Tidak ada skill yang disebutkan.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {jobListing.benefits && jobListing.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefit & Fasilitas</CardTitle>
                </CardHeader>
                <CardContent>
                  {jobListing.benefits && Array.isArray(jobListing.benefits) && jobListing.benefits.length > 0 ? (
                    <ul className="space-y-2">
                      {jobListing.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Tidak ada benefit yang disebutkan.</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Views</span>
                  </div>
                  <span className="font-medium">{jobListing.views_count}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Aplikasi</span>
                  </div>
                  <span className="font-medium">{jobListing.applications_count}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Dibuat</span>
                  </div>
                  <span className="font-medium text-sm">{new Date(jobListing.created_at).toLocaleDateString('id-ID')}</span>
                </div>

                {jobListing.application_deadline && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Deadline</span>
                    </div>
                    <span className="font-medium text-sm">{new Date(jobListing.application_deadline).toLocaleDateString('id-ID')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Perusahaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{jobListing.company.name}</p>
                    <p className="text-sm text-gray-600">Perusahaan</p>
                  </div>
                </div>
                
                {jobListing.company.description && (
                  <p className="text-sm text-gray-600">{jobListing.company.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Meta Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Tambahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Kategori:</span>
                  <span className="ml-2 font-medium">{jobListing.category.name}</span>
                </div>
                
                <div>
                  <span className="text-gray-600">Dibuat oleh:</span>
                  <span className="ml-2 font-medium">{jobListing.creator.name}</span>
                </div>
                
                <div>
                  <span className="text-gray-600">ID Lowongan:</span>
                  <span className="ml-2 font-mono">{jobListing.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}