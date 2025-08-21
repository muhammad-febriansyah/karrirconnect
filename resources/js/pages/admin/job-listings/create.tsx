import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Coins, AlertTriangle, CreditCard } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
  companies: Company[];
  userCompany?: {
    id: number;
    name: string;
    job_posting_points: number;
    active_job_posts: number;
    max_active_jobs: number;
  };
}

export default function CreateJobListing({ categories, companies, userCompany }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: [],
    employment_type: 'full_time',
    work_arrangement: 'onsite',
    experience_level: 'mid',
    salary_min: '',
    salary_max: '',
    location: '',
    company_id: companies[0]?.id || '',
    job_category_id: '',
    positions_available: '1',
    skills: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post(route('admin.job-listings.store'), form, {
      onSuccess: () => {
        // Redirect handled by controller
      },
      onError: () => {
        setIsSubmitting(false);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AppLayout>
      <Head title="Buat Lowongan Baru" />
      
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => router.get(route('admin.job-listings.index'))}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Lowongan
          </Button>
          <h1 className="text-2xl font-bold">Buat Lowongan Baru</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Lowongan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Judul Lowongan</label>
                    <Input
                      value={form.title}
                      onChange={(e) => updateForm('title', e.target.value)}
                      placeholder="contoh: Senior Frontend Developer"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companies.length > 1 && (
                      <div>
                        <label className="text-sm font-medium">Perusahaan</label>
                        <Select value={form.company_id.toString()} onValueChange={(value) => updateForm('company_id', parseInt(value))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id.toString()}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium">Kategori Pekerjaan</label>
                      <Select value={form.job_category_id.toString()} onValueChange={(value) => updateForm('job_category_id', parseInt(value))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Tipe Pekerjaan</label>
                      <Select value={form.employment_type} onValueChange={(value) => updateForm('employment_type', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">Full Time</SelectItem>
                          <SelectItem value="part_time">Part Time</SelectItem>
                          <SelectItem value="contract">Kontrak</SelectItem>
                          <SelectItem value="internship">Magang</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Pengaturan Kerja</label>
                      <Select value={form.work_arrangement} onValueChange={(value) => updateForm('work_arrangement', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onsite">Onsite</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Level Pengalaman</label>
                      <Select value={form.experience_level} onValueChange={(value) => updateForm('experience_level', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Lokasi</label>
                    <Input
                      value={form.location}
                      onChange={(e) => updateForm('location', e.target.value)}
                      placeholder="contoh: Jakarta, Indonesia"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Gaji Minimum</label>
                      <CurrencyInput
                        value={form.salary_min}
                        onChange={(value) => updateForm('salary_min', value)}
                        placeholder="8.000.000"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Gaji Maksimum</label>
                      <CurrencyInput
                        value={form.salary_max}
                        onChange={(value) => updateForm('salary_max', value)}
                        placeholder="15.000.000"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Kuota Pelamar</label>
                      <Input
                        type="number"
                        value={form.positions_available}
                        onChange={(e) => updateForm('positions_available', e.target.value)}
                        placeholder="1"
                        min="1"
                        max="50"
                        required
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Maksimal pelamar yang bisa apply</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Deskripsi Pekerjaan</label>
                    <RichTextEditor
                      content={form.description}
                      onChange={(content) => updateForm('description', content)}
                      placeholder="Jelaskan detail pekerjaan, tanggung jawab, dan ekspektasi...

Contoh:
• Mengembangkan aplikasi web menggunakan React dan Node.js
• Berkolaborasi dengan tim design untuk implementasi UI/UX
• Melakukan code review dan testing
• Berpartisipasi dalam sprint planning dan daily standup"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Kualifikasi & Persyaratan</label>
                    <RichTextEditor
                      content={form.requirements}
                      onChange={(content) => updateForm('requirements', content)}
                      placeholder="Tuliskan kualifikasi, skill, dan persyaratan yang dibutuhkan...

Contoh:
• Minimal 2 tahun pengalaman sebagai Frontend Developer
• Menguasai React.js, TypeScript, dan Tailwind CSS
• Familiar dengan Git dan tools development modern
• Kemampuan komunikasi yang baik
• Fresh graduate dipersilakan apply"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Point Balance Card - Only for Company Admin */}
              {userCompany && (
                <Card className={userCompany.job_posting_points <= 2 ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      Poin Tersedia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${userCompany.job_posting_points <= 2 ? 'text-orange-600' : 'text-blue-600'}`}>
                        {userCompany.job_posting_points}
                      </div>
                      <p className="text-sm text-gray-600">poin posting lowongan</p>
                    </div>
                    
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Lowongan Aktif:</span>
                        <span>{userCompany.active_job_posts}/{userCompany.max_active_jobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Biaya Posting:</span>
                        <span className="font-semibold">1 poin</span>
                      </div>
                    </div>

                    {userCompany.job_posting_points <= 2 && (
                      <div className="bg-orange-100 border border-orange-200 rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="font-semibold text-orange-800 text-sm">Poin Hampir Habis!</span>
                        </div>
                        <p className="text-xs text-orange-700 mb-3">
                          Beli paket poin sekarang untuk melanjutkan posting lowongan.
                        </p>
                        <Link href="/company/points/packages">
                          <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Beli Poin
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Lowongan'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.get(route('admin.job-listings.index'))}
                  >
                    Batal
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips & Format</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p><strong>Gunakan editor untuk:</strong></p>
                  <p>• <strong>Bold/Italic</strong> untuk penekanan</p>
                  <p>• <strong>Bullet points</strong> untuk daftar</p>
                  <p>• <strong>Numbering</strong> untuk urutan</p>
                  <p>• <strong>Headings</strong> untuk section</p>
                  <div className="mt-3 pt-3 border-t">
                    <p><strong>Tips Content:</strong></p>
                    <p>• Gunakan judul yang menarik</p>
                    <p>• Jelaskan benefit dengan jelas</p>
                    <p>• Cantumkan requirement spesifik</p>
                    <p>• Lowongan disimpan sebagai draft</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}