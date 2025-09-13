import { Head, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, GalleryVerticalEnd, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
    'g-recaptcha-response': string;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ canResetPassword }: LoginProps) {
    const { settings } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
        'g-recaptcha-response': '',
    });
    const recaptchaRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
        script.async = true;
        script.defer = true;

        // Define global callback function
        const w = window as unknown as {
            onRecaptchaLoad?: () => void;
            grecaptcha?: {
                render: (el: HTMLElement, options: { sitekey: string; callback: (response: string) => void }) => void;
                reset: () => void;
            };
        };
        
        w.onRecaptchaLoad = () => {
            if (w.grecaptcha && w.grecaptcha.render && recaptchaRef.current) {
                w.grecaptcha.render(recaptchaRef.current, {
                    sitekey: '6LfIWR8rAAAAAP58_cs_prL0XLvoMjN_72liKq2-',
                    callback: (response: string) => {
                        setData('g-recaptcha-response', response);
                    },
                });
            }
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
            delete w.onRecaptchaLoad;
        };
    }, [setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => {
                reset('password');
                const w = window as unknown as { grecaptcha?: { reset: () => void } };
                if (w.grecaptcha) {
                    w.grecaptcha.reset();
                    setData('g-recaptcha-response', '');
                }
            },
            onSuccess: () => {
                toast.success('Login Berhasil!', {
                    description: 'Selamat datang kembali! Anda berhasil masuk ke akun Anda.',
                    duration: 4000,
                });
            },
            onError: () => {
                toast.error('Login Gagal', {
                    description: 'Email atau password salah. Silakan periksa data Anda dan coba lagi.',
                    duration: 4000,
                });
            },
        });
    };

    const handleGoogleLogin = () => {
        window.location.href = '/auth/google';
    };

    return (
        <>
            <Head title="Masuk" />

            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-start">
                        <a href={route('home')} className="flex items-center">
                            <div className="flex items-center justify-center overflow-hidden">
                                {settings.logo ? (
                                    <img
                                        src={`/storage/${settings.logo}`}
                                        alt={settings.site_name || 'Logo'}
                                        className="h-10 w-auto max-w-[160px] object-contain"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                        <GalleryVerticalEnd className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        </a>
                    </div>

                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <form className="flex flex-col gap-6" onSubmit={submit}>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">Masuk ke akun Anda</h1>
                                    <p className="text-sm text-balance text-muted-foreground">
                                        Masukkan email dan kata sandi Anda di bawah ini untuk masuk ke akun Anda
                                    </p>
                                </div>

                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="Email Anda"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Kata Sandi</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                tabIndex={2}
                                                placeholder="Kata Sandi Anda"
                                                autoComplete="current-password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                disabled={processing}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                        
                                        {canResetPassword && (
                                            <div className="text-right">
                                                <TextLink 
                                                    href="/forgot-password"
                                                    className="text-sm text-muted-foreground hover:text-primary"
                                                >
                                                    Lupa kata sandi?
                                                </TextLink>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onClick={() => setData('remember', !data.remember)}
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember">Ingat saya</Label>
                                    </div>

                                    <div className="grid gap-2">
                                        <div ref={recaptchaRef} />
                                        <InputError message={errors['g-recaptcha-response']} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                        style={{
                                            background: 'linear-gradient(135deg, #2347FA 0%, #3b56fc 100%)',
                                            border: 'none',
                                            color: 'white',
                                            fontWeight: '600',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 15px rgba(35, 71, 250, 0.3)',
                                            transform: processing ? 'scale(0.98)' : 'scale(1)',
                                            opacity: processing ? 0.8 : 1,
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!processing) {
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(35, 71, 250, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!processing) {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(35, 71, 250, 0.3)';
                                            }
                                        }}
                                    >
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Masuk
                                    </Button>

                                    {/* Divider */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-gray-200" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="bg-white px-4 text-gray-500">atau</span>
                                        </div>
                                    </div>

                                    {/* Google Login Button */}
                                    <Button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={processing}
                                        className="w-full border-2 border-gray-200 bg-white font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md disabled:opacity-50"
                                        style={{
                                            background: 'white',
                                            border: '2px solid #e5e7eb',
                                            color: '#374151',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!processing) {
                                                e.currentTarget.style.borderColor = '#d1d5db';
                                                e.currentTarget.style.boxShadow =
                                                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!processing) {
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                            }
                                        }}
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                                <path
                                                    fill="#4285F4"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                />
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                />
                                            </svg>
                                            <span>Masuk dengan Google</span>
                                        </div>
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-muted-foreground space-y-2">
                                    <p>Belum punya akun?</p>
                                    <div className="space-y-1">
                                        <TextLink href="/register" tabIndex={5}>
                                            Daftar sebagai Pencari Kerja
                                        </TextLink>
                                        <span className="mx-2">•</span>
                                        <TextLink href="/register-company" tabIndex={6}>
                                            Daftar sebagai Perusahaan
                                        </TextLink>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="relative hidden bg-muted lg:block">
                    <img
                        src={`/storage/${settings.thumbnail || 'default-thumbnail.jpg'}`}
                        alt="Ilustrasi masuk"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>
        </>
    );
}
