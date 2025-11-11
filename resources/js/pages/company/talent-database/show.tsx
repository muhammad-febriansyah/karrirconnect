import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Send,
  MapPin,
  Briefcase,
  Mail,
  Coins,
  AlertCircle,
  User,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Globe,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface UserProfile {
  id: number;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  current_position?: string;
  experience?: any[];
  education?: any[];
  expected_salary_min?: number;
  expected_salary_max?: number;
  salary_currency?: string;
  open_to_work?: boolean;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

interface JobInvitation {
  id: number;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  responded_at?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_active: boolean;
  user_profile?: UserProfile;
  applications: Array<{
    id: number;
    job_listing: {
      id: number;
      title: string;
    };
  }>;
  job_invitations?: JobInvitation[];
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
  is_verified: boolean;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
}

interface Props {
  user: User;
  company: Company;
  jobListings: JobListing[];
}

export default function TalentProfileShow({ user, company, jobListings }: Props) {
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [selectedJobListing, setSelectedJobListing] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const formatSalaryRange = (min?: number, max?: number): string => {
    if (!min && !max) return 'Tidak disebutkan';

    const currency = user.user_profile?.salary_currency || 'IDR';
    const formatter = new Intl.NumberFormat('id-ID');

    if (min && max) {
      return `${currency} ${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `${currency} ${formatter.format(min)}+`;
    } else if (max) {
      return `Hingga ${currency} ${formatter.format(max)}`;
    }

    return 'Tidak disebutkan';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInvitationStatus = () => {
    if (!user.job_invitations || user.job_invitations.length === 0) {
      return { status: 'none', text: 'Belum pernah diundang', variant: 'secondary' as const };
    }

    const latestInvitation = user.job_invitations[0];
    switch (latestInvitation.status) {
      case 'pending':
        return { status: 'pending', text: 'Menunggu respons', variant: 'secondary' as const };
      case 'accepted':
        return { status: 'accepted', text: 'Diterima', variant: 'default' as const };
      case 'declined':
        return { status: 'declined', text: 'Ditolak', variant: 'destructive' as const };
      default:
        return { status: 'none', text: 'Belum pernah diundang', variant: 'secondary' as const };
    }
  };

  const getInvitationButtonState = () => {
    if (!company.can_invite) {
      return {
        canSend: false,
        buttonText: 'Poin Tidak Mencukupi',
        icon: 'Coins',
        variant: 'outline' as const,
        disabled: true,
        reason: 'insufficient_points'
      };
    }

    if (!user.job_invitations || user.job_invitations.length === 0) {
      return {
        canSend: true,
        buttonText: 'Kirim Job Invitation',
        icon: 'Send',
        variant: 'default' as const,
        disabled: false,
        reason: 'can_send'
      };
    }

    const latestInvitation = user.job_invitations[0];
    switch (latestInvitation.status) {
      case 'pending':
        return {
          canSend: false,
          buttonText: 'Menunggu Respons',
          icon: 'Clock',
          variant: 'outline' as const,
          disabled: true,
          reason: 'pending_response'
        };
      case 'accepted':
        return {
          canSend: false,
          buttonText: 'Undangan Diterima',
          icon: 'CheckCircle',
          variant: 'outline' as const,
          disabled: true,
          reason: 'already_accepted'
        };
      case 'declined':
        return {
          canSend: true,
          buttonText: 'Kirim Ulang Invitation',
          icon: 'Send',
          variant: 'default' as const,
          disabled: false,
          reason: 'can_resend'
        };
      default:
        return {
          canSend: true,
          buttonText: 'Kirim Job Invitation',
          icon: 'Send',
          variant: 'default' as const,
          disabled: false,
          reason: 'can_send'
        };
    }
  };

  const handleSendInvitation = async () => {
    if (!selectedJobListing) {
      toast.error('Pilih lowongan kerja terlebih dahulu');
      return;
    }

    setIsLoading(true);

    try {
      router.post(route('company.job-invitations.store'), {
        candidate_id: user.id,
        job_listing_id: selectedJobListing,
        message: invitationMessage,
      }, {
        preserveState: false,
        onSuccess: () => {
          toast.success('Job invitation berhasil dikirim!');
          setShowInvitationForm(false);
          setInvitationMessage('');
          setSelectedJobListing('');
        },
        onError: (errors) => {
          console.error('Invitation error:', errors);
          const errorMessage = Object.values(errors)[0] as string;
          toast.error(errorMessage || 'Terjadi kesalahan saat mengirim undangan');
        },
        onFinish: () => setIsLoading(false)
      });
    } catch (error) {
      toast.error('Terjadi kesalahan yang tidak terduga');
      setIsLoading(false);
    }
  };

  const invitationStatus = getInvitationStatus();
  const buttonState = getInvitationButtonState();

  return (
    <AppLayout>
      <Head title={`Profil Talent - ${user.name}`} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex items-center gap-2"
              >
                <Link href={route('company.talent-database')}>
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Talent Database
                </Link>
              </Button>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex flex-col md:flex-row gap-6 flex-1">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {user.user_profile?.full_name || user.name}
                        </h1>
                        <p className="text-xl text-gray-600 mb-3">
                          {user.user_profile?.current_position || 'Posisi tidak disebutkan'}
                        </p>

                        <div className="flex flex-wrap gap-3">
                          <Badge variant={user.user_profile?.open_to_work ? 'default' : 'secondary'}>
                            {user.user_profile?.open_to_work ? 'Terbuka untuk kerja' : 'Tidak terbuka untuk kerja'}
                          </Badge>

                          <Badge variant={invitationStatus.variant}>
                            {invitationStatus.text}
                          </Badge>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>

                        {user.user_profile?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{user.user_profile.phone}</span>
                          </div>
                        )}

                        {user.user_profile?.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{user.user_profile.location}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Bergabung {formatDate(user.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 md:min-w-[200px]">
                    <Button
                      onClick={() => buttonState.canSend ? setShowInvitationForm(true) : null}
                      className={buttonState.variant === 'default' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                      variant={buttonState.variant}
                      disabled={buttonState.disabled}
                    >
                      {buttonState.icon === 'Send' && <Send className="h-4 w-4 mr-2" />}
                      {buttonState.icon === 'Clock' && <Clock className="h-4 w-4 mr-2" />}
                      {buttonState.icon === 'CheckCircle' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {buttonState.icon === 'Coins' && <Coins className="h-4 w-4 mr-2" />}
                      {buttonState.buttonText}
                    </Button>

                    {buttonState.reason === 'insufficient_points' && (
                      <p className="text-xs text-red-600 text-center">
                        <Coins className="h-3 w-3 inline mr-1" />
                        Silakan isi poin terlebih dahulu
                      </p>
                    )}

                    {buttonState.reason === 'already_accepted' && (
                      <p className="text-xs text-green-600 text-center">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Kandidat sudah menerima undangan
                      </p>
                    )}

                    {buttonState.reason === 'pending_response' && (
                      <p className="text-xs text-yellow-600 text-center">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Menunggu respons kandidat
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {user.user_profile?.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tentang Kandidat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {user.user_profile.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {user.user_profile?.experience && user.user_profile.experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Pengalaman Kerja
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {user.user_profile.experience.map((exp: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-6 pb-6 last:pb-0">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-gray-900">{exp.position}</h3>
                            <p className="text-blue-600 font-medium">{exp.company}</p>
                            {exp.duration && (
                              <p className="text-sm text-gray-500">{exp.duration}</p>
                            )}
                            {exp.description && (
                              <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {user.user_profile?.education && user.user_profile.education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Pendidikan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {user.user_profile.education.map((edu: any, index: number) => (
                        <div key={index} className="border-l-4 border-green-200 pl-6 pb-6 last:pb-0">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-gray-900">{edu.degree}</h3>
                            <p className="text-green-600 font-medium">{edu.institution}</p>
                            {edu.year && (
                              <p className="text-sm text-gray-500">{edu.year}</p>
                            )}
                            {edu.description && (
                              <p className="text-gray-700 mt-3 leading-relaxed">{edu.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar Information */}
            <div className="space-y-6">
              {/* Salary Expectation */}
              {(user.user_profile?.expected_salary_min || user.user_profile?.expected_salary_max) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      Ekspektasi Gaji
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-green-600">
                      {formatSalaryRange(user.user_profile?.expected_salary_min, user.user_profile?.expected_salary_max)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">per bulan</p>
                  </CardContent>
                </Card>
              )}

              {/* Social Links */}
              {(user.user_profile?.linkedin_url || user.user_profile?.github_url || user.user_profile?.portfolio_url) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Tautan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.user_profile.linkedin_url && (
                        <a
                          href={user.user_profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-blue-600">LinkedIn</span>
                          <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                        </a>
                      )}

                      {user.user_profile.github_url && (
                        <a
                          href={user.user_profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                          <span className="font-medium text-gray-700">GitHub</span>
                          <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                        </a>
                      )}

                      {user.user_profile.portfolio_url && (
                        <a
                          href={user.user_profile.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-green-600">Portfolio</span>
                          <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Job Applications History */}
              {user.applications && user.applications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Riwayat Aplikasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.applications.slice(0, 5).map((application) => (
                        <div key={application.id} className="p-3 rounded-lg bg-gray-50">
                          <p className="font-medium text-sm text-gray-900">
                            {application.job_listing.title}
                          </p>
                        </div>
                      ))}
                      {user.applications.length > 5 && (
                        <p className="text-sm text-gray-500">
                          Dan {user.applications.length - 5} aplikasi lainnya...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Invitation History */}
              {user.job_invitations && user.job_invitations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Riwayat Undangan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.job_invitations.map((invitation) => (
                        <div key={invitation.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(invitation.created_at)}
                            </p>
                            {invitation.responded_at && (
                              <p className="text-xs text-gray-500">
                                Direspon: {formatDate(invitation.responded_at)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {invitation.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                            {invitation.status === 'accepted' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {invitation.status === 'declined' && <XCircle className="h-4 w-4 text-red-500" />}
                            <Badge variant={
                              invitation.status === 'accepted' ? 'default' :
                              invitation.status === 'declined' ? 'destructive' : 'secondary'
                            }>
                              {invitation.status === 'pending' ? 'Menunggu' :
                               invitation.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Invitation Modal */}
      {showInvitationForm && buttonState.canSend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Kirim Job Invitation</CardTitle>
              <p className="text-sm text-gray-600">
                Kepada: {user.user_profile?.full_name || user.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Lowongan Kerja *
                </label>
                <Select value={selectedJobListing} onValueChange={setSelectedJobListing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lowongan..." />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan (Opsional)
                </label>
                <Textarea
                  value={invitationMessage}
                  onChange={(e) => setInvitationMessage(e.target.value)}
                  placeholder="Tulis pesan untuk kandidat..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                <Coins className="h-4 w-4" />
                <span>Biaya: 1 poin</span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowInvitationForm(false)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSendInvitation}
                  disabled={isLoading || !selectedJobListing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Mengirim...' : 'Kirim Invitation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}