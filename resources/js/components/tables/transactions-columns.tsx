"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Eye, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { router } from "@inertiajs/react"

export type Transaction = {
  id: number
  company: {
    id: number
    name: string
  }
  type: string
  points: number
  amount?: number
  description: string
  status: string
  payment_reference?: string
  point_package?: {
    id: number
    name: string
  }
  created_at: string
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  
  const labels = {
    pending: 'Pending',
    completed: 'Selesai',
    failed: 'Gagal',
    cancelled: 'Dibatalkan',
  }
  
  return (
    <Badge className={colors[status as keyof typeof colors] || colors.cancelled}>
      {labels[status as keyof typeof labels] || status}
    </Badge>
  )
}

const getTypeBadge = (type: string) => {
  const colors = {
    purchase: 'bg-green-100 text-green-800 border-green-200',
    usage: 'bg-red-100 text-red-800 border-red-200',
    refund: 'bg-blue-100 text-blue-800 border-blue-200',
    bonus: 'bg-purple-100 text-purple-800 border-purple-200',
  }
  
  const labels = {
    purchase: 'Pembelian',
    usage: 'Penggunaan',
    refund: 'Refund',
    bonus: 'Bonus',
  }
  
  return (
    <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}>
      {labels[type as keyof typeof labels] || type}
    </Badge>
  )
}

export const transactionsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="font-mono">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Perusahaan" />
    ),
    cell: ({ row }) => {
      const company = row.getValue("company") as Transaction["company"]
      return <div className="font-medium">{company.name}</div>
    },
    filterFn: (row, id, value) => {
      const company = row.getValue(id) as Transaction["company"]
      return company.name.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipe" />
    ),
    cell: ({ row }) => getTypeBadge(row.getValue("type")),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "points",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Poin" />
    ),
    cell: ({ row }) => {
      const points = row.getValue("points") as number
      const type = row.getValue("type") as string
      
      return (
        <div className="flex items-center gap-2">
          {points > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={`font-semibold ${points > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {points > 0 ? '+' : ''}{points.toLocaleString()}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jumlah" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number
      return amount ? `Rp ${amount.toLocaleString('id-ID')}` : '-'
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deskripsi" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      const pointPackage = row.original.point_package
      
      return (
        <div>
          <div className="font-medium">{description}</div>
          {pointPackage && (
            <div className="text-sm text-gray-600">{pointPackage.name}</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          {getStatusBadge(status)}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const transaction = row.original
      
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.visit(`/admin/transactions/${transaction.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    },
  },
]