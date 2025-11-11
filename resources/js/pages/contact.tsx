import { Head, Link, useForm } from '@inertiajs/react';
import SEOHead from '@/components/seo-head';
import { motion } from 'framer-motion';
// import ModernNavbar from '@/components/modern-navbar';
// import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Send,
    MessageCircle,
    Clock,
    CheckCircle,
    User,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { route } from 'ziggy-js';
import MainLayout from '@/layouts/main-layout';

interface Settings {
    id: number;
    site_name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    fb?: string;
    ig?: string;
    yt?: string;
    tiktok?: string;
}

interface ContactProps {
    title: string;
    settings: Settings;
}

export default function Contact({ title, settings }: ContactProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('contact.store'), {
            onSuccess: () => {
                reset();
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 5000);
            },
        });
    };

    return (
        <MainLayout currentPage="contact">
            <SEOHead
                title={`${title} | ${settings.site_name}`}
                description={`Hubungi tim ${settings.site_name} untuk bantuan, pertanyaan, atau kemitraan. Dapatkan respon cepat dari tim profesional kami dalam 2-4 jam kerja.`}
                keywords={`kontak ${settings.site_name}, hubungi kami, customer service, bantuan, support`}
                siteName={settings.site_name}
                type="website"
            />

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
                                <MessageCircle className="w-4 h-4 text-[#2347FA]" />
                                <span className="text-[#2347FA] font-semibold text-sm">Mari Terhubung</span>
                            </motion.div>
                            
                            {/* Main Heading */}
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
                            >
                                Hubungi Kami
                            </motion.h1>
                            
                            {/* Description */}
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
                            >
                                Ada pertanyaan, saran, atau ingin bermitra dengan kami? Tim support {settings.site_name} siap membantu Anda 24/7. 
                                Kirim pesan dan dapatkan respon cepat dari tim ahli kami.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Contact Form & Info */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="border-0 shadow-2xl bg-white overflow-hidden">
                                    <CardContent className="p-8 md:p-12">
                                        <div className="mb-8">
                                            <div className="flex items-center mb-4">
                                                <div className="w-12 h-12 bg-[#2347FA] rounded-lg flex items-center justify-center mr-4">
                                                    <Send className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Kirim Pesan</h2>
                                                    <p className="text-gray-600">Kami akan merespons dalam 24 jam</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Success Message */}
                                        {showSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                                <span className="text-green-800">Pesan Anda telah terkirim! Kami akan segera merespons.</span>
                                            </motion.div>
                                        )}

                                        <form onSubmit={submit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                                                        <User className="w-4 h-4 mr-2 text-gray-500" />
                                                        Nama Lengkap
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) => setData('name', e.target.value)}
                                                            onFocus={() => setFocusedField('name')}
                                                            onBlur={() => {
                                                                setFocusedField(null);
                                                                setTouched(prev => ({...prev, name: true}));
                                                            }}
                                                            placeholder="Masukkan nama lengkap Anda"
                                                            className={`w-full pr-10 transition-colors duration-200 ${
                                                                errors.name && touched.name 
                                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                                    : data.name && !errors.name
                                                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                                                    : focusedField === 'name'
                                                                    ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-200'
                                                                    : ''
                                                            }`}
                                                            required
                                                        />
                                                        {data.name && !errors.name && (
                                                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                                                        )}
                                                    </div>
                                                    {errors.name && touched.name && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm mt-1 flex items-center"
                                                        >
                                                            <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                            </span>
                                                            {errors.name}
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                                                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                                        Email
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={data.email}
                                                            onChange={(e) => setData('email', e.target.value)}
                                                            onFocus={() => setFocusedField('email')}
                                                            onBlur={() => {
                                                                setFocusedField(null);
                                                                setTouched(prev => ({...prev, email: true}));
                                                            }}
                                                            placeholder="nama@email.com"
                                                            className={`w-full pr-10 transition-colors duration-200 ${
                                                                errors.email && touched.email 
                                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                                    : data.email && !errors.email
                                                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                                                    : focusedField === 'email'
                                                                    ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-200'
                                                                    : ''
                                                            }`}
                                                            required
                                                        />
                                                        {data.email && !errors.email && (
                                                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                                                        )}
                                                    </div>
                                                    {errors.email && touched.email && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm mt-1 flex items-center"
                                                        >
                                                            <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                            </span>
                                                            {errors.email}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                                                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                        Nomor Telepon (Opsional)
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            value={data.phone}
                                                            onChange={(e) => setData('phone', e.target.value)}
                                                            onFocus={() => setFocusedField('phone')}
                                                            onBlur={() => {
                                                                setFocusedField(null);
                                                                setTouched(prev => ({...prev, phone: true}));
                                                            }}
                                                            placeholder="+62 812 3456 7890"
                                                            className={`w-full pr-10 transition-colors duration-200 ${
                                                                errors.phone && touched.phone 
                                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                                    : data.phone && !errors.phone
                                                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                                                    : focusedField === 'phone'
                                                                    ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-200'
                                                                    : ''
                                                            }`}
                                                        />
                                                        {data.phone && !errors.phone && (
                                                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                                                        )}
                                                    </div>
                                                    {errors.phone && touched.phone && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm mt-1 flex items-center"
                                                        >
                                                            <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                            </span>
                                                            {errors.phone}
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                                                        <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                                                        Subjek
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="subject"
                                                            type="text"
                                                            value={data.subject}
                                                            onChange={(e) => setData('subject', e.target.value)}
                                                            onFocus={() => setFocusedField('subject')}
                                                            onBlur={() => {
                                                                setFocusedField(null);
                                                                setTouched(prev => ({...prev, subject: true}));
                                                            }}
                                                            placeholder="Topik pesan Anda"
                                                            className={`w-full pr-10 transition-colors duration-200 ${
                                                                errors.subject && touched.subject 
                                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                                    : data.subject && !errors.subject
                                                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                                                    : focusedField === 'subject'
                                                                    ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-200'
                                                                    : ''
                                                            }`}
                                                            required
                                                        />
                                                        {data.subject && !errors.subject && (
                                                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                                                        )}
                                                    </div>
                                                    {errors.subject && touched.subject && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm mt-1 flex items-center"
                                                        >
                                                            <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                            </span>
                                                            {errors.subject}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                                                    <MessageCircle className="w-4 h-4 mr-2 text-gray-500" />
                                                    Pesan
                                                </Label>
                                                <div className="relative">
                                                    <Textarea
                                                        id="message"
                                                        value={data.message}
                                                        onChange={(e) => setData('message', e.target.value)}
                                                        onFocus={() => setFocusedField('message')}
                                                        onBlur={() => {
                                                            setFocusedField(null);
                                                            setTouched(prev => ({...prev, message: true}));
                                                        }}
                                                        placeholder="Tulis pesan Anda di sini..."
                                                        className={`w-full min-h-[120px] pr-10 transition-colors duration-200 resize-none ${
                                                            errors.message && touched.message 
                                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                                : data.message && !errors.message && data.message.length >= 10
                                                                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                                                : focusedField === 'message'
                                                                ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-200'
                                                                : ''
                                                        }`}
                                                        required
                                                    />
                                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                                        {data.message.length}/500
                                                    </div>
                                                </div>
                                                {errors.message && touched.message && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-500 text-sm mt-1 flex items-center"
                                                    >
                                                        <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                                                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                        </span>
                                                        {errors.message}
                                                    </motion.div>
                                                )}
                                                {!errors.message && data.message.length > 0 && (
                                                    <div className="text-green-600 text-sm mt-1 flex items-center">
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Pesan terlihat bagus!
                                                    </div>
                                                )}
                                            </div>

                                            <Button 
                                                type="submit" 
                                                disabled={processing}
                                                className="w-full bg-[#2347FA] hover:bg-[#3b56fc] text-white font-semibold py-3 px-6 text-lg"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Mengirim...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 w-5 h-5" />
                                                        Kirim Pesan
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="space-y-8"
                            >
                                {/* Header */}
                                <div className="text-center lg:text-left">
                                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-full px-6 py-3 mb-6">
                                        <Phone className="w-4 h-4 text-purple-600" />
                                        <span className="text-purple-600 font-semibold text-sm">Info Kontak</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                                        Hubungi Tim Kami
                                    </h2>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Tim profesional {settings.site_name} siap membantu Anda dengan respon cepat dan solusi terbaik.
                                    </p>
                                </div>

                                {/* Contact Cards Grid */}
                                <div className="grid gap-6">
                                    {/* Email Card - Enhanced */}
                                    {settings.email && (
                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 via-white to-indigo-50 group overflow-hidden relative">
                                                {/* Decorative background */}
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full"></div>
                                                <CardContent className="p-8 relative">
                                                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-[#2347FA] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                            <Mail className="h-8 w-8 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center mb-2">
                                                                <h3 className="text-xl font-bold text-gray-900">Email Kami</h3>
                                                                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                            </div>
                                                            <p className="text-gray-600 mb-3">Dapatkan balasan dalam 2-4 jam kerja</p>
                                                            <a 
                                                                href={`mailto:${settings.email}`} 
                                                                className="inline-flex items-center flex-wrap break-words whitespace-normal text-[#2347FA] hover:text-blue-600 font-semibold text-lg transition-colors group/link"
                                                            >
                                                                {settings.email}
                                                                <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}

                                    {/* Phone Card - Enhanced */}
                                    {settings.phone && (
                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-emerald-50 via-white to-teal-50 group overflow-hidden relative">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full"></div>
                                                <CardContent className="p-8 relative">
                                                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                            <Phone className="h-8 w-8 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center mb-2">
                                                                <h3 className="text-xl font-bold text-gray-900">Hubungi Langsung</h3>
                                                                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                            </div>
                                                            <p className="text-gray-600 mb-3">Senin - Jumat, 09:00 - 18:00 WIB</p>
                                                            <a 
                                                                href={`tel:${settings.phone}`} 
                                                                className="inline-flex items-center flex-wrap break-words whitespace-normal text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors group/link"
                                                            >
                                                                {settings.phone}
                                                                <svg className="w-4 h-4 ml-2 group-hover/link:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}

                                    {/* Address Card - Enhanced */}
                                    {settings.address && (
                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 via-white to-indigo-50 group overflow-hidden relative">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-bl-full"></div>
                                                <CardContent className="p-8 relative">
                                                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                            <MapPin className="h-8 w-8 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Lokasi Kantor</h3>
                                                            <p className="text-gray-600 mb-3">Kunjungi kantor kami untuk konsultasi langsung</p>
                                                            <p className="text-purple-600 font-semibold text-lg leading-relaxed break-words whitespace-normal">
                                                                {settings.address}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Response Time & Features */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                                    <div className="grid md:grid-cols-3 gap-6 text-center">
                                        <div>
                                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Respon Cepat</h4>
                                            <p className="text-sm text-gray-600">Balasan dalam 2-4 jam</p>
                                        </div>
                                        <div>
                                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Solusi Terpercaya</h4>
                                            <p className="text-sm text-gray-600">Tim berpengalaman 5+ tahun</p>
                                        </div>
                                        <div>
                                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <MessageCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Support 24/7</h4>
                                            <p className="text-sm text-gray-600">Layanan tanpa henti</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
        </MainLayout>
    );
}