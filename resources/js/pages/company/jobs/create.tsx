import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
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
  Star,
  CheckCircle,
  CreditCard,
  ShoppingCart
} from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';

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

interface PointPackage {
  id: number;
  name: string;
  description: string;
  points: number;
  price: number;
  bonus_points: number;
  is_featured: boolean;
  features: string[];
  total_points: number;
  formatted_price: string;
}

interface RecentTransaction {
  id: number;
  type: string;
  points: number;
  description: string;
  status: string;
  created_at: string;
  package_name?: string;
}

interface Props {
  categories: JobCategory[];
  skills: Skill[];
  company: Company;
  pointPackages: PointPackage[];
  recentTransactions: RecentTransaction[];
  jobPostingCost: number;
}

export default function CreateJob({ categories, skills, company, pointPackages, recentTransactions, jobPostingCost }: Props) {
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

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

  const handleSubmit = (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();

    post(route('company.jobs.store'), {
      data: {
        ...data,
        skills: selectedSkills,
        status
      }
    });
  };

  const addSkill = (skillId: number) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillId: number) => {
    setSelectedSkills(selectedSkills.filter(id => id !== skillId));
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.includes(skill.id)
  );

  const getSelectedSkillNames = () => {
    return skills.filter(skill => selectedSkills.includes(skill.id));
  };

  return (
    <AppLayout>
      <Head title="Posting Lowongan Baru" />
      
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.get('/company/jobs')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Posting Lowongan Baru
              </h1>
              <p className="text-gray-600">Buat lowongan pekerjaan untuk perusahaan Anda</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border">
            <Coins className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Poin Tersisa: <NumberTicker value={company.job_posting_points} className="font-bold" />
            </span>
          </div>
        </div>

        {/* Enhanced Point Packages Display */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Paket Poin Tersedia
            </CardTitle>
            {company.job_posting_points < jobPostingCost && (
              <div className="space-y-2">
                <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Poin tidak mencukupi untuk publikasi. Lowongan akan disimpan sebagai draft.
                </p>
                <p className="text-xs text-gray-600">
                  Biaya posting: {jobPostingCost} poin | Poin Anda: {company.job_posting_points}
                </p>
              </div>
            )}
            {company.job_posting_points >= jobPostingCost && (
              <p className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Anda dapat memposting lowongan ini. Biaya: {jobPostingCost} poin.
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Balance Info */}
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Saldo Poin Anda</span>
                <span className="text-lg font-bold text-blue-600">
                  <NumberTicker value={company.job_posting_points} className="text-lg font-bold text-blue-600" />
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Dapat digunakan untuk {Math.floor(company.job_posting_points / jobPostingCost)} lowongan
              </div>
            </div>

            {/* Package Options */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-gray-800">Beli Paket Poin:</h5>
              {pointPackages.slice(0, 3).map((pkg) => (
                <div key={pkg.id} className="bg-white p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-gray-900">{pkg.name}</h4>
                      {pkg.is_featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <span className="text-lg font-bold text-blue-600">{pkg.formatted_price}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Coins className="h-3 w-3 text-blue-500" />
                      <span className="text-gray-600">
                        <NumberTicker value={pkg.points} className="font-medium" /> poin dasar
                      </span>
                    </div>
                    {pkg.bonus_points > 0 && (
                      <div className="flex items-center gap-1">
                        <Plus className="h-3 w-3 text-green-500" />
                        <span className="text-green-600 font-medium">
                          {pkg.bonus_points} bonus
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-purple-500" />
                      <span className="text-gray-600">
                        {pkg.total_points} lowongan
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-orange-500" />
                      <span className="text-gray-600">
                        Rp {Math.round(pkg.price / pkg.total_points).toLocaleString()}/poin
                      </span>
                    </div>
                  </div>

                  {/* Features Preview */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Fitur:</div>
                      <div className="flex flex-wrap gap-1">
                        {pkg.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {pkg.features.length > 3 && (
                          <span className="text-xs text-blue-600">+{pkg.features.length - 3} lainnya</span>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    size="sm" 
                    variant={pkg.is_featured ? "default" : "outline"}
                    className="w-full text-xs"
                    onClick={() => router.get('/company/points/packages')}
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    Beli Paket Ini
                  </Button>
                </div>
              ))}
            </div>

            {pointPackages.length > 3 && (
              <div className="text-center pt-2">
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => router.get('/company/points/packages')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Lihat Semua Paket ({pointPackages.length})
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Informasi Dasar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Judul Lowongan *</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="contoh: Senior Frontend Developer"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="job_category_id">Kategori Pekerjaan *</Label>
                    <Select value={data.job_category_id} onValueChange={(value) => setData('job_category_id', value)}>
                      <SelectTrigger className={errors.job_category_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih kategori pekerjaan" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.job_category_id && <p className="text-sm text-red-600 mt-1">{errors.job_category_id}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi Pekerjaan *</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Jelaskan detail tentang pekerjaan ini..."
                      rows={5}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="requirements">Persyaratan</Label>
                    <Textarea
                      id="requirements"
                      value={data.requirements}
                      onChange={(e) => setData('requirements', e.target.value)}
                      placeholder="Tuliskan persyaratan untuk posisi ini..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="benefits">Benefit & Fasilitas</Label>
                    <Textarea
                      id="benefits"
                      value={data.benefits}
                      onChange={(e) => setData('benefits', e.target.value)}
                      placeholder="Jelaskan benefit dan fasilitas yang ditawarkan..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Detail Pekerjaan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employment_type">Tipe Pekerjaan *</Label>
                      <Select value={data.employment_type} onValueChange={(value) => setData('employment_type', value)}>
                        <SelectTrigger className={errors.employment_type ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Pilih tipe pekerjaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.employment_type && <p className="text-sm text-red-600 mt-1">{errors.employment_type}</p>}
                    </div>

                    <div>
                      <Label htmlFor="work_arrangement">Sistem Kerja *</Label>
                      <Select value={data.work_arrangement} onValueChange={(value) => setData('work_arrangement', value)}>
                        <SelectTrigger className={errors.work_arrangement ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Pilih sistem kerja" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="On-site">On-site</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.work_arrangement && <p className="text-sm text-red-600 mt-1">{errors.work_arrangement}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience_level">Level Pengalaman *</Label>
                      <Select value={data.experience_level} onValueChange={(value) => setData('experience_level', value)}>
                        <SelectTrigger className={errors.experience_level ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Pilih level pengalaman" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entry">Entry Level</SelectItem>
                          <SelectItem value="Mid">Mid Level</SelectItem>
                          <SelectItem value="Senior">Senior Level</SelectItem>
                          <SelectItem value="Lead">Lead/Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.experience_level && <p className="text-sm text-red-600 mt-1">{errors.experience_level}</p>}
                    </div>

                    <div>
                      <Label htmlFor="positions_available">Jumlah Posisi *</Label>
                      <Input
                        id="positions_available"
                        type="number"
                        min="1"
                        value={data.positions_available}
                        onChange={(e) => setData('positions_available', parseInt(e.target.value) || 1)}
                        className={errors.positions_available ? 'border-red-500' : ''}
                      />
                      {errors.positions_available && <p className="text-sm text-red-600 mt-1">{errors.positions_available}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Lokasi *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        placeholder="contoh: Jakarta Selatan, Indonesia"
                        className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <Label htmlFor="application_deadline">Batas Waktu Melamar</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="application_deadline"
                        type="date"
                        value={data.application_deadline}
                        onChange={(e) => setData('application_deadline', e.target.value)}
                        className="pl-10"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Gaji & Kompensasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="salary_negotiable"
                      checked={data.salary_negotiable}
                      onCheckedChange={(checked) => setData('salary_negotiable', checked)}
                    />
                    <Label htmlFor="salary_negotiable">Gaji dapat dinegosiasi</Label>
                  </div>

                  {!data.salary_negotiable && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="salary_min">Gaji Minimum (IDR)</Label>
                        <Input
                          id="salary_min"
                          type="number"
                          min="0"
                          value={data.salary_min}
                          onChange={(e) => setData('salary_min', e.target.value)}
                          placeholder="contoh: 5000000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="salary_max">Gaji Maximum (IDR)</Label>
                        <Input
                          id="salary_max"
                          type="number"
                          min="0"
                          value={data.salary_max}
                          onChange={(e) => setData('salary_max', e.target.value)}
                          placeholder="contoh: 8000000"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills yang Dibutuhkan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Input
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      onFocus={() => setShowSkillDropdown(true)}
                      placeholder="Cari dan tambahkan skills..."
                    />
                    
                    {showSkillDropdown && filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredSkills.slice(0, 10).map((skill) => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => addSkill(skill.id)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>{skill.name}</span>
                            <Plus className="h-4 w-4 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {getSelectedSkillNames().map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {skill.name}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill.id)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Sidebar */}
            <div className="space-y-4">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Publikasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={(e) => handleSubmit(e, 'draft')}
                      disabled={processing}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Draft
                    </Button>

                    <Button
                      type="button"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={(e) => handleSubmit(e, 'published')}
                      disabled={processing}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {company.job_posting_points >= jobPostingCost ? 'Publikasikan' : 'Simpan sebagai Draft'}
                    </Button>
                  </div>

                  {company.job_posting_points < jobPostingCost && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800 mb-2">
                        💡 Beli paket poin untuk publikasikan lowongan langsung
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => router.get('/company/points/packages')}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Lihat Paket Poin
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Transactions History */}
              {recentTransactions && recentTransactions.length > 0 && (
                <Card className="sticky top-6 mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Riwayat Poin Terkini
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {recentTransactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="bg-gray-50 p-2 rounded border">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${
                            transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.points > 0 ? '+' : ''}{transaction.points} poin
                          </span>
                          <span className="text-xs text-gray-500">{transaction.created_at}</span>
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {transaction.description}
                        </div>
                        {transaction.package_name && (
                          <div className="text-xs text-blue-600 mt-1">
                            {transaction.package_name}
                          </div>
                        )}
                      </div>
                    ))}
                    <Button 
                      size="sm" 
                      variant="link"
                      className="w-full text-xs mt-2 text-blue-600"
                      onClick={() => router.get('/company/points')}
                    >
                      Lihat Semua Riwayat
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Point Packages - Only show if has points */}
              {company.job_posting_points >= jobPostingCost && pointPackages.length > 0 && (
                <Card className="sticky top-6 mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Paket Poin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-gray-600 mb-3">
                      Stok habis? Beli paket poin untuk posting lebih banyak.
                    </p>
                    {pointPackages.slice(0, 2).map((pkg) => (
                      <div key={pkg.id} className="bg-gray-50 p-2 rounded border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{pkg.name}</span>
                          {pkg.is_featured && (
                            <Badge className="bg-blue-500 text-white text-xs px-1 py-0">
                              <Star className="h-2 w-2" />
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span className="font-bold text-blue-600">{pkg.formatted_price}</span>
                        </div>
                      </div>
                    ))}
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full text-xs mt-2"
                      onClick={() => router.get('/company/points/packages')}
                    >
                      <CreditCard className="h-3 w-3 mr-1" />
                      Beli Paket Poin
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}