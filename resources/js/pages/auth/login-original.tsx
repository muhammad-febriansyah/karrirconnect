import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { GalleryVerticalEnd, LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

export default function Login({ status, canResetPassword }: LoginProps) {
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
        (window as any).onRecaptchaLoad = () => {
            if ((window as any).grecaptcha && (window as any).grecaptcha.render && recaptchaRef.current) {
                (window as any).grecaptcha.render(recaptchaRef.current, {
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
            delete (window as any).onRecaptchaLoad;
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => {
                reset('password');
                if ((window as any).grecaptcha) {
                    (window as any).grecaptcha.reset();
                    setData('g-recaptcha-response', '');
                }
            },
            onSuccess: () => {
                toast.success('Berhasil Masuk!', {
                    description: `Anda berhasil masuk ke akun ${settings.site_name || 'KarirConnect'}.`,
                    duration: 3000,
                });
            },
            onError: () => {
                toast.error('Gagal Masuk', {
                    description: 'Email atau kata sandi tidak valid. Silakan coba lagi.',
                    duration: 4000,
                });
            },
        });
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
                                    <img src={`/storage/${settings.logo}`} alt={settings.site_name || 'Logo'} className="h-10 w-auto max-w-[160px] object-contain" />
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

                                {status && <div className="text-center text-sm font-medium text-green-600">{status}</div>}

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
                                            placeholder="Email Anda"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Kata Sandi</Label>
                                            {/* {canResetPassword && (
                                                <TextLink
                                                    href={route('password.request')}
                                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                                    tabIndex={5}
                                                >
                                                    Lupa kata sandi?
                                                </TextLink>
                                            )} */}
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                tabIndex={2}
                                                placeholder="Kata Sandi Anda"
                                                autoComplete="current-password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
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
                                            opacity: processing ? 0.8 : 1
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

                                    {/* Optional: Add social login separator */}
                                    {/* 
                                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                                            Or continue with
                                        </span>
                                    </div>
                                    */}
                                </div>

                                <div className="text-center text-sm space-y-3">
                                    <p className="text-muted-foreground">Belum punya akun?</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Link href="/register">
                                            <Button 
                                                variant="outline" 
                                                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                                            >
                                                👤 Daftar sebagai Pencari Kerja
                                            </Button>
                                        </Link>
                                        <Link href="/register-company">
                                            <Button 
                                                variant="outline"
                                                className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                                            >
                                                🏢 Daftar sebagai Perusahaan
                                            </Button>
                                        </Link>
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
