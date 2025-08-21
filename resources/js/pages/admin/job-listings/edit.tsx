import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
}

interface JobListing {
  id: number;
  title: string;
  description: string;
  requirements: string;
  benefits?: string[];
  employment_type: string;
  work_arrangement: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  status: string;
  positions_available: number;
  company_id: number;
  job_category_id: number;
  skills?: Array<{
    id: number;
    name: string;
  }>;
}

interface Props {
  jobListing: JobListing;
  categories: Category[];
  companies: Company[];
}

export default function EditJobListing({ jobListing, categories, companies }: Props) {
  const [form, setForm] = useState({
    title: jobListing.title,
    description: jobListing.description,
    requirements: jobListing.requirements,
    benefits: jobListing.benefits || [],
    employment_type: jobListing.employment_type,
    work_arrangement: jobListing.work_arrangement,
    experience_level: jobListing.experience_level,
    salary_min: jobListing.salary_min?.toString() || '',
    salary_max: jobListing.salary_max?.toString() || '',
    location: jobListing.location,
    positions_available: jobListing.positions_available.toString(),
    status: jobListing.status,
    company_id: jobListing.company_id,
    job_category_id: jobListing.job_category_id,
    skills: jobListing.skills?.map(skill => skill.id) || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.patch(route('admin.job-listings.update', jobListing.id), form, {
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
      <Head title={`Edit Lowongan - ${jobListing.title}`} />
      
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
          <h1 className="text-2xl font-bold">Edit Lowongan - {jobListing.title}</h1>
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
                    <label className="text-sm font-medium">Status Lowongan</label>
                    <Select value={form.status} onValueChange={(value) => updateForm('status', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Dipublikasi</SelectItem>
                        <SelectItem value="closed">Ditutup</SelectItem>
                        <SelectItem value="archived">Diarsip</SelectItem>
                      </SelectContent>
                    </Select>
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
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.get(route('admin.job-listings.show', jobListing.id))}
                  >
                    Lihat Detail
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
                  <CardTitle>Status Saat Ini</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><strong>Status:</strong> {form.status}</p>
                  <p><strong>ID:</strong> {jobListing.id}</p>
                  <p className="text-gray-600">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips Edit</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p><strong>Status Lowongan:</strong></p>
                  <p>• "Dipublikasi" untuk go live</p>
                  <p>• "Ditutup" stop aplikasi baru</p>
                  <p>• "Draft" untuk preview</p>
                  <div className="mt-3 pt-3 border-t">
                    <p><strong>Sebelum Publish:</strong></p>
                    <p>• Review semua informasi</p>
                    <p>• Pastikan format sudah benar</p>
                    <p>• Cek gaji dan benefit akurat</p>
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