"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Eye, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react"
import { router } from "@inertiajs/react"
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

export type User = {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'company_admin' | 'user'
  is_active: boolean
  company?: {
    id: number
    name: string
  }
  profile?: {
    phone?: string
    location?: string
    current_position?: string
  }
  created_at: string
  last_login_at?: string
}

const getRoleColor = (role: User['role']) => {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'company_admin':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'user':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getRoleLabel = (role: User['role']) => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin'
    case 'company_admin':
      return 'Admin Perusahaan'
    case 'user':
      return 'Pengguna'
    default:
      return role
  }
}

const toggleUserStatus = (user: User) => {
  router.post(
    `/admin/users/${user.id}/toggle-status`,
    {},
    {
      onSuccess: () => {
        router.reload()
      },
    }
  )
}

const deleteUser = (user: User) => {
  if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}"?`)) {
    router.delete(`/admin/users/${user.id}`, {
      onSuccess: () => {
        toast.success('Pengguna Berhasil Dihapus!', {
          description: `Pengguna ${user.name} telah berhasil dihapus dari sistem.`,
          duration: 4000,
        })
      },
      onError: () => {
        toast.error('Gagal Menghapus Pengguna', {
          description: 'Terjadi kesalahan saat menghapus pengguna. Silakan coba lagi.',
          duration: 4000,
        })
      },
    })
  }
}

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="font-mono">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => {
      const user = row.original
      return (
        <div>
          <div className="font-medium">{user.name}</div>
          {user.profile?.phone && (
            <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <Phone className="h-3 w-3" />
              {user.profile.phone}
            </div>
          )}
          {user.profile?.location && (
            <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {user.profile.location}
            </div>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return row.getValue(id).toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Peran" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as User['role']
      return (
        <Badge variant="outline" className={getRoleColor(role)}>
          {getRoleLabel(role)}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean
      return (
        <Badge 
          variant="outline" 
          className={isActive 
            ? "border-green-600 text-green-600" 
            : "border-red-600 text-red-600"
          }
        >
          {isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) as boolean
      return value.includes(isActive ? 'active' : 'inactive')
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Perusahaan" />
    ),
    cell: ({ row }) => {
      const company = row.getValue("company") as User['company']
      return company ? company.name : '-'
    },
    filterFn: (row, id, value) => {
      const company = row.getValue(id) as User['company']
      return company ? company.name.toLowerCase().includes(value.toLowerCase()) : false
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bergabung" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string
      return (
        <div className="text-sm">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const user = row.original
      
      return (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => router.visit(`/admin/users/${user.id}`)}
          >
            <Eye className="h-3 w-3" />
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => router.visit(`/admin/users/${user.id}/edit`)}
          >
            <Edit className="h-3 w-3" />
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => toggleUserStatus(user)}
            className={user.is_active 
              ? 'text-red-600 hover:text-red-700' 
              : 'text-green-600 hover:text-green-700'
            }
          >
            {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          </Button>

          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => deleteUser(user)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )
    },
  },
]