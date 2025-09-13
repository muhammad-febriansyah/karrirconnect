"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
    MoreHorizontal, 
    Eye, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Building2,
    Calendar,
    User
} from "lucide-react"

export interface VerificationCompany {
    id: number;
    name: string;
    verification_status: 'pending' | 'approved' | 'rejected';
    verification_data?: {
        verification_type?: 'legal' | 'individual';
    };
    verification_documents?: any[];
    updated_at: string;
    users?: Array<{
        name: string;
        email: string;
    }>;
}

export const verificationColumns: ColumnDef<VerificationCompany>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Perusahaan" />
        ),
        cell: ({ row }) => {
            const company = row.original;
            return (
                <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate text-sm sm:text-base">{company.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                            {company.users?.[0]?.email || 'No admin email'}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "verification_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("verification_status") as string;
            
            const statusConfig = {
                pending: {
                    label: "Menunggu Review",
                    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
                    icon: Clock
                },
                verified: {
                    label: "Disetujui",
                    className: "bg-green-100 text-green-800 border-green-300",
                    icon: CheckCircle2
                },
                rejected: {
                    label: "Ditolak",
                    className: "bg-red-100 text-red-800 border-red-300",
                    icon: XCircle
                }
            };

            const config = statusConfig[status as keyof typeof statusConfig];

            // Fallback for unknown status
            if (!config) {
                return (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 text-xs sm:text-sm">
                        <span>{status}</span>
                    </Badge>
                );
            }

            const Icon = config.icon;

            return (
                <Badge variant="outline" className={`${config.className} text-xs sm:text-sm`}>
                    <Icon className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">{config.label}</span>
                    <span className="sm:hidden">
                        {status === 'pending' ? 'Pending' : status === 'verified' ? 'Verified' : 'Rejected'}
                    </span>
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "verification_data.verification_type",
        header: "Tipe",
        cell: ({ row }) => {
            const type = row.original.verification_data?.verification_type;
            if (!type) return <span className="text-gray-400 text-xs sm:text-sm">-</span>;
            
            return (
                <Badge variant="secondary" className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">
                        {type === 'legal' ? 'Dokumen Legal' : 'Bukti Kepemilikan'}
                    </span>
                    <span className="sm:hidden">
                        {type === 'legal' ? 'Legal' : 'Individual'}
                    </span>
                </Badge>
            );
        },
    },
    {
        accessorKey: "verification_documents",
        header: "Docs",
        cell: ({ row }) => {
            const documents = row.original.verification_documents || [];
            return (
                <div className="text-xs sm:text-sm text-gray-600">
                    {documents.length} <span className="hidden sm:inline">file</span>
                </div>
            );
        },
    },
    {
        accessorKey: "users",
        header: "Admin",
        cell: ({ row }) => {
            const admin = row.original.users?.[0];
            if (!admin) return <span className="text-gray-400 text-xs sm:text-sm">No admin</span>;
            
            return (
                <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-medium truncate">{admin.name}</div>
                        <div className="text-xs text-gray-500 truncate hidden sm:block">{admin.email}</div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Update" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("updated_at"));
            return (
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm min-w-0">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                        <span className="hidden sm:inline">
                            {date.toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                        <span className="sm:hidden">
                            {date.toLocaleDateString('id-ID', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const company = row.original;
            
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                            onClick={() => {
                                // This will be handled by the parent component
                                const event = new CustomEvent('viewCompany', { detail: company });
                                window.dispatchEvent(event);
                            }}
                            className="text-sm"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Review Verifikasi</span>
                            <span className="sm:hidden">Review</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];