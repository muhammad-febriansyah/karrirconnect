import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  MapPin,
  Briefcase,
  Send,
  Phone,
  Mail,
  Star,
  Award,
  Calendar,
  Users
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
  profile?: UserProfile;
  skills?: Array<{ id: number; name: string }>;
}

interface JobListing {
  id: number;
  title: string;
}

interface Props {
  users: {
    data: User[];
    links: any[];
    meta: any;
  };
  company: {
    id: number;
    name: string;
    job_posting_points: number;
    can_invite: boolean;
  };
  jobListings: JobListing[];
}

export default function CompanyTalentDatabase({ users, company, jobListings }: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, setData, post, processing, reset } = useForm({
    candidate_id: '',
    job_listing_id: '',
    message: '',
  });

  const handleSendInvitation = () => {
    if (!selectedUser) return;

    post('/company/job-invitations', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Job invitation berhasil dikirim!');
        setSelectedUser(null);
        reset();
      },
      onError: (errors) => {
        const errorMessage = Object.values(errors)[0] as string;
        toast.error(errorMessage || 'Terjadi kesalahan saat mengirim invitation.');
      }
    });
  };

  const openInvitationModal = (user: User) => {
    setSelectedUser(user);
    setData('candidate_id', user.id.toString());
  };

  const filteredUsers = (users.data || []).filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.profile?.full_name?.toLowerCase().includes(searchLower) ||
      user.profile?.current_position?.toLowerCase().includes(searchLower) ||
      user.profile?.location?.toLowerCase().includes(searchLower) ||
      user.skills?.some(skill => skill.name.toLowerCase().includes(searchLower))
    );
  });

  const formatSalaryRange = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);
    if (min && max) return `Rp ${formatNumber(min)} - ${formatNumber(max)}`;
    if (min) return `Mulai dari Rp ${formatNumber(min)}`;
    if (max) return `Hingga Rp ${formatNumber(max)}`;
    return null;
  };

  return (
    <AppLayout>
      <Head title="Database Pencari Kerja" />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Database Pencari Kerja</h1>
              <p className="text-gray-600 mt-1">
                Temukan dan undang talenta terbaik untuk bergabung dengan {company.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Poin Tersedia</div>
              <div className="text-2xl font-bold text-blue-600">{company.job_posting_points}</div>
              <div className="text-xs text-gray-500">1 poin per invitation</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari berdasarkan nama, posisi, lokasi, atau skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Kandidat</p>
                  <p className="text-2xl font-bold text-gray-900">{users.meta?.total || users.data?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Kandidat Tersaring</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Send className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Dapat Mengirim</p>
                  <p className="text-2xl font-bold text-gray-900">{company.job_posting_points}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Talent List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.profile?.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {(user.profile?.full_name || user.name).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {user.profile?.full_name || user.name}
                      </h3>
                      {user.profile?.open_to_work && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Star className="h-3 w-3 mr-1" />
                          Tersedia
                        </Badge>
                      )}
                    </div>

                    {user.profile?.current_position && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {user.profile.current_position}
                      </div>
                    )}

                    {user.profile?.location && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.profile.location}
                      </div>
                    )}

                    {user.profile?.phone && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Phone className="h-3 w-3 mr-1" />
                        {user.profile.phone}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </div>

                    {/* Salary Expectation */}
                    {formatSalaryRange(user.profile?.expected_salary_min, user.profile?.expected_salary_max) && (
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Ekspektasi:</span> {formatSalaryRange(user.profile?.expected_salary_min, user.profile?.expected_salary_max)}
                      </div>
                    )}

                    {/* Skills */}
                    {user.skills && user.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {user.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill.id} variant="secondary" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))}
                          {user.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{user.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bio Preview */}
                    {user.profile?.bio && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {user.profile.bio}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t">
                      <Button
                        onClick={() => openInvitationModal(user)}
                        disabled={!company.can_invite}
                        className="w-full"
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Kirim Invitation
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {users.links && (
          <div className="flex justify-center space-x-2">
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

        {/* Job Invitation Modal */}
        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Kirim Job Invitation</DialogTitle>
                <p className="text-sm text-gray-600">
                  Kepada: {selectedUser.profile?.full_name || selectedUser.name}
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
                      onClick={() => setSelectedUser(null)}
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
      </div>
    </AppLayout>
  );
}