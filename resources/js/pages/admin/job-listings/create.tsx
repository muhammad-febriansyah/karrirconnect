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
import { useToast } from '@/hooks/use-toast';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const steps = [
    { id: 1, title: 'Informasi Dasar', description: 'Judul, kategori, dan tipe pekerjaan' },
    { id: 2, title: 'Detail Pekerjaan', description: 'Deskripsi, requirement, dan benefit' },
    { id: 3, title: 'Lokasi & Gaji', description: 'Lokasi kerja dan rentang gaji' },
    { id: 4, title: 'Preview & Publikasi', description: 'Tinjau dan publikasikan lowongan' }
  ];

  const jobTemplates = {
    description: {
      'Software Developer': `<p><strong>About the Role:</strong></p>
<p>We are looking for a talented Software Developer to join our growing team. You will be responsible for developing and maintaining high-quality software applications.</p>

<p><strong>What You'll Do:</strong></p>
<ul>
<li>Design and develop software applications</li>
<li>Write clean, efficient, and maintainable code</li>
<li>Collaborate with cross-functional teams</li>
<li>Participate in code reviews and testing</li>
</ul>`,
      
      'Marketing Manager': `<p><strong>About the Role:</strong></p>
<p>We are seeking an experienced Marketing Manager to lead our marketing efforts and drive brand awareness and customer acquisition.</p>

<p><strong>What You'll Do:</strong></p>
<ul>
<li>Develop and execute marketing strategies</li>
<li>Manage digital marketing campaigns</li>
<li>Analyze market trends and competitor activities</li>
<li>Lead and mentor the marketing team</li>
</ul>`,
      
      'Sales Representative': `<p><strong>About the Role:</strong></p>
<p>Join our sales team as a Sales Representative and help us grow our customer base while building meaningful client relationships.</p>

<p><strong>What You'll Do:</strong></p>
<ul>
<li>Identify and pursue new sales opportunities</li>
<li>Build and maintain client relationships</li>
<li>Present products and services to potential customers</li>
<li>Meet and exceed sales targets</li>
</ul>`
    },
    requirements: {
      'Software Developer': `<p><strong>Required Skills:</strong></p>
<ul>
<li>Bachelor's degree in Computer Science or related field</li>
<li>3+ years experience in software development</li>
<li>Proficiency in programming languages (Java, Python, JavaScript)</li>
<li>Experience with databases and web technologies</li>
<li>Strong problem-solving skills</li>
</ul>

<p><strong>Nice to Have:</strong></p>
<ul>
<li>Experience with cloud platforms (AWS, GCP)</li>
<li>Knowledge of DevOps practices</li>
<li>Open source contributions</li>
</ul>`,
      
      'Marketing Manager': `<p><strong>Required Skills:</strong></p>
<ul>
<li>Bachelor's degree in Marketing, Business, or related field</li>
<li>5+ years experience in marketing roles</li>
<li>Strong knowledge of digital marketing channels</li>
<li>Experience with marketing automation tools</li>
<li>Excellent communication and leadership skills</li>
</ul>

<p><strong>Nice to Have:</strong></p>
<ul>
<li>MBA or advanced marketing certifications</li>
<li>Experience in our industry vertical</li>
<li>Data analytics experience</li>
</ul>`,
      
      'Sales Representative': `<p><strong>Required Skills:</strong></p>
<ul>
<li>Bachelor's degree preferred</li>
<li>2+ years experience in sales or customer service</li>
<li>Excellent communication and interpersonal skills</li>
<li>Self-motivated with strong work ethic</li>
<li>Ability to work independently and meet deadlines</li>
</ul>

<p><strong>Nice to Have:</strong></p>
<ul>
<li>Experience in B2B sales</li>
<li>CRM software proficiency</li>
<li>Industry-specific knowledge</li>
</ul>`
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateStep(4); // Validate all required fields
    
    if (errors.length > 0) {
      toast({
        title: 'Data belum lengkap',
        description: errors.join(', '),
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);

    router.post(route('admin.job-listings.store'), form, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    const errors = [];
    
    switch (step) {
      case 1:
        if (!form.title.trim()) errors.push('Judul lowongan harus diisi');
        if (!form.job_category_id) errors.push('Kategori pekerjaan harus dipilih');
        break;
      case 2:
        if (!form.description.trim()) errors.push('Deskripsi pekerjaan harus diisi');
        if (!form.requirements.trim()) errors.push('Persyaratan harus diisi');
        break;
      case 3:
        if (!form.location.trim()) errors.push('Lokasi harus diisi');
        break;
      case 4:
        // Final validation - check all required fields
        if (!form.title.trim()) errors.push('Judul lowongan harus diisi');
        if (!form.job_category_id) errors.push('Kategori pekerjaan harus dipilih');
        if (!form.description.trim()) errors.push('Deskripsi pekerjaan harus diisi');
        if (!form.requirements.trim()) errors.push('Persyaratan harus diisi');
        if (!form.location.trim()) errors.push('Lokasi harus diisi');
        break;
    }
    
    return errors;
  };

  const handleStepNavigation = (targetStep: number) => {
    const errors = validateStep(currentStep);
    
    if (errors.length > 0) {
      toast({
        title: 'Data belum lengkap',
        description: errors.join(', '),
        variant: 'destructive'
      });
      return;
    }
    
    setCurrentStep(targetStep);
  };

  const applyTemplate = (templateKey: keyof typeof jobTemplates.description) => {
    if (jobTemplates.description[templateKey]) {
      updateForm('description', jobTemplates.description[templateKey]);
    }
    if (jobTemplates.requirements[templateKey]) {
      updateForm('requirements', jobTemplates.requirements[templateKey]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Langkah 1: Informasi Dasar</CardTitle>
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
                      <SelectItem value="onsite">Di Kantor</SelectItem>
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
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Langkah 2: Detail Pekerjaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Deskripsi Pekerjaan</label>
                <RichTextEditor
                  value={form.description}
                  onChange={(value) => updateForm('description', value)}
                  placeholder="Jelaskan tanggung jawab, kegiatan sehari-hari, dan yang menarik dari posisi ini..."
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Persyaratan</label>
                <RichTextEditor
                  value={form.requirements}
                  onChange={(value) => updateForm('requirements', value)}
                  placeholder="Sebutkan skill, pengalaman, dan kualifikasi yang dibutuhkan..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Langkah 3: Lokasi & Kompensasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Gaji Minimum (Opsional)</label>
                  <CurrencyInput
                    value={form.salary_min}
                    onChange={(value) => updateForm('salary_min', value)}
                    placeholder="contoh: 5000000"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Gaji Maksimum (Opsional)</label>
                  <CurrencyInput
                    value={form.salary_max}
                    onChange={(value) => updateForm('salary_max', value)}
                    placeholder="contoh: 8000000"
                    className="mt-1"
                  />
                </div>
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
                {(() => {
                  const positions = parseInt(form.positions_available) || 1;
                  const pointsNeeded = positions > 1 ? positions - 1 : 0;
                  return (
                    <p className="text-xs text-gray-500 mt-1">
                      {pointsNeeded > 0 ? (
                        <span className="text-orange-600 font-medium">
                          Membutuhkan {pointsNeeded} poin (1 posisi gratis, +{pointsNeeded} berbayar)
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium">
                          Gratis - 1 posisi tidak memerlukan poin
                        </span>
                      )}
                    </p>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Langkah 4: Tinjau & Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">🎉 Hampir Selesai!</h3>
                <p className="text-sm text-green-700">
                  Tinjau lowongan Anda dan klik "Preview" untuk melihat tampilan untuk pelamar.
                  Jika sudah puas, klik "Selesai & Posting Lowongan" untuk menerbitkannya.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Judul Lowongan:</span>
                  <span className="font-medium">{form.title || 'Belum diisi'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kategori:</span>
                  <span className="font-medium">
                    {categories.find(c => c.id === form.job_category_id)?.name || 'Belum dipilih'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lokasi:</span>
                  <span className="font-medium">{form.location || 'Belum diisi'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kuota Pelamar:</span>
                  <span className="font-medium">{form.positions_available}</span>
                </div>
                {parseInt(form.positions_available) > 1 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Biaya:</span>
                    <span className="font-medium text-orange-600">
                      {parseInt(form.positions_available) - 1} poin
                    </span>
                  </div>
                )}
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Buat Lowongan Baru</h1>
            <div className="text-sm text-gray-500">
              Langkah {currentStep} dari {steps.length}
            </div>
          </div>
          
          {/* Step Progress Bar */}
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep ? 'bg-blue-600 text-white' :
                  step.id < currentStep ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step.id < currentStep ? '✓' : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Current Step Info */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h3 className="font-medium text-blue-900">{steps[currentStep - 1]?.title}</h3>
            <p className="text-sm text-blue-700">{steps[currentStep - 1]?.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form - Step Content */}
            <div className="lg:col-span-2">
              {renderStepContent()}
            </div>

            {/* Sidebar - Glints Style */}
            <div className="space-y-6">
              {/* Posting Summary */}
              {userCompany && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      Ringkasan Posting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Lowongan Aktif:</span>
                        <span className="font-semibold">{userCompany.active_job_posts}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Poin Tersedia:</span>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{userCompany.job_posting_points} Poin</div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-green-800">Posting Dasar: GRATIS</div>
                        <div className="text-xs text-green-600 mt-1">1 posisi sudah termasuk</div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-800">Posisi Tambahan: 1 poin per posisi</div>
                        <div className="text-xs text-blue-600 mt-1">Cocok untuk rekrutmen massal</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Preview Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowPreview(true)}
                  >
                    Preview Lowongan
                  </Button>
                </CardContent>
              </Card>
              
              {/* Navigation Buttons */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  {currentStep > 1 && (
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      ← Langkah Sebelumnya
                    </Button>
                  )}
                  
                  {currentStep < steps.length ? (
                    <Button 
                      type="button"
                      className="w-full"
                      onClick={() => handleStepNavigation(currentStep + 1)}
                    >
                      Langkah Selanjutnya →
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Menerbitkan...' : '🚀 Selesai & Posting Lowongan'}
                    </Button>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </form>
        
        {/* Job Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">👀 Preview Lowongan</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    ✕ Tutup
                  </Button>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900">
                      {form.title || 'Job Title'}
                    </h3>
                    <p className="text-blue-700">
                      {companies.find(c => c.id === form.company_id)?.name || 'Company Name'}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="bg-blue-100 px-2 py-1 rounded">
                        {form.employment_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="bg-blue-100 px-2 py-1 rounded">
                        {form.work_arrangement.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="bg-blue-100 px-2 py-1 rounded">
                        {form.experience_level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">📍 Lokasi</h4>
                    <p>{form.location || 'Belum diisi'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">💰 Gaji</h4>
                    <p>
                      {form.salary_min && form.salary_max 
                        ? `Rp ${parseInt(form.salary_min).toLocaleString()} - Rp ${parseInt(form.salary_max).toLocaleString()}` 
                        : 'Gaji dapat dinegosiasi'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">📝 Deskripsi Pekerjaan</h4>
                    <div className="bg-gray-50 p-3 rounded border">
                      {form.description ? (
                        <div dangerouslySetInnerHTML={{ __html: form.description }} />
                      ) : (
                        <p className="text-gray-500 italic">Deskripsi belum diisi</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">✅ Persyaratan</h4>
                    <div className="bg-gray-50 p-3 rounded border">
                      {form.requirements ? (
                        <div dangerouslySetInnerHTML={{ __html: form.requirements }} />
                      ) : (
                        <p className="text-gray-500 italic">Persyaratan belum diisi</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">👥 Kuota Pelamar</h4>
                    <p>{form.positions_available} posisi</p>
                    {parseInt(form.positions_available) > 1 && (
                      <p className="text-sm text-orange-600">
                        Akan membutuhkan {parseInt(form.positions_available) - 1} poin (1 gratis + {parseInt(form.positions_available) - 1} berbayar)
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                    className="flex-1"
                  >
                    Edit Lagi
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowPreview(false);
                      handleStepNavigation(steps.length); // Go to final step with validation
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Sudah Bagus! →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}