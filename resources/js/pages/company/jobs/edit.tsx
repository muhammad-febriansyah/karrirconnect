import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  X,
  AlertCircle,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { type SharedData } from '@/types';
import DatePicker from '@/components/ui/date-picker';

interface JobCategory {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
}

interface JobListing {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  employment_type: string;
  work_arrangement: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  salary_negotiable: boolean;
  location: string;
  application_deadline?: string;
  positions_available: number;
  job_category_id: number;
  status: string;
  skills: Skill[];
}

interface Props {
  job: JobListing;
  categories: JobCategory[];
  skills: Skill[];
}

export default function EditJob({ job, categories, skills }: Props) {
  const { flash } = usePage<SharedData & { flash?: { error?: string; success?: string } }>().props;
  const [selectedSkills, setSelectedSkills] = useState<number[]>(job.skills.map(skill => skill.id));
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, setData, put, processing, errors } = useForm({
    title: job.title,
    description: job.description,
    requirements: job.requirements || '',
    benefits: job.benefits || '',
    employment_type: job.employment_type,
    work_arrangement: job.work_arrangement,
    experience_level: job.experience_level,
    salary_min: job.salary_min?.toString() || '',
    salary_max: job.salary_max?.toString() || '',
    salary_negotiable: job.salary_negotiable,
    location: job.location,
    application_deadline: job.application_deadline || '',
    positions_available: job.positions_available.toString(),
    job_category_id: job.job_category_id.toString(),
    skills: selectedSkills,
    status: job.status
  });

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.includes(skill.id)
  );

  const addSkill = (skillId: number) => {
    const newSelectedSkills = [...selectedSkills, skillId];
    setSelectedSkills(newSelectedSkills);
    setData('skills', newSelectedSkills);
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillId: number) => {
    const newSelectedSkills = selectedSkills.filter(id => id !== skillId);
    setSelectedSkills(newSelectedSkills);
    setData('skills', newSelectedSkills);
  };

  const getSelectedSkillsData = () => {
    return skills.filter(skill => selectedSkills.includes(skill.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/company/jobs/${job.id}`, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Lowongan berhasil diperbarui!');
      },
      onError: () => {
        toast.error('Terjadi kesalahan saat memperbarui lowongan.');
      }
    });
  };

  const handlePreview = () => {
    router.get(`/company/jobs/${job.id}`);
  };

  const formatCurrency = (value: string): string => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleSalaryChange = (field: 'salary_min' | 'salary_max', value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    setData(field, cleanValue);
  };

  // Effect to sync selectedSkills with form data
  useEffect(() => {
    setData('skills', selectedSkills);
  }, [selectedSkills]);

  useEffect(() => {
    if (!skillContainerRef.current) return;
    const onDocClick = (e: MouseEvent) => {
      if (!skillContainerRef.current) return;
      if (!skillContainerRef.current.contains(e.target as Node)) {
        setShowSkillDropdown(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <AppLayout>
      <Head title={`Edit Lowongan - ${job.title}`} />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.get('/company/jobs')}
              className="flex items-center gap-2 w-max"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Edit Lowongan</h1>
              <p className="text-gray-600 text-sm sm:text-base">Perbarui informasi lowongan pekerjaan</p>
            </div>
          </div>
          <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Lihat Hasil
          </Button>
        </div>

        {/* Flash Messages */}
        {flash?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {flash.error}
          </div>
        )}

        {flash?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {flash.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Informasi Dasar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Judul Lowongan</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Contoh: Frontend Developer"
                  className={`mt-2 h-11 border ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.title && <p className="text-red-600 text-xs mt-2">{errors.title}</p>}
              </div>

              {/* Job Category */}
              <div>
                <Label htmlFor="job_category_id" className="text-sm font-medium text-gray-700">Kategori Pekerjaan</Label>
                <Select value={data.job_category_id} onValueChange={(value) => setData('job_category_id', value)}>
                  <SelectTrigger className={`mt-2 h-11 border ${errors.job_category_id ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.job_category_id}>
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
                {errors.job_category_id && <p className="text-red-600 text-xs mt-2">{errors.job_category_id}</p>}
              </div>

              {/* Employment Type & Work Arrangement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="employment_type" className="text-sm font-medium text-gray-700">Tipe Pekerjaan</Label>
                  <Select value={data.employment_type} onValueChange={(value) => setData('employment_type', value)}>
                    <SelectTrigger className={`mt-2 h-11 border ${errors.employment_type ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.employment_type}>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employment_type && <p className="text-red-600 text-xs mt-2">{errors.employment_type}</p>}
                </div>

                <div>
                  <Label htmlFor="work_arrangement" className="text-sm font-medium text-gray-700">Pengaturan Kerja</Label>
                  <Select value={data.work_arrangement} onValueChange={(value) => setData('work_arrangement', value)}>
                    <SelectTrigger className={`mt-2 h-11 border ${errors.work_arrangement ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.work_arrangement}>
                      <SelectValue placeholder="Pilih pengaturan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.work_arrangement && <p className="text-red-600 text-xs mt-2">{errors.work_arrangement}</p>}
                </div>
              </div>

              {/* Experience Level & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="experience_level" className="text-sm font-medium text-gray-700">Level Pengalaman</Label>
                  <Select value={data.experience_level} onValueChange={(value) => setData('experience_level', value)}>
                    <SelectTrigger className={`mt-2 h-11 border ${errors.experience_level ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.experience_level}>
                      <SelectValue placeholder="Pilih level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry">Entry</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experience_level && <p className="text-red-600 text-xs mt-2">{errors.experience_level}</p>}
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">Lokasi</Label>
                  <Input
                    id="location"
                    value={data.location}
                    onChange={(e) => setData('location', e.target.value)}
                    placeholder="Contoh: Jakarta, ID"
                    className={`mt-2 h-11 border ${errors.location ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.location && <p className="text-red-600 text-xs mt-2">{errors.location}</p>}
                </div>
              </div>

              {/* Positions Available */}
              <div>
                <Label htmlFor="positions_available" className="text-sm font-medium text-gray-700">Jumlah Posisi</Label>
                <Input
                  id="positions_available"
                  type="number"
                  min="1"
                  value={data.positions_available}
                  onChange={(e) => setData('positions_available', e.target.value)}
                  className={`mt-2 h-11 border ${errors.positions_available ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.positions_available && <p className="text-red-600 text-xs mt-2">{errors.positions_available}</p>}
              </div>

              {/* Application Deadline */}
              <div>
                <Label htmlFor="application_deadline" className="text-sm font-medium text-gray-700">Batas Waktu Lamaran (Opsional)</Label>
                <DatePicker
                  id="application_deadline"
                  value={data.application_deadline}
                  onChange={(val) => setData('application_deadline', val)}
                  minDate={new Date()}
                  placeholder="Pilih tanggal"
                  className="mt-2"
                  error={errors.application_deadline as string}
                />
                {errors.application_deadline && <p className="text-red-600 text-xs mt-2">{errors.application_deadline}</p>}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status Lowongan</Label>
                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                  <SelectTrigger className={`mt-2 h-11 border ${errors.status ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.status}>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-600 text-xs mt-2">{errors.status}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-purple-600" />
                Deskripsi Pekerjaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Deskripsi</Label>
                <RichTextEditor
                  content={data.description}
                  onChange={(val) => setData('description', val)}
                  placeholder="Jelaskan tanggung jawab dan tugas utama untuk posisi ini..."
                  className="mt-2"
                />
                {errors.description && <p className="text-red-600 text-xs mt-2">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-purple-600" />
                Persyaratan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="requirements" className="text-sm font-medium text-gray-700">Persyaratan (Opsional)</Label>
                <RichTextEditor
                  content={data.requirements}
                  onChange={(val) => setData('requirements', val)}
                  placeholder="Jelaskan kualifikasi dan persyaratan yang dibutuhkan..."
                  className="mt-2"
                />
                {errors.requirements && <p className="text-red-600 text-xs mt-2">{errors.requirements}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Benefit & Fasilitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="benefits" className="text-sm font-medium text-gray-700">Benefit (Opsional)</Label>
                <RichTextEditor
                  content={data.benefits}
                  onChange={(val) => setData('benefits', val)}
                  placeholder="Jelaskan benefit dan fasilitas yang ditawarkan..."
                  className="mt-2"
                />
                {errors.benefits && <p className="text-red-600 text-xs mt-2">{errors.benefits}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Informasi Gaji
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={data.salary_negotiable}
                  onCheckedChange={(checked) => setData('salary_negotiable', checked)}
                />
                <Label className="text-sm font-medium">Gaji dapat dinegosiasi</Label>
              </div>

              {!data.salary_negotiable && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="salary_min" className="text-sm font-medium text-gray-700">Gaji Minimum (IDR)</Label>
                    <Input
                      id="salary_min"
                      inputMode="numeric"
                      value={data.salary_min ? formatCurrency(data.salary_min) : ''}
                      onChange={(e) => handleSalaryChange('salary_min', e.target.value)}
                      placeholder="0"
                      className={`mt-2 h-11 border ${errors.salary_min ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.salary_min && <p className="text-red-600 text-xs mt-2">{errors.salary_min}</p>}
                  </div>

                  <div>
                    <Label htmlFor="salary_max" className="text-sm font-medium text-gray-700">Gaji Maksimum (IDR)</Label>
                    <Input
                      id="salary_max"
                      inputMode="numeric"
                      value={data.salary_max ? formatCurrency(data.salary_max) : ''}
                      onChange={(e) => handleSalaryChange('salary_max', e.target.value)}
                      placeholder="0"
                      className={`mt-2 h-11 border ${errors.salary_max ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.salary_max && <p className="text-red-600 text-xs mt-2">{errors.salary_max}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-orange-600" />
                Keahlian yang Dibutuhkan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Skills */}
              {getSelectedSkillsData().length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Keahlian Terpilih</Label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getSelectedSkillsData().map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 text-gray-800 border border-gray-200">
                        {skill.name}
                        <button type="button" aria-label={`Hapus ${skill.name}`} onClick={() => removeSkill(skill.id)}>
                          <X className="h-4 w-4 cursor-pointer hover:text-red-600 transition-colors" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Search */}
              <div className="relative skill-dropdown-container" ref={skillContainerRef}>
                <Label htmlFor="skill_search" className="text-sm font-medium text-gray-700">Tambah Keahlian</Label>
                <Input
                  id="skill_search"
                  value={skillSearch}
                  onChange={(e) => {
                    setSkillSearch(e.target.value);
                    setShowSkillDropdown(true);
                  }}
                  onFocus={() => setShowSkillDropdown(true)}
                  placeholder="Cari keahlian..."
                  className="mt-2 h-11 border border-gray-200"
                />

                {showSkillDropdown && filteredSkills.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md max-h-56 overflow-y-auto">
                    {filteredSkills.slice(0, 10).map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => addSkill(skill.id)}
                      >
                        <span className="text-gray-700 text-sm">{skill.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.skills && <p className="text-red-600 text-xs mt-2">{errors.skills}</p>}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.get('/company/jobs')}
              disabled={processing}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
