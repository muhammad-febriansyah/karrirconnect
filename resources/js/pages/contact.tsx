import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
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

interface ContactProps {
    title: string;
}

export default function Contact({ title }: ContactProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [showSuccess, setShowSuccess] = useState(false);

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
        <>
            <Head title={title} />
            
            <div className="min-h-screen bg-white">
                {/* Modern Navbar */}
                <ModernNavbar currentPage="contact" />

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
                                Ada pertanyaan, saran, atau ingin bermitra dengan kami? Tim support KarirConnect siap membantu Anda 24/7. 
                                Kirim pesan dan dapatkan respon cepat dari tim ahli kami.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Contact Form & Info */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12">
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
                                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Nama Lengkap
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        placeholder="Masukkan nama lengkap Anda"
                                                        className="w-full"
                                                        required
                                                    />
                                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                                </div>

                                                <div>
                                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        placeholder="nama@email.com"
                                                        className="w-full"
                                                        required
                                                    />
                                                    {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Nomor Telepon (Opsional)
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                        placeholder="+62 812 3456 7890"
                                                        className="w-full"
                                                    />
                                                    {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                                                </div>

                                                <div>
                                                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Subjek
                                                    </Label>
                                                    <Input
                                                        id="subject"
                                                        type="text"
                                                        value={data.subject}
                                                        onChange={(e) => setData('subject', e.target.value)}
                                                        placeholder="Topik pesan Anda"
                                                        className="w-full"
                                                        required
                                                    />
                                                    {errors.subject && <div className="text-red-500 text-sm mt-1">{errors.subject}</div>}
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Pesan
                                                </Label>
                                                <Textarea
                                                    id="message"
                                                    value={data.message}
                                                    onChange={(e) => setData('message', e.target.value)}
                                                    placeholder="Tulis pesan Anda di sini..."
                                                    className="w-full min-h-[120px]"
                                                    required
                                                />
                                                {errors.message && <div className="text-red-500 text-sm mt-1">{errors.message}</div>}
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
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                        Tim customer service kami tersedia untuk membantu Anda dengan segala pertanyaan 
                                        seputar KarirConnect, mulai dari bantuan teknis hingga kemitraan bisnis.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {/* Email */}
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-[#2347FA] rounded-lg flex items-center justify-center mr-4">
                                                    <Mail className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                                    <p className="text-gray-600 text-sm mb-2">Kirim email kapan saja</p>
                                                    <a href="mailto:info@karirconnect.id" className="text-[#2347FA] hover:text-[#3b56fc] font-medium">
                                                        info@karirconnect.id
                                                    </a>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Phone */}
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-50 to-teal-50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mr-4">
                                                    <Phone className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                                                    <p className="text-gray-600 text-sm mb-2">Hubungi tim support</p>
                                                    <a href="tel:+622112345678" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                                        +62 21 1234 5678
                                                    </a>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Address */}
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-indigo-50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                                                    <MapPin className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">Lokasi</h3>
                                                    <p className="text-gray-600 text-sm mb-2">Kunjungi kantor kami</p>
                                                    <p className="text-purple-600 font-medium">
                                                        Jl. Sudirman No. 123<br />
                                                        Jakarta Pusat, 10220
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Business Hours */}
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-amber-50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                                                    <Clock className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                                                    <p className="text-gray-600 text-sm mb-2">Senin - Jumat: 09:00 - 18:00</p>
                                                    <p className="text-orange-600 font-medium">
                                                        Support 24/7 via Email
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Quick Links */}
                                <div className="pt-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Link Cepat</h3>
                                    <div className="space-y-3">
                                        <Link href="/privacy-policy" className="block text-[#2347FA] hover:text-[#3b56fc] transition-colors">
                                            → Kebijakan Privasi
                                        </Link>
                                        <Link href="/terms-of-service" className="block text-[#2347FA] hover:text-[#3b56fc] transition-colors">
                                            → Syarat dan Ketentuan
                                        </Link>
                                        <Link href="/about" className="block text-[#2347FA] hover:text-[#3b56fc] transition-colors">
                                            → Tentang Kami
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Modern Footer */}
                <ModernFooter />
            </div>
        </>
    );
}