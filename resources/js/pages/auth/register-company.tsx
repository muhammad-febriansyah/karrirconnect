import { Head, useForm, usePage } from '@inertiajs/react';
import { GalleryVerticalEnd, LoaderCircle, Eye, EyeOff, Building2, Mail, Lock, User, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { resolveAssetUrl } from '@/lib/utils';
import { type SharedData } from '@/types';

type CompanyRegisterForm = {
    company_name: string;
    company_email: string;
    company_phone: string;
    company_location: string;
    company_address: string;
    company_description: string;
    company_website: string;
    admin_name: string;
    admin_email: string;
    admin_phone: string;
    password: string;
    password_confirmation: string;
    'g-recaptcha-response': string;
};

export default function RegisterCompany() {
    const { settings } = usePage<SharedData>().props;
    const authIllustrationFallback = 'https://placehold.co/1920x1080/0f172a/FFFFFF?text=KarirConnect';
    const logoSrc = resolveAssetUrl(settings.logo);
    const thumbnailSrc = resolveAssetUrl(settings.thumbnail, authIllustrationFallback);
    const { data, setData, post, processing, errors, reset } = useForm<Required<CompanyRegisterForm>>({
        company_name: '',
        company_email: '',
        company_phone: '',
        company_location: '',
        company_address: '',
        company_description: '',
        company_website: '',
        admin_name: '',
        admin_email: '',
        admin_phone: '',
        password: '',
        password_confirmation: '',
        'g-recaptcha-response': '',
    });
    const recaptchaRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
        script.async = true;
        script.defer = true;
        
        // Define global callback function
        (window as any).onRecaptchaLoad = () => {
            if ((window as any).grecaptcha && (window as any).grecaptcha.render && recaptchaRef.current) {
                (window as any).grecaptcha.render(recaptchaRef.current, {
                    sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LekAgQsAAAAACd1Pjpmr4gsjaH9lYKNgMOQhmxF',
                    callback: (response: string) => {
                        setData('g-recaptcha-response', response);
                    },
                });
            }
        };
        
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
            delete (window as any).onRecaptchaLoad;
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register-company', {
            onFinish: () => {
                reset('password', 'password_confirmation');
                if ((window as any).grecaptcha) {
                    (window as any).grecaptcha.reset();
                    setData('g-recaptcha-response', '');
                }
            },
            onSuccess: () => {
                toast.success('Akun Perusahaan Berhasil Dibuat!', {
                    description: 'Selamat! Akun perusahaan Anda berhasil dibuat dan sedang menunggu verifikasi admin.',
                    duration: 5000,
                });
            },
            onError: () => {
                toast.error('Gagal Membuat Akun Perusahaan', {
                    description: 'Terjadi kesalahan saat membuat akun. Silakan periksa data Anda dan coba lagi.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <>
            <Head title="Daftar Perusahaan" />

            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10 overflow-y-auto">
                    <div className="flex justify-start">
                        <a href="/" className="flex items-center">
                            <div className="flex items-center justify-center overflow-hidden">
                                {logoSrc ? (
                                    <img src={logoSrc} alt={settings.site_name || 'Logo'} className="h-10 w-auto max-w-[160px] object-contain" />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                        <GalleryVerticalEnd className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        </a>
                    </div>

                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-md">
                            <form className="flex flex-col gap-6" onSubmit={submit}>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">Daftar Sebagai Perusahaan</h1>
                                    <p className="text-sm text-balance text-muted-foreground">
                                        Bergabunglah dengan KarirConnect untuk menemukan talenta terbaik
                                    </p>
                                </div>

                                <div className="grid gap-6">
                                    {/* Company Information Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">Informasi Perusahaan</h3>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="company_name">Nama Perusahaan *</Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="company_name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="organization"
                                                    value={data.company_name}
                                                    onChange={(e) => setData('company_name', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="PT. Nama Perusahaan"
                                                    className="pl-10"
                                                />
                                            </div>
                                            <InputError message={errors.company_name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="company_email">Email Perusahaan *</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="company_email"
                                                    type="email"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    value={data.company_email}
                                                    onChange={(e) => setData('company_email', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="info@perusahaan.com"
                                                    className="pl-10"
                                                />
                                            </div>
                                            <InputError message={errors.company_email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="company_phone">Nomor Telepon Perusahaan</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="company_phone"
                                                    type="text"
                                                    tabIndex={3}
                                                    value={data.company_phone}
                                                    onChange={(e) => setData('company_phone', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="021-123456789"
                                                    className="pl-10"
                                                />
                                            </div>
                                            <InputError message={errors.company_phone} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="company_website">Website Perusahaan (Opsional)</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="company_website"
                                                    type="text"
                                                    tabIndex={4}
                                                    value={data.company_website}
                                                    onChange={(e) => setData('company_website', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="www.perusahaan.com atau perusahaan.com (opsional)"
                                                    className="pl-10"
                                                />
                                            </div>
                                            <InputError message={errors.company_website} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="company_location">Lokasi Perusahaan *</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="company_location"
                                                    type="text"
                                                    required
                                                    tabIndex={5}
                                                    value={data.company_location}
                                                    onChange={(e) => setData('company_location', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Jakarta, Indonesia"
                                                    className="pl-10"
                                                />
                                            </div>
                                            <InputError message={errors.company_location} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="company_address">Alamat Perusahaan</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Textarea
                                                    id="company_address"
                                                    tabIndex={5}
                                                    value={data.company_address}
                                                    onChange={(e) => setData('company_address', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Jl. Alamat Lengkap Perusahaan"
                                                    className="pl-10 min-h-[60px]"
                                                    rows={2}
                                                />
                                            </div>
                                            <InputError message={errors.company_address} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="company_description">Deskripsi Perusahaan</Label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Textarea
                                                    id="company_description"
                                                    tabIndex={6}
                                                    value={data.company_description}
                                                    onChange={(e) => setData('company_description', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Deskripsikan bidang usaha dan visi misi perusahaan..."
                                                    className="pl-10 min-h-[80px]"
                                                    rows={3}
                                                />
                                            </div>
                                            <InputError message={errors.company_description} />
                                        </div>
                                    </div>

                                    {/* Admin Account Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">Akun Administrator</h3>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="admin_name">Nama Administrator *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="admin_name"
                                                    type="text"
                                                    required
                                                    tabIndex={7}
                                                    autoComplete="name"
                                                    value={data.admin_name}
                                                    onChange={(e) => setData('admin_name', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Nama lengkap administrator"
                                                    className="pl-10"
                                                />
                                            </div>
                                            <InputError message={errors.admin_name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="admin_email">Email Administrator *</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="admin_email"
                                                    type="email"
                                                    required
                                                    tabIndex={8}
                                                    autoComplete="email"
                                                    value={data.admin_email}
                                                    onChange={(e) => setData('admin_email', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="admin@perusahaan.com"
                                                    className="pl-10"
                                                />
                                            </div>
                                            <InputError message={errors.admin_email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="admin_phone">Nomor WhatsApp Administrator *</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="admin_phone"
                                                    type="text"
                                                    required
                                                    tabIndex={9}
                                                    value={data.admin_phone}
                                                    onChange={(e) => setData('admin_phone', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="081234567890 (untuk notifikasi verifikasi)"
                                                    className="pl-10"
                                                />
                                            </div>
                                            <InputError message={errors.admin_phone} />
                                            <p className="text-xs text-gray-500">Nomor WhatsApp ini akan digunakan untuk memberitahu status verifikasi perusahaan</p>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Kata Sandi *</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    tabIndex={10}
                                                    autoComplete="new-password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Minimal 8 karakter"
                                                    className="pl-10 pr-12"
                                                    minLength={8}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi *</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="password_confirmation"
                                                    type={showPasswordConfirmation ? "text" : "password"}
                                                    required
                                                    tabIndex={11}
                                                    autoComplete="new-password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Ulangi kata sandi"
                                                    className="pl-10 pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="recaptcha-container"><div ref={recaptchaRef} /></div>
                                        <InputError message={errors['g-recaptcha-response']} />
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        tabIndex={12} 
                                        disabled={processing}
                                        style={{
                                            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                                            border: 'none',
                                            color: 'white',
                                            fontWeight: '600',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                                            transform: processing ? 'scale(0.98)' : 'scale(1)',
                                            opacity: processing ? 0.8 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!processing) {
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!processing) {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
                                            }
                                        }}
                                    >
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Daftar Perusahaan
                                    </Button>

                                    {/* General Error */}
                                    <InputError message={errors.general} />
                                </div>

                                <div className="text-center text-sm text-muted-foreground space-y-2">
                                    <p>Sudah punya akun?</p>
                                    <div className="space-y-1">
                                        <TextLink href="/login" tabIndex={13}>
                                            Masuk ke Akun Anda
                                        </TextLink>
                                        <span className="mx-2">•</span>
                                        <TextLink href="/register" tabIndex={14}>
                                            Daftar sebagai Pencari Kerja
                                        </TextLink>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="relative hidden bg-muted lg:block">
                    <img src={thumbnailSrc} alt="Ilustrasi daftar perusahaan" className="absolute inset-0 h-full w-full object-cover" />
                </div>
            </div>
        </>
    );
}
