import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, User, Briefcase, Building2, Mail, Phone, MapPin, Calendar, ExternalLink, Globe, Github, Linkedin, FileText, Eye, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Application {
  id: number;
  status: string;
  cover_letter?: string;
  resume_path?: string;
  additional_documents?: string[];
  admin_notes?: string;
  created_at: string;
  reviewed_at?: string;
  user: {
    id: number;
    name: string;
    email: string;
    profile?: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      location?: string;
      bio?: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
    };
  };
  jobListing: {
    id: number;
    title: string;
    slug: string;
    description: string;
    requirements?: string;
    benefits?: string;
    employment_type: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    salary_currency?: string;
    company: {
      id: number;
      name: string;
      description?: string;
      logo?: string;
      website?: string;
    };
  };
  reviewer?: {
    id: number;
    name: string;
  };
}

interface Props {
  application: Application;
  userRole: string;
}

export default function ApplicationShow({ application, userRole }: Props) {
  const [status, setStatus] = useState(application.status);
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusMapping = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu Peninjauan' },
      reviewing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sedang Ditinjau' },
      shortlisted: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Masuk Daftar Pendek' },
      interview: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Wawancara Terjadwal' },
      hired: { bg: 'bg-green-100', text: 'text-green-800', label: 'Diterima' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
    };

    const statusInfo = statusMapping[status as keyof typeof statusMapping] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

    return (
      <Badge className={`${statusInfo.bg} ${statusInfo.text} border-0`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getEmploymentTypeLabel = (type: string) => {
    const types = {
      'full_time': 'Full Time',
      'part_time': 'Part Time',
      'contract': 'Kontrak',
      'internship': 'Magang',
      'freelance': 'Freelance'
    };
    return types[type as keyof typeof types] || type;
  };

  const formatSalary = (min?: number, max?: number, currency = 'IDR') => {
    if (!min && !max) return 'Gaji tidak disebutkan';

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('id-ID').format(num);
    };

    if (min && max) {
      return `${currency} ${formatNumber(min)} - ${formatNumber(max)}`;
    } else if (min) {
      return `${currency} ${formatNumber(min)}+`;
    } else if (max) {
      return `Hingga ${currency} ${formatNumber(max)}`;
    }
  };

  const handleStatusUpdate = () => {
    setIsUpdating(true);
    router.patch(`/admin/applications/${application.id}/status`, {
      status,
      admin_notes: adminNotes,
    }, {
      onFinish: () => setIsUpdating(false),
      onSuccess: () => {
        toast.success('Status lamaran berhasil diperbarui!', {
          description: `Status telah diubah menjadi ${getStatusBadge(status).props.children}`,
          duration: 4000,
        });
        // Refresh page to show updated data
        router.reload();
      },
      onError: (errors) => {
        console.error('Update failed:', errors);
        toast.error('Gagal memperbarui status lamaran', {
          description: 'Silakan coba lagi beberapa saat.',
          duration: 4000,
        });
      }
    });
  };

  return (
    <AppLayout>
      <Head title={`Lamaran - ${application.user.name}`} />

      <div className="space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col space-y-4"
        >
          {/* Back Button */}
          <div>
            <Button
              variant="outline"
              onClick={() => router.get('/admin/applications')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Lamaran
            </Button>
          </div>

          {/* Detail Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Lamaran</h1>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(application.status)}
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(application.created_at).toLocaleDateString('id-ID')}
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Pelamar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nama Lengkap</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {application.user.profile?.first_name && application.user.profile?.last_name
                          ? `${application.user.profile.first_name} ${application.user.profile.last_name}`
                          : application.user.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="flex items-center gap-2 text-gray-900">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a
                          href={`mailto:${application.user.email}`}
                          className="text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {application.user.email}
                        </a>
                      </p>
                    </div>
                    {application.user.profile?.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Nomor Telepon</label>
                        <p className="flex items-center gap-2 text-gray-900">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a
                            href={`tel:${application.user.profile.phone}`}
                            className="text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {application.user.profile.phone}
                          </a>
                        </p>
                      </div>
                    )}
                    {application.user.profile?.location && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Lokasi</label>
                        <p className="flex items-center gap-2 text-gray-900">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {application.user.profile.location}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(application.user.profile?.linkedin || application.user.profile?.github || application.user.profile?.portfolio) && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-3 block">Tautan Profesional</label>
                        <div className="flex flex-wrap gap-3">
                          {application.user.profile?.linkedin && (
                            <a
                              href={application.user.profile.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <Linkedin className="h-4 w-4" />
                              LinkedIn
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {application.user.profile?.github && (
                            <a
                              href={application.user.profile.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              <Github className="h-4 w-4" />
                              GitHub
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {application.user.profile?.portfolio && (
                            <a
                              href={application.user.profile.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
                            >
                              <Globe className="h-4 w-4" />
                              Portfolio
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Bio */}
                  {application.user.profile?.bio && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-600">Bio</label>
                        <p className="mt-2 text-gray-900 whitespace-pre-wrap leading-relaxed">
                          {application.user.profile.bio}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Job Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Informasi Pekerjaan
                    </CardTitle>
                    <Link
                      href={`/jobs/${application.jobListing.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      Lihat Job Listing
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Job Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Posisi</label>
                      <p className="text-lg font-semibold text-gray-900">{application.jobListing.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tipe Pekerjaan</label>
                      <p className="text-gray-900">{getEmploymentTypeLabel(application.jobListing.employment_type)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lokasi</label>
                      <p className="flex items-center gap-2 text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {application.jobListing.location}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Gaji</label>
                      <p className="text-gray-900">
                        {formatSalary(application.jobListing.salary_min, application.jobListing.salary_max, application.jobListing.salary_currency)}
                      </p>
                    </div>
                  </div>

                  {/* Company Info */}
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-3 block">Perusahaan</label>
                    <div className="flex items-start gap-4">
                      {application.jobListing.company.logo && (
                        <img
                          src={application.jobListing.company.logo}
                          alt={`${application.jobListing.company.name} logo`}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{application.jobListing.company.name}</h3>
                          {application.jobListing.company.website && (
                            <a
                              href={application.jobListing.company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              <Globe className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                        {application.jobListing.company.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {application.jobListing.company.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Deskripsi Pekerjaan</label>
                    <div
                      className="mt-2 prose prose-sm max-w-none text-gray-900"
                      dangerouslySetInnerHTML={{ __html: application.jobListing.description }}
                    />
                  </div>

                  {/* Requirements */}
                  {application.jobListing.requirements && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-600">Persyaratan</label>
                        <div
                          className="mt-2 prose prose-sm max-w-none text-gray-900"
                          dangerouslySetInnerHTML={{ __html: application.jobListing.requirements }}
                        />
                      </div>
                    </>
                  )}

                  {/* Benefits */}
                  {application.jobListing.benefits && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-600">Manfaat & Tunjangan</label>
                        <div
                          className="mt-2 prose prose-sm max-w-none text-gray-900"
                          dangerouslySetInnerHTML={{ __html: application.jobListing.benefits }}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Cover Letter */}
            {application.cover_letter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Surat Lamaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                        {application.cover_letter}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Dokumen Lamaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {application.resume_path && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Resume/CV</p>
                          <p className="text-sm text-gray-600">Dokumen utama pelamar</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="hover:bg-blue-50" asChild>
                        <a
                          href={`/admin/applications/${application.id}/download/resume`}
                          target="_blank"
                          download
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  )}

                  {application.additional_documents?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-500 rounded-lg">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc}</p>
                          <p className="text-sm text-gray-600">Dokumen tambahan</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={`/admin/applications/${application.id}/download/document/${index}`}
                          target="_blank"
                          download
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}

                  {!application.resume_path && (!application.additional_documents || application.additional_documents.length === 0) && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Tidak ada dokumen yang diunggah</p>
                      <p className="text-gray-400 text-sm mt-1">Pelamar belum mengunggah CV atau dokumen pendukung</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Application Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline Lamaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Application Submitted */}
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Lamaran Dikirim</p>
                      <p className="text-sm text-gray-600">
                        {new Date(application.created_at).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Review Timeline */}
                  {application.reviewed_at && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Lamaran Ditinjau</p>
                        <p className="text-sm text-gray-600">
                          {new Date(application.reviewed_at).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {application.reviewer && (
                          <p className="text-sm text-gray-500">
                            oleh {application.reviewer.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Current Status */}
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                      application.status === 'hired' ? 'bg-green-500' :
                      application.status === 'rejected' ? 'bg-red-500' :
                      application.status === 'interview' ? 'bg-purple-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Status Saat Ini</p>
                      <div className="mt-1">
                        {getStatusBadge(application.status)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Status Update */}
            {userRole === 'company_admin' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Perbarui Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Status Lamaran</label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Menunggu Peninjauan</SelectItem>
                          <SelectItem value="reviewing">Sedang Ditinjau</SelectItem>
                          <SelectItem value="shortlisted">Masuk Daftar Pendek</SelectItem>
                          <SelectItem value="interview">Wawancara Terjadwal</SelectItem>
                          <SelectItem value="hired">Diterima</SelectItem>
                          <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Catatan Admin</label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Tambahkan catatan tentang lamaran ini..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleStatusUpdate}
                      disabled={isUpdating}
                      className="w-full"
                      size="lg"
                    >
                      {isUpdating ? 'Memperbarui...' : 'Perbarui Status'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Admin Notes History */}
            {application.admin_notes && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Catatan Sebelumnya
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap text-gray-900 leading-relaxed">
                        {application.admin_notes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Aksi Cepat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href={`mailto:${application.user.email}?subject=Mengenai lamaran ${application.jobListing.title}`}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Kirim Email
                    </a>
                  </Button>

                  {application.user.profile?.phone && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={`tel:${application.user.profile.phone}`}
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Telepon
                      </a>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link
                      href={`/jobs/${application.jobListing.slug}`}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Lihat Job Listing
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}