import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Star,
  Send,
  Award,
  User,
  Clock,
  Globe,
  FileText,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  current_position?: string;
  avatar_url?: string;
  open_to_work?: boolean;
  experience_level?: string;
  expected_salary_min?: number;
  expected_salary_max?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  auth_provider?: string;
  profile?: UserProfile;
  skills?: Array<{ id: number; name: string }>;
}

interface JobListing {
  id: number;
  title: string;
}

interface Company {
  id: number;
  name: string;
  job_posting_points: number;
  can_invite: boolean;
}

interface Props {
  user: User;
  company: Company;
  jobListings: JobListing[];
}

export default function TalentDatabaseProfile({ user, company, jobListings }: Props) {
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    candidate_id: user.id.toString(),
    job_listing_id: '',
    message: '',
  });

  const handleSendInvitation = () => {
    post('/admin/job-invitations', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Job invitation berhasil dikirim!');
        setShowInvitationModal(false);
        reset();
      },
      onError: (errors) => {
        const errorMessage = Object.values(errors)[0] as string;
        toast.error(errorMessage || 'Terjadi kesalahan saat mengirim invitation.');
      }
    });
  };

  const formatSalaryRange = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);
    if (min && max) return `Rp ${formatNumber(min)} - ${formatNumber(max)}`;
    if (min) return `Mulai dari Rp ${formatNumber(min)}`;
    if (max) return `Hingga Rp ${formatNumber(max)}`;
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppLayout>
      <Head title={`Profil Kandidat - ${user.profile?.full_name || user.name}`} />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.visit('/admin/talent-database')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Database Pencari Kerja
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profil Kandidat</h1>
                <p className="text-gray-600 mt-1">
                  Detail lengkap kandidat dari database pencari kerja
                </p>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Poin Tersedia</div>
                <div className="text-xl font-bold text-blue-600">{company.job_posting_points}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.profile?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                        {(user.profile?.full_name || user.name).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {user.profile?.full_name || user.name}
                        </h2>
                        {user.profile?.open_to_work && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Star className="h-3 w-3 mr-1" />
                            Open to Work
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        {user.profile?.current_position && (
                          <div className="flex items-center text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2" />
                            <span>{user.profile.current_position}</span>
                          </div>
                        )}

                        {user.profile?.location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{user.profile.location}</span>
                          </div>
                        )}

                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{user.email}</span>
                        </div>

                        {user.profile?.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{user.profile.phone}</span>
                          </div>
                        )}

                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Bergabung {formatDate(user.created_at)}</span>
                        </div>

                        {user.auth_provider && (
                          <div className="flex items-center text-gray-600">
                            <Globe className="h-4 w-4 mr-2" />
                            <span>Registrasi via {user.auth_provider === 'google' ? 'Google' : 'Email'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Experience & Salary */}
              {(user.profile?.experience_level || formatSalaryRange(user.profile?.expected_salary_min, user.profile?.expected_salary_max)) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Pengalaman & Ekspektasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.profile?.experience_level && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Level Pengalaman</h4>
                        <Badge variant="outline" className="capitalize">
                          {user.profile.experience_level}
                        </Badge>
                      </div>
                    )}

                    {formatSalaryRange(user.profile?.expected_salary_min, user.profile?.expected_salary_max) && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Ekspektasi Gaji
                        </h4>
                        <p className="text-gray-700 font-medium">
                          {formatSalaryRange(user.profile?.expected_salary_min, user.profile?.expected_salary_max)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Bio */}
              {user.profile?.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Tentang Kandidat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {user.profile.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Keahlian</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="px-3 py-1">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Info Singkat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={user.profile?.open_to_work ? "default" : "secondary"}>
                      {user.profile?.open_to_work ? 'Mencari Kerja' : 'Tidak Aktif Mencari'}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Skills</p>
                    <p className="font-bold text-lg">{user.skills?.length || 0}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">ID Kandidat</p>
                    <p className="font-mono text-sm">{user.id}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setShowInvitationModal(true)}
                    disabled={!company.can_invite}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Kirim Job Invitation
                  </Button>

                  {!company.can_invite && (
                    <p className="text-xs text-gray-500 text-center">
                      Poin tidak mencukupi untuk mengirim invitation
                    </p>
                  )}

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Biaya per invitation:</span>
                      <span className="font-medium">1 poin</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Job Invitation Modal */}
      {showInvitationModal && (
        <Dialog open={showInvitationModal} onOpenChange={setShowInvitationModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Kirim Job Invitation</DialogTitle>
              <p className="text-sm text-gray-600">
                Kepada: {user.profile?.full_name || user.name}
              </p>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Pilih Lowongan (Opsional)</label>
                <Select value={data.job_listing_id} onValueChange={(value) => setData('job_listing_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lowongan atau biarkan kosong" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobListings.map((job) => (
                      <SelectItem key={job.id} value={job.id.toString()}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Pesan Personal (Opsional)</label>
                <Textarea
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  placeholder="Tulis pesan untuk menarik perhatian kandidat..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {data.message.length}/500 karakter
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Biaya: <span className="font-medium">1 poin</span>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowInvitationModal(false)}
                    disabled={processing}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleSendInvitation}
                    disabled={processing || !company.can_invite}
                  >
                    {processing ? 'Mengirim...' : 'Kirim Invitation'}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
}