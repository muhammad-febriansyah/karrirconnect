import { NumberTicker } from '@/components/magicui/number-ticker';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useMemo, useState, type ReactNode } from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

type SocialKey = 'facebook' | 'instagram' | 'linkedin' | 'x' | 'tiktok';

interface FooterProps {
    siteName?: string;
    siteDescription?: string;
    statistics?: {
        total_jobs?: number;
        total_companies?: number;
        total_candidates?: number;
    };
    settings?: {
        social?: Record<string, string | undefined>;
        description?: string;
        email?: string;
        phone?: string;
        address?: string;
        logo?: string;
        site_name?: string;
    };
}

const SOCIAL_ALIASES: Record<SocialKey, string[]> = {
    facebook: ['facebook', 'fb'],
    instagram: ['instagram', 'ig'],
    linkedin: ['linkedin'],
    x: ['x', 'twitter'],
    tiktok: ['tiktok'],
};

const SOCIAL_PLATFORMS: Array<{ key: SocialKey; label: string; icon: ReactNode; bg: string; text: string }> = [
    { key: 'x', label: 'X (Twitter)', icon: <FaXTwitter className="h-4 w-4" />, bg: 'bg-slate-900', text: 'text-white' },
    { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" />, bg: 'bg-blue-50', text: 'text-blue-700' },
    { key: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" />, bg: 'bg-pink-50', text: 'text-pink-600' },
    { key: 'facebook', label: 'Facebook', icon: <Facebook className="h-4 w-4" />, bg: 'bg-blue-50', text: 'text-blue-600' },
    { key: 'tiktok', label: 'TikTok', icon: <FaTiktok className="h-4 w-4" />, bg: 'bg-slate-900', text: 'text-white' },
];

const formatSocialUrl = (platform: SocialKey, value: string): string => {
    if (/^https?:\/\//i.test(value)) return value;
    const handle = value.replace(/^@/, '');
    switch (platform) {
        case 'facebook':
            return `https://facebook.com/${handle}`;
        case 'instagram':
            return `https://instagram.com/${handle}`;
        case 'linkedin':
            if (handle.startsWith('company/') || handle.startsWith('in/')) return `https://www.linkedin.com/${handle}`;
            return `https://www.linkedin.com/company/${handle}`;
        case 'x':
            return `https://x.com/${handle}`;
        case 'tiktok':
            return handle.includes('@') ? `https://www.tiktok.com/${handle}` : `https://www.tiktok.com/@${handle}`;
        default:
            return value;
    }
};

export default function ModernFooter({
    siteName = 'KarirConnect',
    siteDescription = 'Platform karir terpercaya yang menghubungkan talenta terbaik dengan peluang karir yang tepat',
    statistics,
    settings,
}: FooterProps) {
    const { settings: pageSettings } = usePage<SharedData>().props;
    const currentYear = new Date().getFullYear();
    const [logoBroken, setLogoBroken] = useState(false);

    const resolvedSiteName = settings?.site_name || pageSettings?.site_name || siteName;
    const resolvedDescription = settings?.description || pageSettings?.description || siteDescription;
    const contactEmail = (settings?.email || pageSettings?.email) as string | undefined;
    const contactPhone = (settings?.phone || pageSettings?.phone) as string | undefined;
    const contactAddress = (settings?.address || pageSettings?.address) as string | undefined;

    const propLogo = settings?.logo;
    const sharedLogo = pageSettings?.logo
        ? pageSettings.logo.toString().startsWith('http')
            ? (pageSettings.logo as string)
            : `/storage/${pageSettings.logo}`
        : undefined;
    const logoUrl = propLogo || sharedLogo;

    const sharedSocial = (pageSettings as unknown as { social?: Record<string, string> })?.social;

    const socialLinks = useMemo(() => {
        return SOCIAL_PLATFORMS.map((platform) => {
            const aliases = SOCIAL_ALIASES[platform.key];
            const candidate =
                aliases
                    .map(
                        (alias) =>
                            settings?.social?.[alias] ||
                            (settings as Record<string, unknown> | undefined)?.[alias] ||
                            sharedSocial?.[alias] ||
                            (pageSettings as Record<string, unknown> | undefined)?.[alias],
                    )
                    .find((value): value is string => typeof value === 'string' && value.trim().length > 0);

            if (!candidate) return null;
            return {
                ...platform,
                href: formatSocialUrl(platform.key, candidate.trim()),
            };
        }).filter(Boolean) as Array<{ key: SocialKey; label: string; icon: ReactNode; bg: string; text: string; href: string }>;
    }, [pageSettings, settings, sharedSocial]);

    const statItems = [
        { label: 'Lowongan Aktif', value: statistics?.total_jobs ?? 0, delay: 0.2 },
        { label: 'Perusahaan Terpercaya', value: statistics?.total_companies ?? 0, delay: 0.35 },
        { label: 'Talenta Terhubung', value: statistics?.total_candidates ?? 0, delay: 0.5 },
    ];

    const quickLinks = [
        {
            title: 'Tentang',
            links: [
                { label: 'Tentang Kami', href: '/about' },
                { label: 'Blog & Artikel', href: '/blog' },
                { label: 'Keunggulan Kami', href: '/about#values' },
                { label: 'Kontak', href: '/contact' },
            ],
        },
        {
            title: 'Eksplor',
            links: [
                { label: 'Lowongan', href: '/jobs' },
                { label: 'Perusahaan', href: '/companies' },
                { label: 'Pasang Lowongan', href: '/pasang-lowongan' },
                { label: 'Success Stories', href: '/#stories' },
            ],
        },
        {
            title: 'Dukungan',
            links: [
                { label: 'Pusat Bantuan', href: '/contact' },
                { label: 'Kebijakan Privasi', href: '/privacy-policy' },
                { label: 'Syarat & Ketentuan', href: '/terms-of-service' },
                { label: 'Panduan Keamanan', href: '/blog' },
            ],
        },
    ];

    const gridPattern = "url(\"data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(59,86,252,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23grid)'/%3E%3C/svg%3E\")";

    return (
        <footer className="relative mt-12 overflow-hidden border-t border-slate-100 bg-gradient-to-b from-white via-slate-50/50 to-blue-50/30 text-slate-900 sm:mt-16">
            <div className="pointer-events-none absolute inset-0">
                {/* Animated blur orbs */}
                <div className="absolute -top-40 left-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-transparent blur-3xl" />
                <div className="absolute -top-20 right-20 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 via-blue-400/20 to-transparent blur-3xl [animation-delay:1s]" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-pulse rounded-full bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-transparent blur-3xl [animation-delay:2s]" />

                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,86,252,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.08),transparent_50%)]" />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: gridPattern }} />
            </div>

            <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <div className="group relative mx-auto w-full max-w-7xl rounded-2xl border border-slate-200/50 bg-white/80 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl transition-all duration-500 hover:shadow-blue-500/20 sm:rounded-3xl sm:p-8 lg:rounded-[36px] lg:p-10">
                    {/* Inner glow effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:rounded-3xl lg:rounded-[36px]" />

                    <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-12">
                        <div className="space-y-6 lg:col-span-5 lg:space-y-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                {logoUrl && !logoBroken ? (
                                    <img
                                        src={logoUrl}
                                        alt={resolvedSiteName}
                                        className="h-10 w-auto object-contain sm:h-12"
                                        onError={() => setLogoBroken(true)}
                                    />
                                ) : (
                                    <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-lg font-bold text-white shadow-lg shadow-blue-500/30 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                                        {resolvedSiteName.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">{resolvedSiteName}</h3>
                                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">{resolvedDescription}</p>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-3 backdrop-blur-sm sm:gap-4 sm:rounded-3xl sm:p-4">
                                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl" />
                                <div className="relative grid grid-cols-3 gap-3">
                                    {statItems.map((item) => (
                                        <div key={item.label} className="text-center">
                                            <div className="text-lg font-bold text-[#2347FA] sm:text-2xl">
                                                <NumberTicker value={item.value} delay={item.delay} className="text-lg font-bold text-[#2347FA] sm:text-2xl" />+
                                            </div>
                                            <p className="mt-0.5 text-[9px] uppercase leading-tight tracking-wider text-slate-500 sm:mt-1 sm:text-[10px]">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {socialLinks.length > 0 && (
                                <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/60 p-4 backdrop-blur-sm sm:rounded-3xl">
                                    <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-purple-400/10 blur-2xl" />
                                    <p className="relative mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500 sm:mb-4 sm:text-xs sm:tracking-[0.3em]">Ikuti Kami</p>
                                    <div className="relative flex flex-wrap gap-2 sm:gap-3">
                                        {socialLinks.map((social) => (
                                            <motion.a
                                                key={social.key}
                                                whileHover={{ scale: 1.05, translateY: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.label}
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-sm ${social.bg} ${social.text} shadow-md shadow-blue-100/40 transition-all hover:shadow-lg hover:shadow-blue-200/50 sm:h-11 sm:w-11 sm:rounded-2xl`}
                                            >
                                                {social.icon}
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7 lg:gap-5">
                            {quickLinks.map((section) => (
                                <div key={section.title} className="group/link relative overflow-hidden rounded-2xl bg-white/30 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/50 sm:rounded-3xl sm:p-5">
                                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-400/5 blur-xl transition-all duration-300 group-hover/link:bg-blue-400/10" />
                                    <p className="relative text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 sm:text-xs sm:tracking-[0.35em]">{section.title}</p>
                                    <ul className="relative mt-3 space-y-2 text-xs sm:mt-4 sm:text-sm">
                                        {section.links.map((link) => (
                                            <li key={link.label}>
                                                <Link href={link.href} className="group flex items-center gap-2 text-slate-600 transition-all hover:translate-x-1 hover:text-[#2347FA]">
                                                    <span className="h-1 w-1 rounded-full bg-slate-300 transition-colors group-hover:bg-[#2347FA] sm:h-1.5 sm:w-1.5" />
                                                    <span className="leading-relaxed">{link.label}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50/70 to-blue-50/40 p-4 text-xs text-slate-600 backdrop-blur-sm sm:mt-8 sm:rounded-3xl sm:p-5 sm:text-sm lg:mt-10">
                        <div className="pointer-events-none absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />
                        <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 sm:text-xs sm:tracking-[0.35em]">Email</p>
                                {contactEmail ? (
                                    <a href={`mailto:${contactEmail}`} className="mt-1 block truncate text-sm font-semibold text-[#2347FA] transition-colors hover:text-[#1a3af0] sm:mt-2 sm:text-base">
                                        {contactEmail}
                                    </a>
                                ) : (
                                    <p className="mt-1 truncate text-sm text-slate-500 sm:mt-2 sm:text-base">support@karirconnect.com</p>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 sm:text-xs sm:tracking-[0.35em]">Telepon</p>
                                {contactPhone ? (
                                    <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="mt-1 block truncate text-sm font-semibold text-[#2347FA] transition-colors hover:text-[#1a3af0] sm:mt-2 sm:text-base">
                                        {contactPhone}
                                    </a>
                                ) : (
                                    <p className="mt-1 text-sm text-slate-500 sm:mt-2 sm:text-base">(+62) 812-3456-7890</p>
                                )}
                            </div>
                            <div className="overflow-hidden sm:col-span-1">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 sm:text-xs sm:tracking-[0.35em]">Alamat</p>
                                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
                                    {contactAddress || 'Jl. Kemajuan No. 10, Jakarta, Indonesia'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6">
                        <p className="text-center text-xs sm:text-left sm:text-sm">
                            © {currentYear} <span className="font-semibold text-slate-900">{resolvedSiteName}</span>. Semua hak dilindungi.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:justify-end sm:gap-4 sm:text-sm">
                            <Link href="/privacy-policy" className="text-slate-600 transition-colors hover:text-[#2347FA]">
                                Kebijakan Privasi
                            </Link>
                            <span className="text-slate-300">•</span>
                            <Link href="/terms-of-service" className="text-slate-600 transition-colors hover:text-[#2347FA]">
                                Syarat & Ketentuan
                            </Link>
                            <span className="text-slate-300">•</span>
                            <Link href="/contact" className="text-slate-600 transition-colors hover:text-[#2347FA]">
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
