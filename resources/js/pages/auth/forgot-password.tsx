import { Head, useForm, usePage } from '@inertiajs/react';
import { GalleryVerticalEnd, LoaderCircle, ArrowLeft, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';

export default function ForgotPassword({ status }: { status?: string }) {
    const { settings } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            onSuccess: () => {
                toast.success('Tautan Reset Berhasil Dikirim!', {
                    description: 'Silakan periksa WhatsApp dan email Anda untuk tautan reset kata sandi.',
                    duration: 5000,
                });
            },
            onError: () => {
                toast.error('Gagal Mengirim Tautan Reset', {
                    description: 'Terjadi kesalahan saat mengirim tautan reset. Silakan coba lagi.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <>
            <Head title="Lupa Kata Sandi" />

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
                                    <h1 className="text-2xl font-bold">Reset Kata Sandi</h1>
                                    <p className="text-sm text-balance text-muted-foreground">
                                        Masukkan email Anda dan kami akan mengirim tautan reset kata sandi melalui WhatsApp dan email
                                    </p>
                                </div>

                                {status && (
                                    <div className="rounded-md bg-green-50 p-4 border border-green-200">
                                        <div className="text-center text-sm font-medium text-green-600">{status}</div>
                                    </div>
                                )}

                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                                                placeholder="Masukkan email Anda"
                                                className="pl-10"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        tabIndex={2}
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
                                        Kirim Tautan Reset
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-muted-foreground">
                                    <TextLink href="/login" tabIndex={3} className="inline-flex items-center gap-1">
                                        <ArrowLeft className="h-3 w-3" />
                                        Kembali ke halaman masuk
                                    </TextLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="relative hidden bg-muted lg:block">
                    <img
                        src={settings.thumbnail ? `/storage/${settings.thumbnail}` : "/placeholder.svg?height=1080&width=1920"}
                        alt="Background"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </>
    );
}
