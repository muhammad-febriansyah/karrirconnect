import {
    MobileNav,
    MobileNavHeader,
    MobileNavMenu,
    MobileNavToggle,
    NavBody,
    Navbar,
    NavbarButton,
} from '@/components/ui/resizable-navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, resolveAssetUrl } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Building, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useMemo, useState } from 'react';

type PageKey = 'home' | 'jobs' | 'companies';

interface ResizableNavbarProps {
    currentPage?: PageKey;
    className?: string;
}

export default function ResizableNavbar({ currentPage = 'home', className }: ResizableNavbarProps) {
    const { auth, settings } = usePage<SharedData>().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = useMemo(
        () => [
            { key: 'home' as const, label: 'Home', href: '/' },
            { key: 'jobs' as const, label: 'Lowongan', href: '/jobs' },
            { key: 'companies' as const, label: 'Perusahaan', href: '/companies' },
        ],
        [],
    );

    const profileItems = [
        { label: 'Tentang Kami', href: '/about' },
        { label: 'Fitur', href: '/features' },
        { label: 'Syarat & Ketentuan', href: '/terms' },
        { label: 'Kebijakan Privasi', href: '/privacy' },
    ];

    const siteLogo = resolveAssetUrl(settings?.logo) || null;

    return (
        <div className={cn('z-50', className)}>
            {/* Desktop / Large screens */}
            <Navbar>
                <NavBody>
                    {/* Left: Logo */}
                    <Link href="/" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1">
                        {siteLogo ? (
                            <img
                                src={siteLogo}
                                alt={settings?.site_name || 'KarirConnect'}
                                className="h-8 w-auto max-w-[150px] rounded-xl object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <div className={cn('hidden h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#2347FA] to-[#3b56fc]', siteLogo ? 'hidden' : 'flex')}>
                            <span className="text-sm font-bold text-white">K</span>
                        </div>
                    </Link>

                    {/* Center: Navigation */}
                    <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
                        {navItems.map((item) => {
                            const isActive = currentPage === item.key;
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={cn(
                                        'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white'
                                            : 'text-neutral-600 hover:bg-gray-100 hover:text-[#2347FA] dark:text-neutral-300 dark:hover:bg-neutral-800',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        {/* Profil dropdown (simple) */}
                        <div className="relative group">
                            <div className="flex items-center">
                                <button className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-gray-100 hover:text-[#2347FA] dark:text-neutral-300 dark:hover:bg-neutral-800">
                                    <span className="mr-1">Profil</span>
                                    <ChevronDown className="inline h-4 w-4" />
                                </button>
                            </div>
                            <div className="invisible absolute left-1/2 z-[70] mt-2 w-56 -translate-x-1/2 rounded-lg border bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-900">
                                {profileItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="hidden items-center gap-2 lg:flex">
                        {auth?.user ? (
                            <>
                                <Link href={auth.user?.role === 'user' ? '/user/notifications' : '/admin/notifications'}>
                                    <Button variant="ghost" size="sm" className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
                                        <Bell className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center rounded-full bg-white px-2 py-1 text-sm shadow">
                                            <Avatar className="h-8 w-8">
                                                {auth.user?.avatar ? (
                                                    <AvatarImage src={auth.user.avatar as string} />
                                                ) : (
                                                    <AvatarFallback>{(auth.user?.name || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                                                )}
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem asChild>
                                            <Link href={auth.user?.role === 'user' ? '/user/dashboard' : '/admin'}>Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={auth.user?.role === 'user' ? '/user/profile' : '/settings/profile'} className="flex items-center">
                                                <Settings className="mr-2 h-4 w-4" /> Profil
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/logout" method="post" as="button" className="flex w-full items-center text-left text-red-600">
                                                <LogOut className="mr-2 h-4 w-4" /> Keluar
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <NavbarButton className="border-2 border-[#2347FA] text-[#2347FA] hover:text-white" variant="secondary">
                                        Masuk
                                    </NavbarButton>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div>
                                            <NavbarButton variant="gradient">
                                                <span className="flex items-center gap-2">Daftar <ChevronDown className="h-4 w-4" /></span>
                                            </NavbarButton>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64">
                                        <DropdownMenuItem asChild>
                                            <Link href="/register" className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" /> Daftar sebagai Pencari Kerja
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/register-company" className="cursor-pointer">
                                                <Building className="mr-2 h-4 w-4" /> Daftar sebagai Perusahaan
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>
                </NavBody>
            </Navbar>

            {/* Mobile */}
            <MobileNav>
                <MobileNavHeader>
                    <Link href="/" className="flex items-center gap-2">
                        {siteLogo ? (
                            <img
                                src={siteLogo}
                                alt={settings?.site_name || 'KarirConnect'}
                                className="h-8 w-auto rounded-xl object-contain"
                            />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#2347FA] to-[#3b56fc]">
                                <span className="text-sm font-bold text-white">K</span>
                            </div>
                        )}
                    </Link>

                    <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
                </MobileNavHeader>
                <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
                    <div className="flex w-full flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={cn(
                                    'rounded-xl px-4 py-3 text-base font-medium',
                                    currentPage === item.key
                                        ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white'
                                        : 'text-neutral-700 hover:bg-gray-100',
                                )}
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Profil quick links */}
                        <div className="mt-2">
                            <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Profil</div>
                            <div className="grid gap-1">
                                <Link href="/about" className="rounded-lg px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                                    Tentang Kami
                                </Link>
                                <Link href="/features" className="rounded-lg px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                                    Fitur
                                </Link>
                                <Link href="/terms" className="rounded-lg px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                                    Syarat & Ketentuan
                                </Link>
                                <Link href="/privacy" className="rounded-lg px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                                    Kebijakan Privasi
                                </Link>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                            {auth?.user ? (
                                <>
                                    <Link
                                        href={auth.user?.role === 'user' ? '/user/dashboard' : '/admin'}
                                        className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-bold text-white"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex-1 rounded-xl border border-red-500 px-4 py-2.5 text-center text-sm font-bold text-red-600"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Keluar
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="flex-1 rounded-xl border border-blue-600 px-4 py-2.5 text-center text-sm font-bold text-blue-600" onClick={() => setMobileOpen(false)}>
                                        Masuk
                                    </Link>
                                    <Link href="/register" className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-bold text-white" onClick={() => setMobileOpen(false)}>
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </div>
    );
}
