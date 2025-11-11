import React, { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
// import ModernNavbar from '@/components/modern-navbar';
// import ModernFooter from '@/components/modern-footer';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  MapPin,
  Shield,
  Target,
  Users,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';

interface Company {
  id: number;
  name: string;
  logo: string | null;
  logo_url?: string | null;
  location: string;
  industry?: string | null;
  is_verified: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Skill {
  id: number;
  name: string;
  pivot: {
    required: boolean;
    proficiency_level: string;
  };
}

interface JobListing {
  id: number;
  slug: string;
  title: string;
  description: string;
  requirements: string | null;
  benefits: string | string[] | null;
  employment_type: string;
  work_arrangement: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_negotiable: boolean;
  location: string;
  application_deadline: string | null;
  positions_available: number;
  status: string;
  featured: boolean;
  views_count: number;
  applications_count: number;
  created_at: string;
  banner_image?: string | null;
  banner_image_url?: string | null;
  company: Company;
  category: Category | null;
  skills: Skill[];
  remaining_positions: number;
  creator?: {
    id: number;
    name: string;
  };
}

import { SharedData } from '@/types';
import { route } from 'ziggy-js';
import MainLayout from '@/layouts/main-layout';

interface JobShowProps {
  job: JobListing;
  relatedJobs: JobListing[];
  hasApplied: boolean;
  isSaved?: boolean;
}

export default function JobShow({ job, relatedJobs, hasApplied, isSaved = false }: JobShowProps) {
  const { props } = usePage<SharedData>();
  const [isJobSaved, setIsJobSaved] = useState(isSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [showProfileCompletionPopup, setShowProfileCompletionPopup] = useState(false);

  // Check if user profile is complete
  const isProfileComplete = (user: any) => {
    if (!user || !user.profile) return false;

    const profile = user.profile;
    // Check for essential profile fields
    return !!(
      profile.first_name &&
      profile.last_name &&
      profile.phone &&
      profile.location
    );
  };

  const resolveMediaPath = (value?: string | null) => {
    if (!value) return null;
    if (value.startsWith('http') || value.startsWith('/')) {
      return value;
    }
    return typeof route !== 'undefined'
      ? route('media.public', { path: value })
      : `/media/${value}`;
  };

  const jobBannerUrl = job.banner_image_url || resolveMediaPath(job.banner_image ?? undefined);

  const companyLogoUrl = useMemo(() => {
    if (job.company.logo_url) return job.company.logo_url;
    return resolveMediaPath(job.company.logo ?? undefined);
  }, [job.company.logo_url, job.company.logo]);

  const handleSaveJob = async () => {
    // Check if user is authenticated
    if (!props.auth?.user) {
      // Redirect to login page
      router.visit(route('login'));
      return;
    }

    // Check if user profile is complete
    if (!isProfileComplete(props.auth.user)) {
      setShowProfileCompletionPopup(true);
      return;
    }

    try {
      setIsSaving(true);

      const response = await axios.post(`/api/v1/jobs/${job.slug}/save`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        withCredentials: true,
      });

      setIsJobSaved(response.data.saved);
    } catch (error: any) {
      console.error('Error saving job:', error);

      // Handle profile incomplete error from backend
      if (error.response?.data?.error === 'profile_incomplete') {
        setShowProfileCompletionPopup(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formatSalary = (min: number | null, max: number | null, currency: string = 'IDR', negotiable: boolean = false) => {
    if (negotiable) return 'Gaji dapat dinegosiasi';
    if (!min && !max) return 'Gaji tidak disebutkan';

    const formatNumber = (num: number) => {
      if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}M`;
      if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}jt`;
      if (num >= 1_000) return `${(num / 1_000).toFixed(0)}rb`;
      return num.toLocaleString();
    };

    const prefix = currency === 'IDR' ? 'Rp ' : `${currency} `;

    if (min && max) {
      return `${prefix}${formatNumber(min)} - ${prefix}${formatNumber(max)}`;
    }
    if (min) return `Mulai dari ${prefix}${formatNumber(min)}`;
    if (max) return `Hingga ${prefix}${formatNumber(max)}`;
    return 'Gaji tidak disebutkan';
  };

  const formatEmploymentType = (type: string) => {
    const typeMap: Record<string, string> = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Kontrak',
      internship: 'Magang',
      freelance: 'Freelance',
    };
    return typeMap[type] || type;
  };

  const formatWorkArrangement = (arrangement: string) => {
    const arrangementMap: Record<string, string> = {
      onsite: 'On-site',
      on_site: 'On-site',
      remote: 'Remote',
      hybrid: 'Hybrid',
    };
    return arrangementMap[arrangement] || arrangement;
  };

  const formatExperienceLevel = (level: string) => {
    const levelMap: Record<string, string> = {
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level',
      lead: 'Lead/Manager',
      director: 'Director',
    };
    return levelMap[level] || level;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 hari yang lalu';
    if (diffDays < 30) return `${diffDays} hari yang lalu`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 bulan yang lalu' : `${months} bulan yang lalu`;
    }
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 tahun yang lalu' : `${years} tahun yang lalu`;
  };

  const formatText = (text: string | null) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <div key={index} className="mb-2 last:mb-0">
        {line.startsWith('• ') || line.startsWith('- ') ? (
          <div className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span>{line.substring(2)}</span>
          </div>
        ) : (
          <div>{line}</div>
        )}
      </div>
    ));
  };

  const benefitsContent = useMemo<React.ReactNode | null>(() => {
    if (!job.benefits) return null;

    const sanitizeList = (values: string[]) =>
      values
        .flatMap((value) => {
          const text = (value ?? '')
            .replace(/<\/(p|li)>/gi, '\n')
            .replace(/<br\s*\/?>(?=\s|$)/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .split('\n');

          return text;
        })
        .map((item) => item.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean);

    if (Array.isArray(job.benefits)) {
      const values = job.benefits.filter((item) => typeof item === 'string') as string[];
      if (values.some((item) => item?.includes('<'))) {
        return (
          <div className="space-y-2 text-sm text-slate-700">
            {values.map((item, index) => (
              <div
                key={index}
                className="[&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))}
          </div>
        );
      }

      const sanitized = sanitizeList(values);
      if (sanitized.length === 0) return null;

      return (
        <ul className="space-y-2 text-sm text-slate-700">
          {sanitized.map((item, index) => (
            <li key={index} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    const trimmed = job.benefits.trim();
    if (!trimmed) return null;

    if (trimmed.includes('<')) {
      return (
        <div
          className="prose prose-slate max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: trimmed }}
        />
      );
    }

    const sanitized = sanitizeList([trimmed]);
    if (sanitized.length === 0) return null;

    return (
      <ul className="space-y-2 text-sm text-slate-700">
        {sanitized.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }, [job.benefits]);

  const summaryItems = useMemo(() => ([
    {
      icon: DollarSign,
      label: 'Rentang Gaji',
      value: formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable),
    },
    {
      icon: Briefcase,
      label: 'Tipe Pekerjaan',
      value: formatEmploymentType(job.employment_type),
    },
    {
      icon: Target,
      label: 'Level Pengalaman',
      value: formatExperienceLevel(job.experience_level),
    },
    {
      icon: Users,
      label: 'Posisi Tersedia',
      value: `${job.positions_available} posisi`,
    },
    {
      icon: Eye,
      label: 'Total Dilihat',
      value: `${job.views_count} kali`,
    },
    {
      icon: Calendar,
      label: 'Diposting',
      value: getDaysAgo(job.created_at),
    },
  ]), [job]);

  const renderSectionContent = (content: string | null, emptyMessage: string) => {
    if (!content) {
      return <p className="text-sm text-slate-500 italic">{emptyMessage}</p>;
    }

    if (content.includes('<')) {
      return (
        <div
          className="prose prose-slate max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    return <div className="space-y-2 text-sm leading-relaxed text-slate-700">{formatText(content)}</div>;
  };

  const related = useMemo(() => relatedJobs.slice(0, 4), [relatedJobs]);

  return (
        <MainLayout currentPage="jobs">
            <Head title={`${job.title} - ${job.company.name}`} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 space-y-8">
          <div>
            <Link
              href="/jobs"
              className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke daftar lowongan
            </Link>
          </div>

          <section className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            {jobBannerUrl && (
              <div className="relative h-44 sm:h-56 md:h-64">
                <img
                  src={jobBannerUrl}
                  alt={`Banner ${job.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {companyLogoUrl ? (
                      <img
                        src={companyLogoUrl}
                        alt={job.company.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {job.featured && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          Unggulan
                        </Badge>
                      )}
                      {job.category && (
                        <Badge variant="outline" className="border-slate-200 text-slate-700">
                          {job.category.name}
                        </Badge>
                      )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {job.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                      <Link
                        href={`/companies/${job.company.id}`}
                        className="font-medium hover:text-slate-900"
                      >
                        {job.company.name}
                      </Link>
                      {job.company.is_verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                          <Shield className="h-3.5 w-3.5" /> Terverifikasi
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                    {formatEmploymentType(job.employment_type)}
                  </Badge>
                  <Badge className="bg-purple-50 text-purple-700 border border-purple-200">
                    {formatWorkArrangement(job.work_arrangement)}
                  </Badge>
                  <Badge className="bg-rose-50 text-rose-700 border border-rose-200">
                    {formatExperienceLevel(job.experience_level)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {summaryItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <div className="mt-0.5 rounded-lg bg-white p-2 shadow-sm">
                      <item.icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  onClick={handleSaveJob}
                  disabled={isSaving}
                  variant={isJobSaved ? 'default' : 'outline'}
                  className={`w-full sm:w-auto ${
                    isJobSaved
                      ? 'bg-slate-900 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {isSaving ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : isJobSaved ? (
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <Bookmark className="mr-2 h-4 w-4" />
                  )}
                  {isJobSaved ? 'Disimpan' : 'Simpan Lowongan'}
                </Button>

                {hasApplied ? (
                  <Button
                    disabled
                    className="w-full sm:w-auto bg-slate-300 text-slate-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Sudah melamar
                  </Button>
                ) : (
                  <Link href={`/jobs/${job.slug}/apply`} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white">
                      Lamar Sekarang
                    </Button>
                  </Link>
                )}
              </div>

              {job.application_deadline && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  <Calendar className="h-4 w-4" />
                  Batas lamaran: {formatDate(job.application_deadline)}
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deskripsi Pekerjaan</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSectionContent(
                    job.description,
                    'Perusahaan belum menambahkan deskripsi pekerjaan.'
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kualifikasi & Persyaratan</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSectionContent(
                    job.requirements,
                    'Tidak ada persyaratan khusus yang disebutkan.'
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detail Tambahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Kuota Pelamar
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {job.positions_available} posisi ({job.remaining_positions} tersisa)
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Pelamar saat ini
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {job.applications_count} kandidat
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Status Lowongan
                      </p>
                      <p className="mt-1 font-semibold text-slate-900 capitalize">
                        {job.status}
                      </p>
                    </div>
                    {job.category && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Kategori
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {job.category.name}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {benefitsContent && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tunjangan & Fasilitas</CardTitle>
                  </CardHeader>
                  <CardContent>{benefitsContent}</CardContent>
                </Card>
              )}

              {job.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Keahlian yang Dibutuhkan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge
                          key={skill.id}
                          className={skill.pivot.required ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}
                        >
                          {skill.name}
                          {skill.pivot.required && <span className="ml-2 text-xs font-medium">Wajib</span>}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <aside className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Ringkasan Lowongan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2">
                      <DollarSign className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Rentang Gaji</p>
                      <p className="font-semibold text-slate-900">
                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-slate-100 p-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Lokasi</p>
                      <p className="font-semibold text-slate-900">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2">
                      <Users className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Pelamar</p>
                      <p className="font-semibold text-slate-900">{job.applications_count} kandidat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Tentang Perusahaan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                      {companyLogoUrl ? (
                        <img
                          src={companyLogoUrl}
                          alt={job.company.name}
                          className="w-full h-full object-contain p-1.5"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{job.company.name}</p>
                      <p className="text-xs text-slate-500">{job.company.industry || 'Perusahaan'}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/companies/${job.company.id}`}>Profil perusahaan</Link>
                  </Button>
                </CardContent>
              </Card>

              {related.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Lowongan Serupa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {related.map((relatedJob) => {
                      const logo = resolveMediaPath(relatedJob.company.logo_url ?? relatedJob.company.logo ?? undefined);
                      return (
                        <div key={relatedJob.id} className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            {logo ? (
                              <AvatarImage src={logo} alt={relatedJob.company.name} />
                            ) : (
                              <AvatarFallback className="bg-slate-200 text-slate-600">
                                <Building2 className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/jobs/${relatedJob.slug}`}
                              className="font-semibold text-sm text-slate-900 hover:text-slate-700 line-clamp-2"
                            >
                              {relatedJob.title}
                            </Link>
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {relatedJob.company.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatSalary(
                                relatedJob.salary_min,
                                relatedJob.salary_max,
                                relatedJob.salary_currency,
                                relatedJob.salary_negotiable
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </main>

      {/* Profile Completion Popup */}
      <Dialog open={showProfileCompletionPopup} onOpenChange={setShowProfileCompletionPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Lengkapi Data Diri</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <DialogDescription className="text-center mb-6">
              Lengkapi Data Diri untuk menyimpan lowongan ini
            </DialogDescription>
            <Button
              onClick={() => {
                setShowProfileCompletionPopup(false);
                router.visit(route('profile.edit'));
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Edit Profil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}