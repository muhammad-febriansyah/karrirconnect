// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            onSuccess: () => {
                toast.success('Email Reset Kata Sandi Dikirim!', {
                    description: 'Silakan periksa email Anda untuk tautan reset kata sandi.',
                    duration: 5000,
                });
            },
            onError: () => {
                toast.error('Gagal Mengirim Email', {
                    description: 'Terjadi kesalahan saat mengirim email reset. Silakan coba lagi.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AuthLayout title="Lupa kata sandi" description="Masukkan email Anda untuk menerima tautan reset kata sandi">
            <Head title="Lupa kata sandi" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Alamat email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Kirim tautan reset kata sandi
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Atau, kembali ke</span>
                    <TextLink href={route('login')}>masuk</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
