import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { route } from 'ziggy-js';
import {
  MapPin,
  Users,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Briefcase,
  Eye,
  UserPlus,
  Edit,
  ToggleLeft,
  ToggleRight,
  Monitor,
  Star
} from 'lucide-react';

interface JobListing {
  id: number;
  slug: string;
  title: string;
  description: string;
  requirements: string;
  benefits: string[] | string;
  banner_image?: string;
  banner_image_url?: string;
  employment_type: string;
  work_arrangement: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  salary_negotiable: boolean;
  location: string;
  application_deadline?: string;
  positions_available: number;
  status: string;
  featured: boolean;
  views_count: number;
  applications_count: number;
  created_at: string;
  company: {
    id: number;
    name: string;
    description?: string;
    logo?: string;
    logo_url?: string;
    industry?: string;
    size?: string;
    location?: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  creator: {
    id: number;
    name: string;
    email: string;
  };
  skills?: Array<{
    id: number;
    name: string;
    category?: string;
  }>;
}

interface Props {
  jobListing: JobListing;
  userRole: string;
}

export default function Show({ jobListing, userRole }: Props) {
  const getEmploymentTypeLabel = (type: string) => {
    const typeLabels = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Contract',
      internship: 'Internship',
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
    router.post(route('admin.job-listings.toggle-status', jobListing.slug), {}, {
      onSuccess: () => {
        // Handle success
      },
    });
  };

  return (
    <AppLayout>
      <Head title={`Detail Lowongan - ${jobListing.title}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Banner Image */}
          {jobListing.banner_image_url && (
            <div className="h-48 md:h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
              <img
                src={jobListing.banner_image_url}
                alt={`Banner ${jobListing.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Job Header */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left Section */}
              <div className="flex gap-4">
                {/* Company Logo */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                  {jobListing.company.logo_url || jobListing.company.logo ? (
                    <img
                      src={jobListing.company.logo_url || `/storage/${jobListing.company.logo}`}
                      alt={jobListing.company.name}
                      className="w-full h-full object-contain bg-gray-50 rounded-lg p-2 border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border" style={{display: jobListing.company.logo_url || jobListing.company.logo ? 'none' : 'flex'}}>
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={jobListing.status === 'published' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {jobListing.status === 'published' ? 'Aktif' : 'Draft'}
                    </Badge>
                    {jobListing.featured && (
                      <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {jobListing.title}
                  </h1>

                  <p className="text-lg font-medium text-gray-700 mb-3">
                    {jobListing.company.name}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{jobListing.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{getEmploymentTypeLabel(jobListing.employment_type)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Monitor className="w-4 h-4" />
                      <span>{getWorkArrangementLabel(jobListing.work_arrangement)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{getExperienceLevelLabel(jobListing.experience_level)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.get(route('admin.job-listings.edit', jobListing.slug))}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant={jobListing.status === 'published' ? 'destructive' : 'default'}
                  onClick={toggleStatus}
                >
                  {jobListing.status === 'published' ? (
                    <>
                      <ToggleLeft className="w-4 h-4 mr-2" />
                      Tutup
                    </>
                  ) : (
                    <>
                      <ToggleRight className="w-4 h-4 mr-2" />
                      Publikasi
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>{jobListing.views_count} views</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserPlus className="w-4 h-4" />
                <span>{jobListing.applications_count} aplikasi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>{formatSalary(jobListing.salary_min, jobListing.salary_max)}</span>
              </div>
              {jobListing.application_deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {new Date(jobListing.application_deadline).toLocaleDateString('id-ID')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Detail Lowongan</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi Pekerjaan</h3>
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: jobListing.description }}
                  />
                </div>

                {/* Requirements */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Persyaratan</h3>
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: jobListing.requirements }}
                  />
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefit & Fasilitas</h3>
                  {(() => {
                    // Debug: Log the benefits data to understand its format

                    // Check if benefits is a non-empty array
                    if (Array.isArray(jobListing.benefits) && jobListing.benefits.length > 0) {
                      return (
                        <ul className="space-y-2">
                          {jobListing.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3 text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    // Check if benefits is a non-empty string
                    if (typeof jobListing.benefits === 'string' && jobListing.benefits.trim()) {
                      return (
                        <div
                          className="prose prose-sm max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{ __html: jobListing.benefits }}
                        />
                      );
                    }

                    // All other cases: null, undefined, empty array, empty string
                    return (
                      <div className="text-gray-500 italic">
                        Tidak ada informasi benefit yang tersedia
                      </div>
                    );
                  })()}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills yang Dibutuhkan</h3>
                  {jobListing.skills && jobListing.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {jobListing.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">
                      Tidak ada skills khusus yang diperlukan
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info - Hidden */}
            {/* <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Tentang Perusahaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    {jobListing.company.logo_url || jobListing.company.logo ? (
                      <img
                        src={jobListing.company.logo_url || `/storage/${jobListing.company.logo}`}
                        alt={jobListing.company.name}
                        className="w-full h-full object-contain bg-gray-50 rounded-lg p-1 border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border" style={{display: jobListing.company.logo_url || jobListing.company.logo ? 'none' : 'flex'}}>
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {jobListing.company.name}
                    </h4>
                    {jobListing.company.industry && (
                      <p className="text-sm text-gray-600">{jobListing.company.industry}</p>
                    )}
                  </div>
                </div>

                {jobListing.company.description && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {jobListing.company.description}
                  </p>
                )}
              </CardContent>
            </Card> */}

            {/* Job Details */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Detail Posisi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kategori</label>
                    <p className="mt-1">
                      <Badge variant="outline">{jobListing.category.name}</Badge>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Posisi Tersedia</label>
                    <p className="mt-1 font-semibold text-gray-900">{jobListing.positions_available} posisi</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gaji</label>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatSalary(jobListing.salary_min, jobListing.salary_max)}
                    </p>
                  </div>

                  {jobListing.application_deadline && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Batas Lamaran</label>
                      <p className="mt-1 font-semibold text-gray-900">
                        {new Date(jobListing.application_deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}