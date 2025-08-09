import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { GalleryVerticalEnd, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
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
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
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
                                    <img src={`/storage/${settings.logo}`} alt={settings.site_name || 'Logo'} className="h-32 w-auto object-cover" />
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
                                    <div className="grid gap-3">
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

                                    <div className="grid gap-3">
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
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={2}
                                            placeholder="Kata Sandi Anda"
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
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

                                    <Button type="submit" className="w-full" tabIndex={4} disabled={processing}>
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

                                {/* <div className="text-center text-sm">
                                    Belum punya akun?{' '}
                                    <TextLink href={route('register')} tabIndex={6} className="underline underline-offset-4">
                                        Daftar
                                    </TextLink>
                                </div> */}
                            </form>
                        </div>
                    </div>
                </div>

                <div className="relative hidden bg-muted lg:block">
                    <img
                        src={`/storage/${settings.thumbnail || 'default-thumbnail.jpg'}`}
                        alt="Ilustrasi masuk"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </>
    );
}
