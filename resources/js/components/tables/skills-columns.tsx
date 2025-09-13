"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Eye, Edit, Trash2, Award, Users, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"
import { router } from "@inertiajs/react"
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type Skill = {
  id: number
  name: string
  category: string
  description?: string
  is_active: boolean
  users_count?: number
  created_at: string
  updated_at: string
}

const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aktif
        </Badge>
    ) : (
        <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Nonaktif
        </Badge>
    );
};

const getCategoryBadge = (category: string) => {
    const colors = {
        'Programming': 'bg-blue-100 text-blue-800',
        'Design': 'bg-purple-100 text-purple-800',
        'Marketing': 'bg-green-100 text-green-800',
        'Business': 'bg-yellow-100 text-yellow-800',
        'Technical': 'bg-indigo-100 text-indigo-800',
        'General': 'bg-gray-100 text-gray-800',
    };

    const color = (colors as any)[category] || 'bg-gray-100 text-gray-800';

    return (
        <Badge variant="outline" className={color}>
            {category}
        </Badge>
    );
};

const handleToggleStatus = (skill: Skill) => {
    router.post(`/admin/skills/${skill.id}/toggle-status`, {}, {
        onSuccess: () => {
            const action = skill.is_active ? 'dinonaktifkan' : 'diaktifkan';
            toast.success(`Skill "${skill.name}" berhasil ${action}!`);
        },
        onError: () => {
            toast.error('Gagal mengubah status skill');
        }
    });
};

const handleDelete = (skill: Skill) => {
    if (confirm(`Apakah Anda yakin ingin menghapus skill "${skill.name}"?`)) {
        router.delete(`/admin/skills/${skill.id}`, {
            onSuccess: () => {
                toast.success('Skill berhasil dihapus!');
            },
            onError: (errors: any) => {
                if (errors.error) {
                    toast.error(errors.error);
                } else {
                    toast.error('Gagal menghapus skill');
                }
            }
        });
    }
};

export const skillsColumns: ColumnDef<Skill>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Skill" />
    ),
    cell: ({ row }) => {
      const skill = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-semibold text-gray-900">{skill.name}</div>
          {skill.description && (
            <div className="text-sm text-gray-500 mt-1 max-w-md truncate">
              {skill.description}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategori" />
    ),
    cell: ({ row }) => getCategoryBadge(row.getValue("category")),
    enableHiding: true,
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => getStatusBadge(row.getValue("is_active")),
  },
  {
    accessorKey: "users_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pengguna" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("users_count") as number;
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{count || 0}</span>
        </div>
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dibuat" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="text-sm text-gray-600">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const skill = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => router.get(`/admin/skills/${skill.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Detail
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.get(`/admin/skills/${skill.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleToggleStatus(skill)}
            >
              {skill.is_active ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Nonaktifkan
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aktifkan
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(skill)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];