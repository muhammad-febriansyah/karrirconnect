import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Filter, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Briefcase, MapPin, Clock, Building2 } from 'lucide-react';

interface JobListing {
  id: number;
  slug: string;
  title: string;
  description: string;
  employment_type: string;
  work_arrangement: string;
  experience_level: string;
  salary_min: number;
  salary_max: number;
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
  };
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  is_verified: boolean;
  verification_status: string;
}

interface Props {
  jobListings: {
    data: JobListing[];
    current_page: number;
    last_page: number;
    total: number;
  };
  filters: {
    search?: string;
    status?: string;
    category?: string;
    employment_type?: string;
  };
  categories: Category[];
  userRole: string;
  company?: Company;
}

export default function JobListingsIndex({ jobListings, filters, categories, userRole, company }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [category, setCategory] = useState(filters.category || 'all');
  const [employmentType, setEmploymentType] = useState(filters.employment_type || 'all');

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

  const handleFilter = () => {
    router.get(route('admin.job-listings.index'), {
      search: search || undefined,
      status: status === 'all' ? undefined : status,
      category: category === 'all' ? undefined : category,
      employment_type: employmentType === 'all' ? undefined : employmentType,
    });
  };

  const toggleStatus = (jobListing: JobListing) => {
    router.post(route('admin.job-listings.toggle-status', jobListing.slug), {}, {
      onSuccess: () => {
        // Handle success
      },
    });
  };

  const deleteJobListing = (jobListing: JobListing) => {
    if (confirm(`Apakah Anda yakin ingin menghapus lowongan "${jobListing.title}"?`)) {
      router.delete(route('admin.job-listings.destroy', jobListing.slug));
    }
  };

  const formatSalary = (min: number, max: number) => {
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

  return (
    <AppLayout>
      <Head title="Manajemen Lowongan" />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Lowongan</h1>
            <p className="text-gray-600">
              {userRole === 'super_admin' ? 'Lihat semua lowongan pekerjaan' : 'Kelola lowongan pekerjaan perusahaan Anda'}
            </p>
          </div>
          {userRole === 'company_admin' && (
            company && company.is_verified && company.verification_status === 'verified' ? (
              <Link href="/admin/job-listings/create">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Buat Lowongan
                </Button>
              </Link>
            ) : (
              <Link href="/admin/company/verify">
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Verifikasi Untuk Buat Lowongan
                </Button>
              </Link>
            )
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Lowongan</p>
                  <p className="text-2xl font-bold">{jobListings.total}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dipublikasi</p>
                  <p className="text-2xl font-bold text-green-600">
                    {jobListings.data.filter(job => job.status === 'published').length}
                  </p>
                </div>
                <ToggleRight className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {jobListings.data.filter(job => job.status === 'draft').length}
                  </p>
                </div>
                <ToggleLeft className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Aplikasi</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {jobListings.data.reduce((sum, job) => sum + job.applications_count, 0)}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="Cari lowongan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Dipublikasi</SelectItem>
                  <SelectItem value="closed">Ditutup</SelectItem>
                  <SelectItem value="archived">Diarsip</SelectItem>
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipe Kerja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Kontrak</SelectItem>
                  <SelectItem value="internship">Magang</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleFilter} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Cari
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobListings.data.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge className={getStatusColor(job.status)}>
                            {getStatusLabel(job.status)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {job.company.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {getEmploymentTypeLabel(job.employment_type)}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <span><strong>Kategori:</strong> {job.category.name}</span>
                          <span><strong>Pengaturan:</strong> {getWorkArrangementLabel(job.work_arrangement)}</span>
                          <span><strong>Gaji:</strong> {formatSalary(job.salary_min, job.salary_max)}</span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
                          <span>{job.views_count} views</span>
                          <span>{job.applications_count} aplikasi</span>
                          <span>Dibuat: {new Date(job.created_at).toLocaleDateString('id-ID')}</span>
                          {job.application_deadline && (
                            <span>Deadline: {new Date(job.application_deadline).toLocaleDateString('id-ID')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={route('admin.job-listings.show', job.slug)}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat
                      </Button>
                    </Link>
                    
                    {userRole === 'company_admin' && (
                      <>
                        <Link href={route('admin.job-listings.edit', job.slug)}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>

                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleStatus(job)}
                        >
                          {job.status === 'published' ? 'Tutup' : 'Publikasi'}
                        </Button>

                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteJobListing(job)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobListings.data.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum ada lowongan pekerjaan</h3>
              <p className="text-gray-600 mb-4">
                {userRole === 'super_admin' 
                  ? 'Belum ada lowongan yang dibuat oleh perusahaan.'
                  : 'Mulai dengan membuat lowongan pekerjaan pertama Anda.'
                }
              </p>
              {userRole === 'company_admin' && (
                company && company.is_verified && company.verification_status === 'verified' ? (
                  <Link href="/admin/job-listings/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Buat Lowongan
                    </Button>
                  </Link>
                ) : (
                  <Link href="/admin/company/verify">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Verifikasi Untuk Buat Lowongan
                    </Button>
                  </Link>
                )
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}