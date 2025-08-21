import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { 
    Scale, 
    FileCheck, 
    Users, 
    AlertTriangle,
    Shield,
    BookOpen,
    ArrowLeft,
    CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TermsOfServiceProps {
    title: string;
    termsOfService?: {
        id: number;
        body: string;
        created_at: string;
        updated_at: string;
    };
}

export default function TermsOfService({ title, termsOfService }: TermsOfServiceProps) {
    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen bg-white">
                {/* Modern Navbar */}
                <ModernNavbar currentPage="terms-of-service" />

                {/* Hero Section */}
                <section className="relative bg-white pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
                    {/* Flickering Grid Background */}
                    <div className="absolute inset-0 z-0">
                        <FlickeringGrid 
                            className="h-full w-full"
                            squareSize={4}
                            gridGap={6}
                            color="rgb(34, 197, 94)"
                            maxOpacity={0.08}
                            flickerChance={0.1}
                        />
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            {/* Badge */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8"
                            >
                                <Scale className="w-4 h-4 text-[#2347FA]" />
                                <span className="text-[#2347FA] font-semibold text-sm">Ketentuan Layanan</span>
                            </motion.div>
                            
                            {/* Main Heading */}
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
                            >
                                Syarat dan Ketentuan
                            </motion.h1>
                            
                            {/* Description */}
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
                            >
                                Ketentuan penggunaan platform KarirConnect yang mengatur hak dan kewajiban pengguna. 
                                Harap baca dengan teliti sebelum menggunakan layanan kami.
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="mb-8"
                            >
                                <Link href="/">
                                    <Button variant="outline" className="border-[#2347FA] text-[#2347FA] hover:bg-[#2347FA] hover:text-white">
                                        <ArrowLeft className="mr-2 w-4 h-4" />
                                        Kembali ke Beranda
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="text-sm text-gray-500"
                            >
                                Terakhir diperbarui: 21 Agustus 2025
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {termsOfService ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="border-0 shadow-xl bg-white">
                                    <CardContent className="p-0">
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 md:p-12 text-white">
                                            <div className="flex items-center mb-6">
                                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-6">
                                                    <Scale className="h-8 w-8 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl font-bold text-white mb-2">Syarat dan Ketentuan</h2>
                                                    <p className="text-emerald-100">Ketentuan penggunaan layanan kami</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                                <p className="text-emerald-50 text-sm">
                                                    <strong>Terakhir diperbarui:</strong> {new Date(termsOfService.updated_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-8 md:p-12">
                                            <div className="prose prose-lg max-w-none">
                                                <style>{`
                                                    .terms-of-service-content h2 {
                                                        color: #1f2937;
                                                        font-size: 1.875rem;
                                                        font-weight: 700;
                                                        margin-top: 2rem;
                                                        margin-bottom: 1rem;
                                                        padding-bottom: 0.5rem;
                                                        border-bottom: 2px solid #e5e7eb;
                                                    }
                                                    .terms-of-service-content h3 {
                                                        color: #374151;
                                                        font-size: 1.5rem;
                                                        font-weight: 600;
                                                        margin-top: 1.5rem;
                                                        margin-bottom: 0.75rem;
                                                    }
                                                    .terms-of-service-content p {
                                                        color: #4b5563;
                                                        line-height: 1.75;
                                                        margin-bottom: 1rem;
                                                    }
                                                    .terms-of-service-content ul, .terms-of-service-content ol {
                                                        margin: 1rem 0;
                                                        padding-left: 1.5rem;
                                                    }
                                                    .terms-of-service-content li {
                                                        color: #4b5563;
                                                        margin-bottom: 0.5rem;
                                                        line-height: 1.6;
                                                    }
                                                    .terms-of-service-content strong {
                                                        color: #1f2937;
                                                        font-weight: 600;
                                                    }
                                                    .terms-of-service-content hr {
                                                        margin: 2rem 0;
                                                        border: none;
                                                        height: 1px;
                                                        background: linear-gradient(to right, transparent, #d1d5db, transparent);
                                                    }
                                                    .terms-of-service-content a {
                                                        color: #2347FA;
                                                        text-decoration: none;
                                                        font-weight: 500;
                                                    }
                                                    .terms-of-service-content a:hover {
                                                        text-decoration: underline;
                                                    }
                                                `}</style>
                                                <div 
                                                    dangerouslySetInnerHTML={{ __html: termsOfService.body }}
                                                    className="terms-of-service-content"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="border-0 shadow-xl">
                                    <CardContent className="p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-6">
                                            <Scale className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Syarat dan Ketentuan</h3>
                                        <p className="text-gray-600">
                                            Syarat dan ketentuan sedang dalam proses pembaruan. Silakan hubungi kami untuk informasi lebih lanjut.
                                        </p>
                                        <div className="mt-6">
                                            <Link href="/contact">
                                                <Button className="bg-[#2347FA] hover:bg-[#3b56fc] text-white font-semibold">
                                                    Hubungi Kami
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-12"
                        >
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-[#2347FA] to-indigo-700 text-white">
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
                                    <p className="text-blue-100 leading-relaxed mb-6">
                                        Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
                                    </p>
                                    <div className="space-y-2 text-blue-100">
                                        <p>Email: legal@karirconnect.id</p>
                                        <p>Telepon: +62 21 1234 5678</p>
                                        <p>Alamat: Jl. Sudirman No. 123, Jakarta Pusat, 10220</p>
                                    </div>
                                    <div className="mt-6">
                                        <Link href="/contact">
                                            <Button className="bg-white text-[#2347FA] hover:bg-blue-50 font-semibold">
                                                Kirim Pesan
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* Modern Footer */}
                <ModernFooter />
            </div>
        </>
    );
}