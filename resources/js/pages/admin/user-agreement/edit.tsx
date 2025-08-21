import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface UserAgreement {
    id: number;
    body: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    userAgreement: UserAgreement;
}

interface FormData {
    body: string;
}

export default function EditUserAgreement({ userAgreement }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        body: userAgreement.body || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/user-agreement', {
            onSuccess: () => {
                toast.success('Perjanjian Pengguna Berhasil Diperbarui!', {
                    description: 'Perjanjian pengguna telah berhasil diperbarui.',
                    duration: 4000,
                });
            },
            onError: () => {
                toast.error('Gagal Memperbarui Data', {
                    description: 'Terjadi kesalahan saat memperbarui perjanjian pengguna.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Perjanjian Pengguna" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Edit Perjanjian Pengguna
                        </h1>
                        <p className="text-gray-600">Kelola perjanjian pengguna aplikasi</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Konten Perjanjian Pengguna</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="body">Isi Perjanjian Pengguna</Label>
                                <RichTextEditor
                                    content={data.body}
                                    onChange={(content) => setData('body', content)}
                                    placeholder="Masukkan isi perjanjian pengguna..."
                                    className="min-h-[500px]"
                                />
                                <InputError message={errors.body} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}