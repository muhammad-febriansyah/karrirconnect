import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, MapPin, Star, User } from 'lucide-react';
import { toast } from 'sonner';

interface SuccessStory {
  id: number;
  name: string;
  position: string;
  company: string;
  story: string;
  avatar?: string | null;
  avatar_url?: string | null;
  location?: string | null;
  experience_years?: number | null;
  salary_before?: number | string | null;
  salary_after?: number | string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order?: number | null;
  created_at: string;
  updated_at: string;
  salary_increase_percentage?: number | null;
}

function formatRupiah(value?: number | string | null) {
  if (value === null || value === undefined || value === '') return '-';
  const n = typeof value === 'string' ? Number(value) : value;
  if (isNaN(Number(n))) return '-';
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

export default function AdminSuccessStoryShow({ successStory }: { successStory: SuccessStory }) {
  const s = successStory;

  const toggleStatus = () => {
    router.post(`/admin/success-stories/${s.id}/toggle-status`, {}, {
      preserveScroll: true,
      onSuccess: () => toast.success('Status kisah sukses diperbarui.'),
      onError: () => toast.error('Gagal memperbarui status kisah sukses.'),
    });
  };

  const toggleFeatured = () => {
    router.post(`/admin/success-stories/${s.id}/toggle-featured`, {}, {
      preserveScroll: true,
      onSuccess: () => toast.success('Status featured diperbarui.'),
      onError: () => toast.error('Gagal memperbarui status featured.'),
    });
  };

  return (
    <AppLayout>
      <Head title={`Kisah Sukses - ${s.name}`} />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Detail Kisah Sukses</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleStatus} className={s.is_active ? 'text-yellow-700' : 'text-green-700'}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              {s.is_active ? 'Nonaktifkan' : 'Aktifkan'}
            </Button>
            <Button variant="outline" onClick={toggleFeatured} className={s.is_featured ? 'text-gray-700' : 'text-amber-700'}>
              <Star className="h-4 w-4 mr-1" />
              {s.is_featured ? 'Hapus Featured' : 'Jadikan Featured'}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {s.avatar_url ? (
                <img src={s.avatar_url} alt={s.name} className="h-24 w-24 rounded-full object-cover border" />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{s.name}</h2>
                  {s.is_featured && <Badge variant="secondary">Featured</Badge>}
                  <Badge variant="outline" className={s.is_active ? 'border-green-600 text-green-600' : 'border-yellow-600 text-yellow-600'}>
                    {s.is_active ? 'Aktif' : 'Pending'}
                  </Badge>
                </div>
                <div className="text-gray-600 mt-1">{s.position} • {s.company}</div>
                {s.location && (
                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {s.location}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Pengalaman</span><span className="font-medium">{s.experience_years ?? '-'} tahun</span></div>
              <div className="flex justify-between"><span>Gaji Sebelumnya</span><span className="font-medium">{formatRupiah(s.salary_before)}</span></div>
              <div className="flex justify-between"><span>Gaji Sekarang</span><span className="font-medium">{formatRupiah(s.salary_after)}</span></div>
              <div className="flex justify-between"><span>Kenaikan</span><span className="font-medium">{s.salary_increase_percentage ? s.salary_increase_percentage + '%' : '-'}</span></div>
              <div className="flex justify-between"><span>Urutan</span><span className="font-medium">{s.sort_order ?? '-'}</span></div>
              <div className="flex justify-between"><span>Dibuat</span><span className="font-medium">{new Date(s.created_at).toLocaleString('id-ID')}</span></div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Kisah</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line leading-relaxed text-gray-800">{s.story}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
