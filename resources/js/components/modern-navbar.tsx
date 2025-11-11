import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { resolveAssetUrl } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Building, ChevronDown, LogOut, Menu, Search, Settings, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModernNavbarProps {
    currentPage?: 'home' | 'jobs' | 'companies' | 'blog' | 'about' | 'pasang-lowongan' | 'success-stories' | 'profile';
}

export default function ModernNavbar({ currentPage = 'home' }: ModernNavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { auth, settings } = usePage<SharedData>().props;
    const logoSrc = resolveAssetUrl(settings?.logo);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (isMobileMenuOpen) {
                const navbar = document.querySelector('[data-navbar]');
                if (navbar && !navbar.contains(event.target as Node)) {
                    setIsMobileMenuOpen(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    // Base navigation items
    const baseNavItems = [
        { name: 'Lowongan', href: '/jobs', key: 'jobs' },
        { name: 'Perusahaan', href: '/companies', key: 'companies' },
    ];

    // Navigation items for navbar (without 'Pasang Lowongan')
    const navItems = baseNavItems;

    const navbarClass = `
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${isScrolled ? 'backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-black/5' : 'bg-white border-b border-transparent'}
    `;

    return (
        <motion.header className={navbarClass} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} data-navbar>
            <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                            <div className="relative">
                                {logoSrc ? (
                                    <img
                                        src={logoSrc}
                                        alt={settings.site_name || 'KarirConnect'}
                                        className="h-8 w-auto max-w-[80px] rounded-xl object-contain sm:max-w-[120px] lg:max-w-[150px]"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                {!logoSrc && (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#2347FA] to-[#3b56fc] sm:h-10 sm:w-10">
                                        <span className="text-sm font-bold text-white sm:text-lg">K</span>
                                    </div>
                                )}
                                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2347FA] to-[#3b56fc]">
                                    <span className="text-lg font-bold text-white">K</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-2 lg:flex">
                        {/* Home Menu Item */}
                        <motion.div
                            whileHover={{
                                y: -3,
                                scale: 1.05,
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 17,
                            }}
                        >
                            <Link
                                href="/"
                                className={`group relative overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-500 ease-out ${
                                    currentPage === 'home'
                                        ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-lg ring-2 shadow-[#2347FA]/30 ring-[#2347FA]/20'
                                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-[#2347FA] hover:shadow-md hover:shadow-gray-200/50'
                                }`}
                            >
                                {/* Active indicator line */}
                                {currentPage === 'home' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-[#2347FA] to-[#3b56fc]"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Hover effect overlay */}
                                <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <span className="relative z-10">Home</span>
                            </Link>
                        </motion.div>

                        {/* Profil Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.button
                                    whileHover={{
                                        y: -3,
                                        scale: 1.05,
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 17,
                                    }}
                                    className={`group relative flex items-center overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-500 ease-out ${
                                        currentPage === 'about'
                                            ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-lg ring-2 shadow-[#2347FA]/30 ring-[#2347FA]/20'
                                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-[#2347FA] hover:shadow-md hover:shadow-gray-200/50'
                                    }`}
                                >
                                    <span className="relative z-10">Profil</span>
                                    <ChevronDown className="relative z-10 ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                                </motion.button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48 border border-white/20 bg-white/95 shadow-xl backdrop-blur-xl">
                                <DropdownMenuItem asChild>
                                    <Link href="/about" className="flex items-center">
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Tentang Kami
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/contact" className="flex items-center">
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Hubungi Kami
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/privacy-policy" className="flex items-center">
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                        Kebijakan Privasi
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/terms-of-service" className="flex items-center">
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Syarat & Ketentuan
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {navItems.map((item) => {
                            const isActive = currentPage === item.key;

                            return (
                                <motion.div
                                    key={item.key}
                                    whileHover={{
                                        y: -3,
                                        scale: 1.05,
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 17,
                                    }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`group relative overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-500 ease-out ${
                                            isActive
                                                ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-lg ring-2 shadow-[#2347FA]/30 ring-[#2347FA]/20'
                                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-[#2347FA] hover:shadow-md hover:shadow-gray-200/50'
                                        } `}
                                    >
                                        {/* Active indicator line */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-[#2347FA] to-[#3b56fc]"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        {/* Hover effect overlay */}
                                        <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <span className="relative z-10">{item.name}</span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
                        {auth.user ? (
                            <div className="hidden items-center space-x-2 sm:space-x-3 md:flex">
                                {/* Notifications */}
                                <Link href={auth.user?.role === 'user' ? '/user/notifications' : '/admin/notifications'}>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`relative rounded-full p-2 transition-all duration-300 ${'text-gray-600 hover:bg-gray-100'} `}
                                        >
                                            <Bell className="h-5 w-5" />
                                            <span className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-red-500"></span>
                                        </Button>
                                    </motion.div>
                                </Link>

                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className="flex items-center space-x-2 rounded-full bg-white/10 p-1 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                                        >
                                            <Avatar className="h-8 w-8 border-2 border-white/20">
                                                <AvatarImage src={auth.user?.avatar_url || ''} alt={auth.user?.name || 'User'} />
                                                <AvatarFallback className="bg-[#2347FA] text-sm text-white">
                                                    {auth.user?.name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <ChevronDown className={`h-4 w-4 transition-colors ${'text-gray-600'}`} />
                                        </motion.button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 border border-white/20 bg-white/95 shadow-xl backdrop-blur-xl">
                                        <DropdownMenuLabel className="font-semibold">{auth.user?.name || 'User'}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={auth.user?.role === 'user' ? '/user/dashboard' : '/admin/dashboard'}
                                                className="flex items-center"
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                {auth.user?.role === 'user' ? 'Dashboard Saya' : 'Admin Dashboard'}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={auth.user?.role === 'user' ? '/user/profile' : '/settings/profile'}
                                                className="flex items-center"
                                            >
                                                <Settings className="mr-2 h-4 w-4" />
                                                {auth.user?.role === 'user' ? 'Profil Saya' : 'Settings'}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="flex w-full items-center text-left text-red-600"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="hidden items-center space-x-3 md:flex">
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        className="group relative overflow-hidden rounded-2xl border-2 border-[#2347FA] px-6 py-2.5 font-semibold text-[#2347FA] transition-all duration-500 ease-out hover:bg-[#2347FA] hover:text-white hover:shadow-md hover:shadow-[#2347FA]/30"
                                    >
                                        Masuk
                                    </Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button className="group relative transform overflow-hidden rounded-2xl bg-gradient-to-r from-[#2347FA] via-[#3b56fc] to-[#3b56fc] px-8 py-3 font-semibold text-white shadow-xl shadow-[#2347FA]/30 transition-all duration-500 ease-out hover:scale-105 hover:from-[#2347FA] hover:via-[#3b56fc] hover:to-[#3b56fc] hover:shadow-2xl hover:shadow-[#2347FA]/40">
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 -top-px flex h-[calc(100%+2px)] w-full justify-center blur-md">
                                                    <div className="w-3/4 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                                </div>
                                                <span className="relative z-10 flex items-center gap-2">
                                                    Daftar
                                                    <ChevronDown className="h-4 w-4" />
                                                </span>
                                            </Button>
                                        </motion.div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href="/register" className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                Daftar sebagai Pencari Kerja
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/register-company" className="cursor-pointer">
                                                <Building className="mr-2 h-4 w-4" />
                                                Daftar sebagai Perusahaan
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`relative z-50 rounded-xl p-2 transition-all duration-300 lg:hidden ${
                                isMobileMenuOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            aria-label="Toggle mobile menu"
                        >
                            <AnimatePresence mode="wait">
                                {isMobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {/* Mobile Menu Panel */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="absolute top-full right-0 left-0 z-50 max-h-[calc(100vh-80px)] overflow-y-auto border-t border-gray-200 bg-white shadow-2xl lg:hidden"
                            >
                                <div className="px-4 py-4 sm:px-6 sm:py-6">
                                    {/* Enhanced Search bar for mobile */}
                                    <div className="mb-6">
                                        <div className="relative">
                                            <h3 className="mb-3 px-1 text-sm font-bold tracking-wide text-gray-900 uppercase">
                                                Cari Pekerjaan Impian
                                            </h3>
                                            <div className="relative">
                                                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-blue-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Ketik posisi atau perusahaan..."
                                                    className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50/50 py-4 pr-4 pl-12 text-base font-medium placeholder-blue-400 shadow-lg transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const query = (e.target as HTMLInputElement).value.trim();
                                                            if (query) {
                                                                window.location.href = `/jobs?search=${encodeURIComponent(query)}`;
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => (window.location.href = '/jobs')}
                                                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-700"
                                                >
                                                    <Search className="mr-2 inline h-4 w-4" />
                                                    Lihat Semua Lowongan
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Navigation */}
                                    <div className="mb-6 space-y-1">
                                        <div className="mb-3">
                                            <h3 className="px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">Menu Utama</h3>
                                        </div>

                                        {/* Home Menu Item */}
                                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                            <Link
                                                href="/"
                                                className={`flex items-center rounded-2xl px-4 py-3 font-medium transition-all duration-300 ${
                                                    currentPage === 'home'
                                                        ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-lg shadow-[#2347FA]/20'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#2347FA] active:bg-gray-100'
                                                }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                    />
                                                </svg>
                                                Home
                                            </Link>
                                        </motion.div>

                                        {navItems.map((item, index) => {
                                            const isActive = currentPage === item.key;
                                            const icons = {
                                                jobs: (
                                                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2"
                                                        />
                                                    </svg>
                                                ),
                                                companies: (
                                                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                        />
                                                    </svg>
                                                ),
                                            };

                                            return (
                                                <motion.div
                                                    key={item.key}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1 + (index + 1) * 0.05 }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        className={`flex items-center rounded-3xl px-4 py-4 font-medium transition-all duration-300 ${
                                                            isActive
                                                                ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-lg shadow-[#2347FA]/20'
                                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#2347FA] active:bg-gray-100'
                                                        }`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {icons[item.key as keyof typeof icons]}
                                                        {item.name}
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Profil Section */}
                                    <div className="mb-8 border-t border-gray-100 pt-6">
                                        <div className="mb-4">
                                            <h3 className="px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">Informasi</h3>
                                        </div>

                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-2"
                                        >
                                            <Link
                                                href="/about"
                                                className={`flex items-center rounded-3xl px-4 py-3 font-medium transition-all duration-300 ${
                                                    currentPage === 'about'
                                                        ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-lg shadow-[#2347FA]/20'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#2347FA]'
                                                }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Tentang Kami
                                            </Link>
                                            <Link
                                                href="/contact"
                                                className="flex items-center rounded-3xl px-4 py-3 font-medium text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-[#2347FA]"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Hubungi Kami
                                            </Link>
                                            <Link
                                                href="/privacy-policy"
                                                className="flex items-center rounded-3xl px-4 py-3 font-medium text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-[#2347FA]"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                    />
                                                </svg>
                                                Kebijakan Privasi
                                            </Link>
                                            <Link
                                                href="/terms-of-service"
                                                className="flex items-center rounded-3xl px-4 py-3 font-medium text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-[#2347FA]"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                Syarat & Ketentuan
                                            </Link>
                                        </motion.div>
                                    </div>

                                    {/* User section for mobile */}
                                    {auth.user ? (
                                        <div className="border-t border-gray-100 pt-6">
                                            <div className="mb-4">
                                                <h3 className="px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">Akun Saya</h3>
                                            </div>

                                            <div className="mb-4 rounded-3xl border border-gray-100/50 bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 shadow-sm">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-12 w-12 border-2 border-[#2347FA]/20 shadow-sm">
                                                        <AvatarImage src={auth.user?.avatar_url || ''} alt={auth.user?.name || 'User'} />
                                                        <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] font-semibold text-white">
                                                            {auth.user?.name?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-semibold text-gray-900">{auth.user?.name || 'User'}</p>
                                                        <p className="truncate text-sm text-gray-500">{auth.user?.email || ''}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Link
                                                    href={auth.user?.role === 'user' ? '/user/dashboard' : '/admin/dashboard'}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="flex items-center rounded-3xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:text-[#2347FA] active:bg-gray-100">
                                                        <User className="mr-3 h-5 w-5" />
                                                        {auth.user?.role === 'user' ? 'Dashboard Saya' : 'Admin Dashboard'}
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={auth.user?.role === 'user' ? '/user/profile' : '/settings/profile'}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="flex items-center rounded-3xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:text-[#2347FA] active:bg-gray-100">
                                                        <Settings className="mr-3 h-5 w-5" />
                                                        {auth.user?.role === 'user' ? 'Profil Saya' : 'Settings'}
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={auth.user?.role === 'user' ? '/user/notifications' : '/admin/notifications'}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="flex w-full items-center rounded-3xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:text-[#2347FA] active:bg-gray-100">
                                                        <Bell className="mr-3 h-5 w-5" />
                                                        Notifikasi
                                                        <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
                                                    </div>
                                                </Link>

                                                <Link href="/logout" method="post" as="button" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <div className="flex items-center rounded-3xl px-4 py-3 font-medium text-red-600 transition-all duration-300 hover:bg-red-50 hover:text-red-700 active:bg-red-100">
                                                        <LogOut className="mr-3 h-5 w-5" />
                                                        Logout
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-t border-gray-100 pt-6">
                                            <div className="mb-4">
                                                <h3 className="px-3 text-sm font-bold tracking-wider text-gray-900 uppercase">Mulai Karir Anda</h3>
                                            </div>

                                            <div className="space-y-3 px-1 py-4">
                                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <div className="mb-3 flex cursor-pointer items-center justify-center rounded-2xl border-2 border-blue-600 px-6 py-4 font-bold text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-xl active:scale-95">
                                                        Masuk/Login
                                                    </div>
                                                </Link>
                                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <div className="mb-3 flex cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 font-bold text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/40 active:scale-95">
                                                        <User className="mr-2 h-5 w-5" />
                                                        Daftar Pencari Kerja
                                                    </div>
                                                </Link>
                                                <Link href="/register-company" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <div className="mb-3 flex cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 font-bold text-white shadow-xl shadow-green-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/40 active:scale-95">
                                                        <Building className="mr-2 h-5 w-5" />
                                                        Daftar Perusahaan
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Mobile CTA Text */}
                                            <div className="mt-4 text-center">
                                                <p className="px-2 text-xs text-gray-500">Dioptimalkan untuk mobile - Upload CV dengan mudah</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}
