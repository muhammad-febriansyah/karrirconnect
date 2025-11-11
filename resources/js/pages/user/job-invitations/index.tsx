import React, { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
// import ModernNavbar from '@/components/modern-navbar';
// import ModernFooter from '@/components/modern-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Mail, MapPin, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { type SharedData } from '@/types';
import { route } from 'ziggy-js';
import MainLayout from '@/layouts/main-layout';

interface InvitationCompany {
  id?: number;
  name?: string;
  logo?: string | null;
}

interface InvitationJob {
  id?: number;
  slug?: string;
  title?: string;
  location?: string | null;
}

interface InvitationItem {
  id: number;
  status: string;
  created_at: string;
  responded_at?: string | null;
  message?: string | null;
  company?: InvitationCompany | null;
  jobListing?: InvitationJob | null;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface InvitationsProps {
  invitations: {
    data: InvitationItem[];
    links: PaginationLink[];
  };
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'default';
    case 'declined':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'Diterima';
    case 'declined':
      return 'Ditolak';
    default:
      return 'Menunggu';
  }
};

const JobInvitationsPage: React.FC<InvitationsProps> = ({ invitations }) => {
  const [isResponding, setIsResponding] = useState(false);

  // Show global flash messages (e.g., after redirect)
  const { flash } = usePage<SharedData>().props as any;
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
    if (flash?.warning) {
      toast.warning(flash.warning);
    }
  }, [flash?.success, flash?.error, flash?.warning]);

  const handleRespond = (id: number, status: 'accepted' | 'declined') => {
    if (isResponding) return;

    setIsResponding(true);

    router.patch(route('user.job-invitations.update', id), { status }, {
      preserveState: false,
      preserveScroll: true,
      onSuccess: () => {
        // Flash message will be handled by useEffect, no need for duplicate toast
        setIsResponding(false);
      },
      onError: (errors) => {
        console.error('Job invitation response error:', errors);

        let errorMessage = 'Terjadi kesalahan saat merespon undangan';

        if (typeof errors === 'object' && errors !== null) {
          const firstError = Object.values(errors)[0];
          if (typeof firstError === 'string') {
            errorMessage = firstError;
          } else if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        }

        // Handle specific error cases
        if (errorMessage.includes('403') || errorMessage.includes('authorized') || errorMessage.includes('izin')) {
          toast.error('Anda tidak memiliki izin untuk merespon undangan ini');
        } else if (errorMessage.includes('sudah merespon') || errorMessage.includes('sudah diterima') || errorMessage.includes('sudah ditolak')) {
          toast.warning('Anda sudah merespon undangan ini sebelumnya');
        } else {
          toast.error(errorMessage);
        }

        setIsResponding(false);
      },
      onFinish: () => {
        setIsResponding(false);
      }
    });
  };

  return (
        <MainLayout currentPage="job-invitations">
            <Head title="Job Invitation" />

        <main className="pt-20 pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Invitation</h1>
              <p className="text-gray-600 mt-2">
                Undangan kerja yang dikirim oleh perusahaan secara langsung kepada Anda.
              </p>
            </div>

            <div className="space-y-4">
              {invitations.data.length === 0 && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-16 text-center text-gray-600">
                    Belum ada job invitation untuk Anda saat ini.
                  </CardContent>
                </Card>
              )}

              {invitations.data.map((invitation) => (
                <Card key={invitation.id} className="border border-gray-100 shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          {invitation.company?.logo ? (
                            <AvatarImage src={invitation.company.logo} alt={invitation.company.name ?? 'Perusahaan'} />
                          ) : (
                            <AvatarFallback className="bg-gray-200 text-gray-600">
                              {invitation.company?.name?.charAt(0).toUpperCase() || 'C'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">
                              {invitation.company?.name || 'Perusahaan'}
                            </h2>
                            <Badge variant={getStatusBadgeVariant(invitation.status)}>
                              {getStatusText(invitation.status)}
                            </Badge>
                          </div>
                          {invitation.jobListing?.title && (
                            <p className="text-sm text-gray-600">{invitation.jobListing.title}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Diterima: {new Date(invitation.created_at).toLocaleDateString('id-ID')}
                            </span>
                            {invitation.responded_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Direspon: {new Date(invitation.responded_at).toLocaleDateString('id-ID')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {invitation.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={isResponding}
                              onClick={() => handleRespond(invitation.id, 'accepted')}
                            >
                              {isResponding ? 'Processing...' : 'Terima'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                              disabled={isResponding}
                              onClick={() => handleRespond(invitation.id, 'declined')}
                            >
                              {isResponding ? 'Processing...' : 'Tolak'}
                            </Button>
                          </>
                        )}

                        {invitation.status === 'accepted' && (
                          <>
                            <Button
                              size="sm"
                              disabled
                              className="bg-gray-300 text-gray-500 cursor-not-allowed"
                            >
                              Terima
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="border-gray-300 text-gray-400 cursor-not-allowed"
                            >
                              Tolak
                            </Button>
                          </>
                        )}

                        {invitation.status === 'declined' && (
                          <>
                            <Button
                              size="sm"
                              disabled
                              className="bg-gray-300 text-gray-500 cursor-not-allowed"
                            >
                              Terima
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="border-gray-300 text-gray-400 cursor-not-allowed"
                            >
                              Tolak
                            </Button>
                          </>
                        )}

                        {/* Chat button - only active when invitation is accepted */}
                        {invitation.status === 'accepted' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                            onClick={() => router.visit(route('user.job-invitations.messages.index', invitation.id))}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat dengan Perusahaan
                          </Button>
                        )}

                        {/* Disabled Chat button when declined */}
                        {invitation.status === 'declined' && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="bg-gray-100 text-gray-400 cursor-not-allowed"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat dengan Perusahaan
                          </Button>
                        )}

                        {/* Disabled Chat button when pending */}
                        {invitation.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="bg-gray-100 text-gray-400 cursor-not-allowed"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat dengan Perusahaan
                          </Button>
                        )}
                      </div>
                    </div>

                    {invitation.message && (
                      <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                        {invitation.message}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      {invitation.jobListing?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {invitation.jobListing.location}
                        </span>
                      )}
                      {invitation.company?.name && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {invitation.company.name}
                        </span>
                      )}
                    </div>

                    {invitation.jobListing?.slug && (
                      <div>
                        <Button asChild variant="link" className="p-0 text-sm">
                          <a href={`/jobs/${invitation.jobListing.slug}`} target="_blank" rel="noopener noreferrer">
                            Lihat detail lowongan
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-100">
                {invitations.links.map((link, index) => (
                  <Button
                    key={`${link.label}-${index}`}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                  >
                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </main>

      </MainLayout>
    );
};

export default JobInvitationsPage;