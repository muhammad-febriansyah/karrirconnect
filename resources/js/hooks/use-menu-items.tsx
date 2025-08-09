import { BarChart3, Briefcase, Building2, FileText, FolderOpen, Users, Settings, Info, Newspaper, Shield, UserCheck, User } from 'lucide-react';
import { type NavItem } from '@/types';

export function useMenuItems() {
    const superAdminMenuGroups = [
        {
            label: 'Dashboard',
            items: [
                {
                    title: 'Dashboard',
                    href: '/admin/dashboard',
                    icon: BarChart3,
                }
            ]
        },
        {
            label: 'Manajemen Data',
            items: [
                {
                    title: 'Pengguna',
                    href: '/admin/users',
                    icon: Users,
                },
                {
                    title: 'Perusahaan',
                    href: '/admin/companies',
                    icon: Building2,
                },
                {
                    title: 'Kategori',
                    href: '/admin/job-categories',
                    icon: FolderOpen,
                },
                {
                    title: 'Lamaran',
                    href: '/admin/applications',
                    icon: FileText,
                }
            ]
        },
        {
            label: 'Konten & Informasi',
            items: [
                {
                    title: 'Berita',
                    href: '/admin/news',
                    icon: Newspaper,
                },
                {
                    title: 'Tentang Kami',
                    href: '/admin/about-us',
                    icon: Info,
                }
            ]
        },
        {
            label: 'Legal & Kebijakan',
            items: [
                {
                    title: 'Kebijakan Privasi',
                    href: '/admin/privacy-policy',
                    icon: Shield,
                },
                {
                    title: 'Syarat & Ketentuan',
                    href: '/admin/terms-of-service',
                    icon: FileText,
                },
                {
                    title: 'Perjanjian Pengguna',
                    href: '/admin/user-agreement',
                    icon: UserCheck,
                }
            ]
        },
        {
            label: 'Pengaturan',
            items: [
                {
                    title: 'Profil Admin',
                    href: '/admin/profile',
                    icon: User,
                },
                {
                    title: 'Pengaturan',
                    href: '/admin/settings',
                    icon: Settings,
                }
            ]
        }
    ];

    const companyAdminMenuGroups = [
        {
            label: 'Dashboard',
            items: [
                {
                    title: 'Dashboard',
                    href: '/company/dashboard',
                    icon: BarChart3,
                }
            ]
        },
        {
            label: 'Manajemen',
            items: [
                {
                    title: 'Lowongan',
                    href: '/company/jobs',
                    icon: Briefcase,
                },
                {
                    title: 'Lamaran',
                    href: '/company/applications',
                    icon: FileText,
                }
            ]
        },
        {
            label: 'Pengaturan',
            items: [
                {
                    title: 'Profil',
                    href: '/company/profile',
                    icon: Building2,
                }
            ]
        }
    ];

    return {
        superAdminMenuGroups,
        companyAdminMenuGroups,
    };
}