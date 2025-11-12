import { BarChart3, Briefcase, Building, Building2, FileText, FolderOpen, Users, Settings, Info, Newspaper, Shield, UserCheck, User, Mail, AlertTriangle, ShieldCheck, Flag, Coins, CreditCard, History, MessageSquare, Award, Star } from 'lucide-react';
import { type NavItem } from '@/types';

export function useMenuItems() {
    // Super admin menu items (full platform access)
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
                    title: 'Review Verifikasi',
                    href: '/admin/companies/verification/review',
                    icon: ShieldCheck,
                },
                {
                    title: 'Kategori',
                    href: '/admin/job-categories',
                    icon: FolderOpen,
                },
                {
                    title: 'Skills',
                    href: '/admin/skills',
                    icon: Award,
                },
                {
                    title: 'Lowongan',
                    href: '/admin/job-listings',
                    icon: Briefcase,
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
                },
                {
                    title: 'Kisah Sukses',
                    href: '/admin/success-stories',
                    icon: Star,
                },
            ]
        },
        {
            label: 'Moderasi Konten',
            items: [
                {
                    title: 'Laporan & Report',
                    href: '/admin/moderation/reports',
                    icon: Flag,
                }
            ]
        },
        {
            label: 'WhatsApp & Notifikasi',
            items: [
                {
                    title: 'Template Email',
                    href: '/admin/email-templates',
                    icon: Mail,
                },
                {
                    title: 'Template WhatsApp',
                    href: '/admin/whatsapp-templates',
                    icon: MessageSquare,
                }
                // WhatsApp Massal hidden
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
            label: 'Sistem & Billing',
            items: [
                {
                    title: 'Paket Poin',
                    href: '/admin/point-packages',
                    icon: Coins,
                },
                {
                    title: 'History Transaksi',
                    href: '/admin/transactions',
                    icon: History,
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

    // Company admin menu items (limited to recruitment operations)
    const companyAdminMenuGroups = [
        {
            label: 'AKUN SAYA',
            items: [
                {
                    title: 'Profil Perusahaan',
                    href: '/company/profile/edit',
                    icon: Building,
                },
                {
                    title: 'Profil Admin',
                    href: '/admin/profile',
                    icon: User,
                },
                {
                    title: 'Verifikasi Perusahaan',
                    href: '/admin/company/verify',
                    icon: ShieldCheck,
                }
            ]
        },
        {
            label: 'MENU UTAMA',
            items: [
                {
                    title: 'Dashboard',
                    href: '/admin/dashboard',
                    icon: BarChart3,
                },
                {
                    title: 'Lowongan',
                    href: '/company/jobs',
                    icon: Briefcase,
                },
                {
                    title: 'Lamaran',
                    href: '/company/applications',
                    icon: FileText,
                },
                {
                    title: 'Database Pencari Kerja',
                    href: '/company/talent-database',
                    icon: Users,
                },
                {
                    title: 'Job Invitations',
                    href: '/company/job-invitations',
                    icon: MessageSquare,
                }
            ]
        },
        {
            label: 'INFORMASI',
            items: [
                {
                    title: 'Poin Saya',
                    href: '/company/points',
                    icon: Coins,
                },
                {
                    title: 'Beli Poin',
                    href: '/company/points/packages',
                    icon: CreditCard,
                },
                {
                    title: 'History Transaksi',
                    href: '/admin/transactions',
                    icon: History,
                }
            ]
        }
    ];


    // Company admin accessing company panel - company specific routes
    const companyMenuGroups = [
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
            label: 'Recruitment',
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
                },
                {
                    title: 'Database Pencari Kerja',
                    href: '/company/talent-database',
                    icon: Users,
                },
                {
                    title: 'Job Invitations',
                    href: '/company/job-invitations',
                    icon: MessageSquare,
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
        companyMenuGroups,
    };
}
