import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import { type SharedData } from '@/types';
import { route } from 'ziggy-js';

interface SkillOption {
  id: number;
  name: string;
}

interface CandidateInvitation {
  id: number;
  status: string;
  job_listing_id: number | null;
  responded_at: string | null;
}

interface CandidateProfile {
  full_name: string;
  location: string | null;
  open_to_work: boolean;
  current_position: string | null;
  avatar_url: string | null;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  profile: CandidateProfile | null;
  skills: { id: number; name: string }[];
  invitation: CandidateInvitation | null;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedCandidates {
  data: Candidate[];
  links: PaginationLink[];
  meta?: {
    from: number | null;
    to: number | null;
    total: number;
  };
}

interface JobListingOption {
  id: number;
  title: string;
  status: string;
}

interface Props {
  candidates: PaginatedCandidates;
  filters: {
    search?: string;
    skills?: number[];
    location?: string;
    open_to_work?: string | null;
  };
  skills: SkillOption[];
  jobListings: JobListingOption[];
}

const SKILL_ALL_VALUE = 'all';
const OPEN_TO_WORK_ALL_VALUE = 'all';
const JOB_LISTING_NONE_VALUE = 'none';

const TalentDatabaseIndex: React.FC<Props> = ({ candidates, filters, skills, jobListings }) => {
  const { flash } = usePage<SharedData & { flash?: { success?: string; error?: string; warning?: string } }>().props;
  const [search, setSearch] = useState(filters.search ?? '');
  const [location, setLocation] = useState(filters.location ?? '');
  const [selectedSkill, setSelectedSkill] = useState<string>(filters.skills?.[0]?.toString() ?? '');
  const [openToWork, setOpenToWork] = useState<string>(filters.open_to_work ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    candidate_id: 0,
    job_listing_id: null as number | null,
    message: '',
  });

  const handleFilter = () => {
    router.get(route('admin.talent-database.index'), {
      search: search || undefined,
      location: location || undefined,
      skills: selectedSkill ? [selectedSkill] : undefined,
      open_to_work: openToWork !== '' ? openToWork : undefined,
    }, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const resetFilters = () => {
    setSearch('');
    setLocation('');
    setSelectedSkill('');
    setOpenToWork('');

    router.get(route('admin.talent-database.index'), {}, {
      preserveScroll: true,
      preserveState: false,
    });
  };

  const openInvitationDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDialogOpen(true);
    setData({
      candidate_id: candidate.id,
      job_listing_id: null,
      message: '',
    });
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedCandidate(null);
    reset();
  };

  const submitInvitation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    post(route('admin.job-invitations.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Job invitation berhasil dikirim!');
        closeDialog();
      },
      onError: (errors) => {
        console.error('Job invitation errors:', errors);
        const errorMessage = Object.values(errors).flat().join(', ') || 'Gagal mengirim job invitation. Periksa input Anda.';
        toast.error(errorMessage);
      },
    });
  };

  const paginationLinks = useMemo(() => candidates.links ?? [], [candidates.links]);

  const skillSelectValue = selectedSkill || SKILL_ALL_VALUE;
  const openToWorkSelectValue = openToWork || OPEN_TO_WORK_ALL_VALUE;
  const jobListingSelectValue = data.job_listing_id ? data.job_listing_id.toString() : JOB_LISTING_NONE_VALUE;

  useEffect(() => {
    if (flash?.warning) {
      toast.warning(flash.warning);
    }

    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash?.success, flash?.warning, flash?.error]);

  return (
    <AppLayout>
      <Head title="Database Pencari Kerja" />

      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Database Pencari Kerja</h1>
            <p className="text-sm text-slate-600">
              Jelajahi kandidat yang tersedia di KarirConnect dan kirim job invitation secara langsung.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Cari kandidat</label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Nama, skill, atau kata kunci"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Lokasi</label>
                  <Input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Contoh: Jakarta"
                    className="mt-1"
                  />
                </div>

                <div className="col-span-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Skill utama</label>
                  <Select
                    value={skillSelectValue}
                    onValueChange={(value) => setSelectedSkill(value === SKILL_ALL_VALUE ? '' : value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Semua skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SKILL_ALL_VALUE}>Semua skill</SelectItem>
                      {skills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.id.toString()}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Status pencari kerja</label>
                  <Select
                    value={openToWorkSelectValue}
                    onValueChange={(value) => setOpenToWork(value === OPEN_TO_WORK_ALL_VALUE ? '' : value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OPEN_TO_WORK_ALL_VALUE}>Semua</SelectItem>
                      <SelectItem value="1">Open to work</SelectItem>
                      <SelectItem value="0">Tidak open</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
                <Button onClick={handleFilter}>
                  Terapkan Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {candidates.data.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="py-16 text-center text-slate-600">
                Belum ada kandidat yang cocok dengan filter Anda.
              </CardContent>
            </Card>
          )}

          {candidates.data.map((candidate) => {
            const profile = candidate.profile;
            const invitation = candidate.invitation;
            const invitationLabel = invitation
              ? invitation.status === 'pending'
                ? 'Menunggu respons'
                : invitation.status === 'accepted'
                  ? 'Diterima'
                  : 'Ditolak'
              : null;

            return (
              <Card key={candidate.id} className="border-slate-200">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      {profile?.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt={candidate.name} />
                      ) : (
                        <AvatarFallback className="bg-slate-200 text-slate-600">
                          {candidate.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-900">
                          {profile?.full_name || candidate.name}
                        </h2>
                        {profile?.open_to_work && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Open to work</Badge>
                        )}
                        {invitationLabel && (
                          <Badge variant="outline" className="border-slate-200 text-slate-600">
                            {invitationLabel}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        {profile?.current_position && (
                          <span>{profile.current_position}</span>
                        )}
                        {profile?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {profile.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {candidate.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="bg-slate-100 text-slate-700">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                    <div className="text-xs text-slate-500">
                      ID Kandidat: {candidate.id}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link href={route('admin.talent-database.profile', candidate.id)}>
                          Lihat Profil
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openInvitationDialog(candidate)}
                        disabled={invitation?.status === 'pending'}
                      >
                        Kirim Job Invitation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {paginationLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <div>
              Menampilkan {candidates.meta?.from ?? 0} - {candidates.meta?.to ?? candidates.data.length} dari {candidates.meta?.total ?? candidates.data.length} kandidat
            </div>
            <div className="flex flex-wrap gap-2">
              {paginationLinks.map((link, index) => (
                <Button
                  key={`${link.label}-${index}`}
                  variant={link.active ? 'default' : 'outline'}
                  size="sm"
                  disabled={!link.url}
                  onClick={() => link.url && router.visit(link.url, { preserveScroll: true, preserveState: true })}
                >
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={submitInvitation}>
            <DialogHeader>
              <DialogTitle>Kirim Job Invitation</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-slate-600">
                  Anda akan mengirim job invitation kepada{' '}
                  <span className="font-semibold">{selectedCandidate?.profile?.full_name || selectedCandidate?.name}</span>.
                  1 poin akan dipotong dari saldo perusahaan Anda.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Pilih Lowongan (Opsional)</label>
                <Select
                  value={jobListingSelectValue}
                  onValueChange={(value) => setData('job_listing_id', value === JOB_LISTING_NONE_VALUE ? null : Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tanpa lowongan spesifik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={JOB_LISTING_NONE_VALUE}>Tanpa lowongan spesifik</SelectItem>
                    {jobListings.map((listing) => (
                      <SelectItem key={listing.id} value={listing.id.toString()}>
                        {listing.title} {listing.status !== 'published' && `(${listing.status})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Pesan (Opsional)</label>
                <Textarea
                  value={data.message}
                  onChange={(event) => setData('message', event.target.value)}
                  placeholder="Sampaikan alasan atau detail peran yang ditawarkan"
                  rows={4}
                />
                {errors.message && (
                  <p className="text-xs text-red-500">{errors.message}</p>
                )}
              </div>
            </div>

            <DialogFooter className="space-x-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Batal
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Mengirim...' : 'Kirim Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default TalentDatabaseIndex;
