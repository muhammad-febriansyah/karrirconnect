"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { CheckCircle2, Eye, Star, StarOff } from "lucide-react"
import { Link, router } from "@inertiajs/react"
import { toast } from 'sonner'

export type SuccessStory = {
  id: number
  name: string
  position: string
  company: string
  is_active: boolean
  is_featured: boolean
  created_at: string
}

const toggleStatus = (story: SuccessStory) => {
  router.post(`/admin/success-stories/${story.id}/toggle-status`, {}, {
    preserveScroll: true,
    onSuccess: () => toast.success('Status kisah sukses diperbarui.'),
    onError: () => toast.error('Gagal memperbarui status kisah sukses.'),
  })
}

const toggleFeatured = (story: SuccessStory) => {
  router.post(`/admin/success-stories/${story.id}/toggle-featured`, {}, {
    preserveScroll: true,
    onSuccess: () => toast.success('Status featured diperbarui.'),
    onError: () => toast.error('Gagal memperbarui status featured.'),
  })
}

export const successStoriesColumns: ColumnDef<SuccessStory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => {
      const s = row.original
      return (
        <div>
          <div className="font-medium">{s.name}</div>
          <div className="text-sm text-gray-600">{s.position} • {s.company}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "is_featured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Featured" />
    ),
    cell: ({ row }) => {
      const featured = row.getValue("is_featured") as boolean
      return featured ? (
        <Badge variant="secondary" className="text-xs">Featured</Badge>
      ) : (
        <span className="text-xs text-gray-500">-</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const active = row.getValue("is_active") as boolean
      return (
        <Badge variant="outline" className={active ? 'border-green-600 text-green-600' : 'border-yellow-600 text-yellow-600'}>
          {active ? 'Aktif' : 'Pending'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dikirim" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string
      return <span className="text-sm">{new Date(createdAt).toLocaleDateString('id-ID')}</span>
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const s = row.original
      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/success-stories/${s.id}`}>
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3" />
              <span className="ml-1">Detail</span>
            </Button>
          </Link>
          <Button size="sm" variant="outline" onClick={() => toggleStatus(s)} className={s.is_active ? 'text-yellow-700' : 'text-green-700'}>
            <CheckCircle2 className="h-3 w-3" />
            <span className="ml-1">{s.is_active ? 'Nonaktifkan' : 'Aktifkan'}</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => toggleFeatured(s)} className={s.is_featured ? 'text-gray-700' : 'text-amber-700'}>
            {s.is_featured ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
            <span className="ml-1">{s.is_featured ? 'Hapus Featured' : 'Jadikan Featured'}</span>
          </Button>
        </div>
      )
    }
  }
]
