import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users,
  Send,
  MapPin,
  Briefcase,
  Mail,
  Coins,
  AlertCircle,
  User,
  Calendar,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Eye
} from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';
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

interface PaginatedUsers {
  data: User[];
  links?: any[];
  meta?: { total?: number };
  total?: number; // fallback shape from paginator
}

interface Props {
  users: PaginatedUsers;
  company: Company;
  jobListings: JobListing[];
  filters?: { search?: string; location?: string; open?: string };
  options?: { locations?: string[]; experiences?: string[] };
}

export default function TalentDatabase({ users, company, jobListings, filters, options }: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [selectedJobListing, setSelectedJobListing] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [search, setSearch] = useState(filters?.search || '');
  const [location, setLocation] = useState(filters?.location || '');
  const [open, setOpen] = useState(filters?.open || '');

  const handleViewProfile = (user: User) => {
    if (!company.is_verified) {
      setShowVerificationPopup(true);
      return;
    }
    router.visit(route('company.talent-database.show', user.id));
  };

  const handleOpenInvitation = (user: User) => {
    if (!company.is_verified) {
      setShowVerificationPopup(true);
      return;
    }
    setSelectedUser(user);
    setShowProfileModal(false);
  };

  const handleSendInvitation = async (userId: number) => {
    // Check if company is verified first
    if (!company.is_verified) {
      setShowVerificationPopup(true);
      return;
    }

    if (!company.can_invite) {
      toast.error('Poin tidak mencukupi untuk mengirim job invitation. Silakan top up terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    try {
      await router.post('/company/job-invitations', {
        candidate_id: userId,
        job_listing_id: selectedJobListing || null,
        message: invitationMessage
      }, {
        onSuccess: () => {
          toast.success('Job invitation berhasil dikirim!');
          setSelectedUser(null);
          setInvitationMessage('');
          setSelectedJobListing('');
        },
        onError: (errors) => {
          const errorMessage = Object.values(errors)[0] as string;
          toast.error(errorMessage || 'Terjadi kesalahan saat mengirim invitation.');
        }
      });
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim invitation.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInvitationStatus = (user: User) => {
    if (!user.job_invitations || user.job_invitations.length === 0) {
      return null;
    }
    return user.job_invitations[0]; // Latest invitation
  };

  const getInviteButtonConfig = (user: User) => {
    const invitation = getInvitationStatus(user);

    if (!invitation) {
      return {
        text: 'Send Job Invitation',
        icon: Send,
        variant: 'default' as const,
        disabled: !user.is_active,
        className: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    }

    switch (invitation.status) {
      case 'pending':
        return {
          text: 'Menunggu Respon',
          icon: Send,
          variant: 'secondary' as const,
          disabled: true,
          className: 'bg-yellow-50 text-yellow-600 border-yellow-200'
        };
      case 'accepted':
        return {
          text: 'Invitation Diterima',
          icon: Send,
          variant: 'secondary' as const,
          disabled: true,
          className: 'bg-green-50 text-green-600 border-green-200'
        };
      case 'declined':
        return {
          text: 'Invite Ulang',
          icon: Send,
          variant: 'outline' as const,
          disabled: !user.is_active,
          className: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
        };
      default:
        return {
          text: 'Invite',
          icon: Send,
          variant: 'default' as const,
          disabled: !user.is_active,
          className: ''
        };
    }
  };

  const totalUsers = users.meta?.total ?? users.total ?? users.data.length;

  const formatRupiah = (num?: number) => {
    if (num == null) return '';
    return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
  };

  const formatSalaryRange = (min?: number, max?: number) => {
    if (!min && !max) return '';
    if (min && max) return `${formatRupiah(min)} - ${formatRupiah(max)}`;
    if (min) return `Mulai dari ${formatRupiah(min)}`;
    if (max) return `Hingga ${formatRupiah(max)}`;
    return '';
  };

  return (
    <AppLayout>
      <Head title="Database Pencari Kerja" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Database Pencari Kerja</h1>
            <p className="text-muted-foreground mt-2">
              Undang kandidat terbaik untuk bergabung dengan perusahaan Anda
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && router.get('/company/talent-database', { search, location: location || undefined, open: open || undefined })}
                  placeholder="Cari kandidat (nama, email, ringkasan)"
                  className="w-full rounded-md border px-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua lokasi</SelectItem>
                  {(options?.locations || []).filter(Boolean).map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={open} onValueChange={setOpen}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="1">Open to work</SelectItem>
                  <SelectItem value="0">Tidak open</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={() => {
                const loc = location && location !== 'all' ? location : undefined;
                const op = open && open !== 'all' ? open : undefined;
                router.get('/company/talent-database', { search: search || undefined, location: loc, open: op })
              }}>
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setLocation('');
                  setOpen('');
                  router.get('/company/talent-database');
                }}
              >
                Hapus
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status Warning */}
        {!company.is_verified && (
          <Card className={`border-2 ${
            company.verification_status === 'rejected' ? 'border-red-200 bg-red-50' :
            company.verification_status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${
                  company.verification_status === 'rejected' ? 'bg-red-100' :
                  company.verification_status === 'pending' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {company.verification_status === 'rejected' ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : company.verification_status === 'pending' ? (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  {company.verification_status === 'rejected' ? (
                    <>
                      <h4 className="font-medium text-red-800">Verifikasi Ditolak</h4>
                      <p className="text-sm text-red-700">
                        Verifikasi perusahaan ditolak. Anda tidak dapat mengirim job invitation hingga verifikasi berhasil.
                      </p>
                    </>
                  ) : company.verification_status === 'pending' ? (
                    <>
                      <h4 className="font-medium text-yellow-800">Menunggu Verifikasi</h4>
                      <p className="text-sm text-yellow-700">
                        Perusahaan dalam proses verifikasi. Anda belum bisa mengirim job invitation hingga verifikasi selesai.
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-medium text-blue-800">Belum Diverifikasi</h4>
                      <p className="text-sm text-blue-700">
                        Lengkapi verifikasi perusahaan untuk dapat melihat profil kandidat dan mengirim job invitation.
                      </p>
                    </>
                  )}
                </div>
                {company.verification_status !== 'pending' && (
                  <Button
                    size="sm"
                    className={company.verification_status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                    onClick={() => router.visit('/company/profile')}
                  >
                    {company.verification_status === 'rejected' ? 'Perbaiki Verifikasi' : 'Verifikasi Sekarang'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kandidat</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={totalUsers} />
              </div>
              <p className="text-xs text-muted-foreground">
                Pencari kerja aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Poin Tersedia</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={company.job_posting_points} />
              </div>
              <p className="text-xs text-muted-foreground">
                Untuk job invitation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lowongan Aktif</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={jobListings.length} />
              </div>
              <p className="text-xs text-muted-foreground">
                Posisi tersedia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biaya Invitation</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Poin per invitation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pencari Kerja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.data.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{user.user_profile?.full_name || user.name}</h3>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                        {(() => {
                          const invitation = getInvitationStatus(user);
                          if (!invitation) return null;

                          const statusConfig = {
                            pending: { text: 'Pending Invitation', className: 'bg-yellow-100 text-yellow-800' },
                            accepted: { text: 'Invitation Accepted', className: 'bg-green-100 text-green-800' },
                            declined: { text: 'Invitation Declined', className: 'bg-red-100 text-red-800' }
                          };

                          const config = statusConfig[invitation.status];

                          return (
                            <Badge className={config.className}>
                              {config.text}
                            </Badge>
                          );
                        })()}
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>

                        {user.user_profile?.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{user.user_profile.location}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>Bergabung {formatDate(user.created_at)}</span>
                        </div>

                        {user.user_profile?.experience_level && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3 w-3" />
                            <span>Level: {user.user_profile.experience_level}</span>
                          </div>
                        )}
                      </div>

                      {user.user_profile?.bio && (
                        <p className="text-sm mt-2 line-clamp-2">{user.user_profile.bio}</p>
                      )}

                      {user.applications.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Pernah melamar: {user.applications.slice(0, 2).map(app => app.job_listing.title).join(', ')}
                            {user.applications.length > 2 && ` dan ${user.applications.length - 2} lainnya`}
                          </p>
                        </div>
                      )}

                      {(() => {
                        const invitation = getInvitationStatus(user);
                        if (!invitation) return null;

                        return (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              Invitation dikirim: {formatDate(invitation.created_at)}
                              {invitation.responded_at && ` • Direspon: ${formatDate(invitation.responded_at)}`}
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {/* View Profile Button */}
                      <Button
                        onClick={() => handleViewProfile(user)}
                        disabled={!user.is_active}
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Profil
                      </Button>

                      {/* Job Invitation Button */}
                      {(() => {
                        const buttonConfig = getInviteButtonConfig(user);
                        const IconComponent = buttonConfig.icon;

                        return (
                          <Button
                            onClick={() => buttonConfig.disabled ? null : handleOpenInvitation(user)}
                            disabled={buttonConfig.disabled}
                            variant={buttonConfig.variant}
                            size="sm"
                            className={buttonConfig.className}
                          >
                            <IconComponent className="h-4 w-4 mr-2" />
                            {buttonConfig.text}
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {users.links && (
              <div className="flex justify-center mt-6 space-x-2">
                {users.links.map((link, index) => (
                  <Button
                    key={index}
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.get(link.url)}
                    disabled={!link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>


        {/* Invitation Modal */}
        {selectedUser  && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Kirim Job Invitation</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kepada: {selectedUser.user_profile?.full_name || selectedUser.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Pilih Lowongan (Opsional)</label>
                  <Select value={selectedJobListing} onValueChange={setSelectedJobListing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lowongan atau biarkan kosong untuk invitation umum" />
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
                  <label className="text-sm font-medium">Pesan (Opsional)</label>
                  <Textarea
                    value={invitationMessage}
                    onChange={(e) => setInvitationMessage(e.target.value)}
                    placeholder="Tulis pesan untuk kandidat..."
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {invitationMessage.length}/500 karakter
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Biaya: 1 poin
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedUser(null)}
                      disabled={isLoading}
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={() => handleSendInvitation(selectedUser.id)}
                      disabled={isLoading || !company.can_invite}
                      loading={isLoading}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Kirim Invitation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Verification Popup */}
      <Dialog open={showVerificationPopup} onOpenChange={setShowVerificationPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Verifikasi Diperlukan</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <DialogDescription className="text-center mb-6">
              Lakukan verifikasi untuk melihat profil dan mengirimkan Job Invitation kepada kandidat ini
            </DialogDescription>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setShowVerificationPopup(false);
                  // You could redirect to company profile/settings where they can submit verification
                  router.visit('/company/profile');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Verifikasi Sekarang
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowVerificationPopup(false);
                  toast.info('Hubungi admin di info@karirconnect.com untuk bantuan verifikasi');
                }}
                className="w-full"
              >
                Hubungi Admin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
