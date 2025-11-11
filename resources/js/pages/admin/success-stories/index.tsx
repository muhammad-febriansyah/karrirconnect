import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { successStoriesColumns, type SuccessStory as SuccessStoryRow } from '@/components/tables/success-stories-columns';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { type SharedData } from '@/types';
import { route } from 'ziggy-js';

interface SuccessStory {
  id: number;
  name: string;
  position: string;
  company: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

interface Props {
  stories: {
    data: SuccessStory[];
    current_page: number;
    last_page: number;
    total: number;
  };
  counts: { all: number; pending: number; active: number };
  filters: { status?: string };
}

export default function AdminSuccessStoriesIndex({ stories, counts, filters }: Props) {
  const status = filters?.status || 'all';
  const { flash } = usePage<SharedData>().props as any;
  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
    if (flash?.warning) toast.warning?.(flash.warning);
  }, [flash?.success, flash?.error, flash?.warning]);

  return (
    <AppLayout>
      <Head title="Kisah Sukses" />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#2347FA]" />
            <h1 className="text-2xl font-bold">Kisah Sukses</h1>
          </div>
          <div className="flex gap-2">
            <Link href={route('admin.success-stories.index', { status: 'all' })}>
              <Button variant={status === 'all' ? 'default' : 'outline'} size="sm">
                Semua <Badge className="ml-2">{counts.all}</Badge>
              </Button>
            </Link>
            <Link href={route('admin.success-stories.index', { status: 'pending' })}>
              <Button variant={status === 'pending' ? 'default' : 'outline'} size="sm">
                Pending <Badge className="ml-2">{counts.pending}</Badge>
              </Button>
            </Link>
            <Link href={route('admin.success-stories.index', { status: 'active' })}>
              <Button variant={status === 'active' ? 'default' : 'outline'} size="sm">
                Aktif <Badge className="ml-2">{counts.active}</Badge>
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Kisah</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={successStoriesColumns}
              data={stories.data as unknown as SuccessStoryRow[]}
              searchKey="name"
              searchPlaceholder="Cari kisah sukses..."
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
