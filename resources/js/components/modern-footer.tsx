import { motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { type SharedData } from '@/types';

interface FooterProps {
    siteName?: string;
    siteDescription?: string;
    statistics?: {
        total_jobs?: number;
        total_companies?: number;
        total_candidates?: number;
    };
    settings?: {
        social?: {
            facebook?: string;
            instagram?: string;
            youtube?: string;
            tiktok?: string;
        };
    };
}

export default function ModernFooter({ 
    siteName = "KarirConnect", 
    siteDescription = "Platform karir terpercaya yang menghubungkan talenta terbaik dengan peluang karir yang tepat",
    statistics,
    settings 
}: FooterProps) {
    const { settings: pageSettings } = usePage<SharedData>().props;
    return (
        <footer className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-16">
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-6"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="relative">
                                        {pageSettings?.logo ? (
                                            <img
                                                src={pageSettings.logo.startsWith('http') ? pageSettings.logo : `/storage/${pageSettings.logo}`}
                                                alt={pageSettings.site_name || siteName}
                                                className="h-10 w-40 rounded-xl object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        {!pageSettings?.logo && (
                                            <div className="w-10 h-10 bg-gradient-to-r from-[#2347FA] to-[#3b56fc] rounded-xl flex items-center justify-center shadow-lg">
                                                <span className="text-white font-bold text-lg">
                                                    {siteName.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="hidden w-10 h-10 bg-gradient-to-r from-[#2347FA] to-[#3b56fc] rounded-xl flex items-center justify-center shadow-lg">
                                            <span className="text-white font-bold text-lg">
                                                {siteName.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                    {!pageSettings?.logo && <span className="text-2xl font-bold text-gray-900">{siteName}</span>}
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                                    {siteDescription}
                                </p>
                                
                                {/* Simplified Statistics */}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-xl font-bold text-[#2347FA] mb-1">
                                            <NumberTicker value={statistics?.total_jobs || 10000} className="text-xl font-bold text-[#2347FA]" delay={0.2} />+
                                        </div>
                                        <div className="text-xs text-gray-500">Lowongan</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-[#2347FA] mb-1">
                                            <NumberTicker value={statistics?.total_companies || 5000} className="text-xl font-bold text-[#2347FA]" delay={0.3} />+
                                        </div>
                                        <div className="text-xs text-gray-500">Perusahaan</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-[#2347FA] mb-1">
                                            <NumberTicker value={statistics?.total_candidates || 100000} className="text-xl font-bold text-[#2347FA]" delay={0.4} />+
                                        </div>
                                        <div className="text-xs text-gray-500">Pengguna</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* Platform */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/jobs" className="text-gray-600 hover:text-[#2347FA] transition-colors text-sm">
                                        Cari Lowongan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/companies" className="text-gray-600 hover:text-[#2347FA] transition-colors text-sm">
                                        Perusahaan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company/jobs/create" className="text-gray-600 hover:text-[#2347FA] transition-colors text-sm flex items-center gap-1">
                                        Pasang Lowongan
                                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                            1 Poin
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>
                        
                        {/* Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <h4 className="font-semibold text-gray-900 mb-4">Info</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/about" className="text-gray-600 hover:text-[#2347FA] transition-colors text-sm">
                                        Tentang Kami
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" className="text-gray-600 hover:text-[#2347FA] transition-colors text-sm">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#2347FA] transition-colors text-sm">
                                        Bantuan
                                    </a>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                    
                    {/* Contact Information - Optional */}
                    {settings && (settings.social?.facebook || settings.social?.instagram || settings.social?.youtube || settings.social?.tiktok) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mt-12 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm"
                        >
                            <h4 className="font-bold text-gray-900 mb-6 text-lg">Ikuti Kami</h4>
                            <div className="flex items-center space-x-4">
                                {settings.social?.facebook && (
                                    <motion.a
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        href={`https://facebook.com/${settings.social.facebook}`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 transition-colors duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
                                        </svg>
                                    </motion.a>
                                )}
                                {settings.social?.instagram && (
                                    <motion.a
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        href={`https://instagram.com/${settings.social.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-pink-50 hover:bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 transition-colors duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </motion.a>
                                )}
                                {settings.social?.youtube && (
                                    <motion.a
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        href={`https://youtube.com/@${settings.social.youtube}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center text-red-600 transition-colors duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                    </motion.a>
                                )}
                                {settings.social?.tiktok && (
                                    <motion.a
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        href={`https://tiktok.com/@${settings.social.tiktok}`}
                                        target="_blank"
                                        rel="noopener noreferrer" 
                                        className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 transition-colors duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.9a6.34 6.34 0 0 0 10.86-4.43V7.93a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.36z"/>
                                        </svg>
                                    </motion.a>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
                
                {/* Bottom Bar */}
                <div className="border-t border-gray-200 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 text-sm mb-4 md:mb-0">
                            © 2024 {siteName}. Semua hak dilindungi undang-undang.
                        </p>
                        
                        {/* Social Media Placeholder when no settings provided */}
                        {!settings?.social && (
                            <div className="flex items-center space-x-4">
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    href="https://facebook.com/karirconnect"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 transition-colors duration-300"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
                                    </svg>
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    href="https://instagram.com/karirconnect"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-pink-50 hover:bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 transition-colors duration-300"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    href="https://youtube.com/@karirconnect"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center text-red-600 transition-colors duration-300"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    href="https://tiktok.com/@karirconnect"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 transition-colors duration-300"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.9a6.34 6.34 0 0 0 10.86-4.43V7.93a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.36z"/>
                                    </svg>
                                </motion.a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}