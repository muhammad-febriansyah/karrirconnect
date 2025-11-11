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
  ArrowRight,
  Save,
  Eye,
  Plus,
  X,
  Coins,
  AlertCircle,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Check,
  FileText,
  Award,
  Zap
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

interface Company {
  id: number;
  name: string;
  job_posting_points: number;
}

interface Props {
  categories: JobCategory[];
  skills: Skill[];
  company: Company;
}

const STEPS = [
  {
    id: 1,
    title: 'Informasi Dasar',
    description: 'Judul dan kategori pekerjaan',
    icon: Briefcase,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Deskripsi',
    description: 'Detail pekerjaan lengkap',
    icon: FileText,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    title: 'Kompensasi',
    description: 'Gaji dan benefit',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    title: 'Keahlian',
    description: 'Skills yang dibutuhkan',
    icon: Award,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 5,
    title: 'Review',
    description: 'Tinjau dan terbitkan',
    icon: Zap,
    color: 'from-indigo-500 to-purple-500'
  }
];

export default function CreateJobSteps({ categories, skills, company }: Props) {
  const { flash } = usePage<SharedData & { flash?: { error?: string; success?: string } }>().props;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    employment_type: '',
    work_arrangement: '',
    experience_level: '',
    salary_min: '',
    salary_max: '',
    salary_negotiable: false,
    location: '',
    application_deadline: '',
    positions_available: 1,
    job_category_id: '',
    skills: [] as number[],
    status: 'draft'
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

  const formatCurrency = (value: string): string => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleSalaryChange = (field: 'salary_min' | 'salary_max', value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    setData(field, cleanValue);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.title && data.job_category_id && data.employment_type &&
                 data.work_arrangement && data.experience_level && data.location);
      case 2:
        return !!data.description;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } else {
      toast.error('Mohon lengkapi semua field yang diperlukan');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (status: 'draft' | 'published') => {
    setData('status', status);
    post('/company/jobs', {
      onSuccess: () => {
        toast.success(status === 'published' ? 'Lowongan berhasil dipublikasikan!' : 'Draft berhasil disimpan!');
        router.get('/company/jobs');
      },
      onError: () => {
        toast.error('Terjadi kesalahan saat menyimpan lowongan.');
      }
    });
  };

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

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <div key={step.id} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border ${
                  isCompleted
                    ? 'bg-blue-600 text-white border-blue-600'
                    : isActive
                    ? 'bg-white text-blue-700 border-blue-300'
                    : 'bg-white text-gray-500 border-gray-200'
                }`}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Langkah ${step.id}`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <div className="hidden sm:block">
                <div className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card className="border shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Informasi Dasar Lowongan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Judul Lowongan *</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="Contoh: Frontend Developer"
                      aria-invalid={!!errors.title}
                      className={`mt-2 h-11 border ${errors.title ? 'border-red-400 focus-visible:ring-red-500' : 'border-gray-200 focus-visible:ring-blue-500'}`}
                    />
                    {errors.title && <p className="text-red-600 text-xs mt-2">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="job_category_id" className="text-sm font-medium text-gray-700">Kategori Pekerjaan *</Label>
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

                  <div>
                    <Label htmlFor="positions_available" className="text-sm font-medium text-gray-700">Jumlah Posisi *</Label>
                    <Input
                      id="positions_available"
                      type="number"
                      min="1"
                      value={data.positions_available}
                      onChange={(e) => setData('positions_available', parseInt(e.target.value) || 1)}
                      aria-invalid={!!errors.positions_available}
                      className={`mt-2 h-11 border ${errors.positions_available ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.positions_available && <p className="text-red-600 text-xs mt-2">{errors.positions_available}</p>}
                  </div>

                  <div>
                    <Label htmlFor="employment_type" className="text-sm font-medium text-gray-700">Tipe Pekerjaan *</Label>
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
                    <Label htmlFor="work_arrangement" className="text-sm font-medium text-gray-700">Pengaturan Kerja *</Label>
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

                  <div>
                    <Label htmlFor="experience_level" className="text-sm font-medium text-gray-700">Level Pengalaman *</Label>
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
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">Lokasi *</Label>
                    <Input
                      id="location"
                      value={data.location}
                      onChange={(e) => setData('location', e.target.value)}
                      placeholder="Contoh: Jakarta, ID"
                      aria-invalid={!!errors.location}
                      className={`mt-2 h-11 border ${errors.location ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.location && <p className="text-red-600 text-xs mt-2">{errors.location}</p>}
                  </div>

                  <div>
                    <Label htmlFor="application_deadline" className="text-sm font-medium text-gray-700">Batas Waktu Lamaran</Label>
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
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-purple-600" />
                Deskripsi Pekerjaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Deskripsi Pekerjaan *</Label>
                <RichTextEditor
                  content={data.description}
                  onChange={(val) => setData('description', val)}
                  placeholder="Jelaskan tanggung jawab dan tugas utama untuk posisi ini..."
                  className="mt-2"
                />
                {errors.description && <p className="text-red-600 text-xs mt-2">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="requirements" className="text-sm font-medium text-gray-700">Persyaratan & Kualifikasi</Label>
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
        );

      case 3:
        return (
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Kompensasi & Benefit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3 p-3 rounded-md border border-gray-200 bg-white">
                <Switch
                  checked={data.salary_negotiable}
                  onCheckedChange={(checked) => setData('salary_negotiable', checked)}
                  aria-label="Gaji dapat dinegosiasi"
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
                      aria-invalid={!!errors.salary_min}
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
                      aria-invalid={!!errors.salary_max}
                      className={`mt-2 h-11 border ${errors.salary_max ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.salary_max && <p className="text-red-600 text-xs mt-2">{errors.salary_max}</p>}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="benefits" className="text-sm font-medium text-gray-700">Benefit & Fasilitas</Label>
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
        );

      case 4:
        return (
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-orange-600" />
                Keahlian yang Dibutuhkan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {getSelectedSkillsData().length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Keahlian Terpilih</Label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getSelectedSkillsData().map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 text-gray-800 border border-gray-200"
                      >
                        {skill.name}
                        <button type="button" aria-label={`Hapus ${skill.name}`} onClick={() => removeSkill(skill.id)}>
                          <X className="h-4 w-4 cursor-pointer hover:text-red-600 transition-colors" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

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
        );

      case 5:
        return (
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-indigo-600" />
                Review & Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-5 rounded-md border border-gray-200 space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">{data.title || 'Judul belum diisi'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Kategori:</span>
                    <span className="text-gray-800">{categories.find(c => c.id.toString() === data.job_category_id)?.name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Tipe:</span>
                    <span className="text-gray-800">{data.employment_type || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Pengaturan:</span>
                    <span className="text-gray-800">{data.work_arrangement || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Level:</span>
                    <span className="text-gray-800">{data.experience_level || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Lokasi:</span>
                    <span className="text-gray-800">{data.location || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Posisi:</span>
                    <span className="text-gray-800">{data.positions_available || 1}</span>
                  </div>
                </div>
                {getSelectedSkillsData().length > 0 && (
                  <div>
                    <span className="font-medium text-gray-600">Keahlian:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getSelectedSkillsData().map((skill) => (
                        <Badge key={skill.id} variant="outline" className="text-xs bg-gray-50">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-md border border-blue-200 bg-blue-50">
                <div className="flex items-center gap-3 mb-2">
                  <Coins className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-sm text-blue-900">Poin Tersisa: {company.job_posting_points}</span>
                </div>
                <p className="text-xs text-blue-800">
                  Mempublikasikan lowongan akan mengurangi 1 poin dari saldo Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => handleSubmit('draft')}
                  disabled={processing}
                  variant="outline"
                  className="h-11 text-sm font-medium"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan sebagai Draft
                </Button>
                <Button
                  onClick={() => handleSubmit('published')}
                  disabled={processing || company.job_posting_points < 1}
                  className="h-11 text-sm font-medium"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Publikasikan Lowongan
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <Head title="Buat Lowongan Baru" />

      <div className="min-h-screen bg-gray-50">
        <div className="space-y-6 p-6">
          {/* Header */}
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
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Buat Lowongan Baru</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Langkah {currentStep} dari {STEPS.length} - {STEPS[currentStep - 1]?.title}
              </p>
            </div>
          </div>

          {/* Flash Messages */}
          {flash?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{flash.error}</span>
            </div>
          )}

          {/* Step Indicator */}
          <StepIndicator />

          {/* Step Content */}
          <div className="transition-all duration-300 ease-out">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between pt-4 pb-20 sm:pb-0">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 h-11"
              >
                <ArrowLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <Button onClick={nextStep} className="flex items-center gap-2 h-11">
                Selanjutnya
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Sticky mobile nav */}
          {currentStep < 5 && (
            <div className="fixed inset-x-0 bottom-0 sm:hidden bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t border-gray-200 p-3 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="h-10"
              >
                Sebelumnya
              </Button>
              <Button onClick={nextStep} className="h-10">
                Selanjutnya
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
