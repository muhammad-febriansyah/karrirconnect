import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Coins, AlertTriangle, CreditCard, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Category {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
}

interface JobListing {
  id: number;
  slug: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string[] | string;
  banner_image?: string;
  banner_image_url?: string;
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
  skills: Skill[];
  userCompany?: {
    id: number;
    name: string;
    job_posting_points: number;
    active_job_posts: number;
  };
}

export default function EditJobListing({ jobListing, categories, companies, skills, userCompany }: Props) {
  const [form, setForm] = useState({
    title: jobListing.title,
    description: jobListing.description,
    requirements: jobListing.requirements,
    benefits: Array.isArray(jobListing.benefits) ? jobListing.benefits.join('\n') : (jobListing.benefits || ''),
    banner_image: null as File | null,
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
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<number[]>(jobListing.skills?.map(skill => skill.id) || []);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [bannerPreview]);

  // Handle click outside to close skill dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.skill-dropdown-container')) {
        setShowSkillDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Skills helper functions
  const addSkill = (skillId: number) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
      updateForm('skills', [...selectedSkills, skillId]);
    }
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillId: number) => {
    const newSkills = selectedSkills.filter(id => id !== skillId);
    setSelectedSkills(newSkills);
    updateForm('skills', newSkills);
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.includes(skill.id)
  );

  const getSelectedSkillNames = () => {
    return skills.filter(skill => selectedSkills.includes(skill.id));
  };

  const steps = [
    { id: 1, title: 'Informasi Dasar', description: 'Judul, kategori, dan tipe pekerjaan' },
    { id: 2, title: 'Detail Pekerjaan', description: 'Deskripsi, requirement, dan benefit' },
    { id: 3, title: 'Lokasi & Gaji', description: 'Lokasi kerja dan rentang gaji' },
    { id: 4, title: 'Preview & Simpan', description: 'Tinjau dan simpan perubahan' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateStep(4); // Validate only critical fields

    if (errors.length > 0) {
      toast.error(`${errors.join(', ')}`, {
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(`Memperbarui lowongan "${jobListing.title}"...`);

    // Prepare form data for file upload
    const formData = new FormData();

    // Add all form fields
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'banner_image' && value instanceof File) {
        formData.append(key, value);
      } else if (key === 'salary_min' || key === 'salary_max') {
        const numericValue = value && value.toString().trim() !== '' ? parseInt(value.toString(), 10) : null;
        if (numericValue !== null) {
          formData.append(key, numericValue.toString());
        }
      } else if (key === 'positions_available') {
        formData.append(key, parseInt(value.toString(), 10).toString());
      } else if (key === 'skills' && Array.isArray(value)) {
        // Handle skills array properly
        value.forEach((skill, index) => {
          formData.append(`skills[${index}]`, skill.toString());
        });
      } else if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add method override for PUT request
    formData.append('_method', 'PUT');

    router.post(route('admin.job-listings.update', jobListing.slug), formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.dismiss(loadingToast);
        toast.success(`Lowongan "${jobListing.title}" berhasil diperbarui!`, {
          duration: 4000,
        });
        // Redirect handled by controller
      },
      onError: (errors) => {
        toast.dismiss(loadingToast);

        // Show specific error messages if available
        if (typeof errors === 'object' && errors !== null) {
          const errorMessages = Object.values(errors).flat();
          if (errorMessages.length > 0) {
            toast.error(`Gagal memperbarui lowongan: ${errorMessages[0]}`, {
              duration: 5000,
            });
          } else {
            toast.error(`Gagal memperbarui lowongan "${jobListing.title}". Periksa kembali data yang diinput.`, {
              duration: 4000,
            });
          }
        } else {
          toast.error(`Gagal memperbarui lowongan "${jobListing.title}". Silakan coba lagi.`, {
            duration: 4000,
          });
        }
      },
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
        // Relaxed validation for edit mode - only check critical fields
        if (!form.title.trim()) errors.push('Judul lowongan tidak boleh kosong');
        break;
      case 2:
        // Optional validation for edit mode
        break;
      case 3:
        // Optional validation for edit mode
        break;
      case 4:
        // Final validation - only check title which is most critical
        if (!form.title.trim()) errors.push('Judul lowongan tidak boleh kosong');
        break;
    }

    return errors;
  };

  const handleStepNavigation = (targetStep: number) => {
    const errors = validateStep(currentStep);

    if (errors.length > 0) {
      toast.error(`Data belum lengkap: ${errors.join(', ')}`, {
        duration: 4000,
      });
      return;
    }

    setCurrentStep(targetStep);
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
                {jobListing.title && (
                  <p className="text-xs text-blue-600 mt-1 mb-1">
                    Saat ini: "{jobListing.title}"
                  </p>
                )}
                <Input
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder={jobListing.title || "contoh: Senior Frontend Developer"}
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
                <label className="text-sm font-medium">Deskripsi Pekerjaan (Opsional)</label>
                <RichTextEditor
                  content={form.description}
                  onChange={(value) => updateForm('description', value)}
                  placeholder="Jelaskan tanggung jawab, kegiatan sehari-hari, dan yang menarik dari posisi ini..."
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Persyaratan (Opsional)</label>
                <RichTextEditor
                  content={form.requirements}
                  onChange={(value) => updateForm('requirements', value)}
                  placeholder="Sebutkan skill, pengalaman, dan kualifikasi yang dibutuhkan..."
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tunjangan & Fasilitas (Opsional)</label>
                <RichTextEditor
                  content={form.benefits}
                  onChange={(value) => updateForm('benefits', value)}
                  placeholder="Sebutkan tunjangan, fasilitas, dan benefit yang diberikan seperti BPJS, tunjangan makan, laptop, dll..."
                  className="mt-1"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Contoh: BPJS Kesehatan & Ketenagakerjaan, Tunjangan Transport, Laptop/PC, Cuti Tahunan, dll.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Skills yang Dibutuhkan (Opsional)
                </label>

                {/* Skills Input Area - Glints Style */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-300 transition-all duration-200">
                  {/* Selected Skills Display */}
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getSelectedSkillNames().map((skill) => (
                        <div
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium group hover:bg-blue-200 transition-colors"
                        >
                          <span>{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="ml-2 text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills Input */}
                  <div className="relative skill-dropdown-container">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        onFocus={() => setShowSkillDropdown(true)}
                        placeholder={selectedSkills.length === 0 ? "Ketik untuk mencari skills seperti 'JavaScript', 'React', 'PHP'..." : "Tambah skill lainnya..."}
                        className="flex-1 border-0 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
                      />
                      {skillSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setSkillSearch('');
                            setShowSkillDropdown(false);
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Dropdown */}
                    {showSkillDropdown && (filteredSkills.length > 0 || skillSearch) && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {filteredSkills.length > 0 ? (
                          <>
                            <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                              Skills yang tersedia ({filteredSkills.length})
                            </div>
                            {filteredSkills.slice(0, 12).map((skill) => (
                              <button
                                key={skill.id}
                                type="button"
                                onClick={() => addSkill(skill.id)}
                                className="w-full px-3 py-2.5 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors border-b border-gray-50 last:border-b-0"
                              >
                                <span className="text-gray-700 text-sm font-medium">{skill.name}</span>
                                <Plus className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              </button>
                            ))}
                            {filteredSkills.length > 12 && (
                              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                                +{filteredSkills.length - 12} skills lainnya. Ketik lebih spesifik untuk melihat lebih sedikit.
                              </div>
                            )}
                          </>
                        ) : skillSearch ? (
                          <div className="px-3 py-4 text-center text-gray-500">
                            <div className="text-sm">Skill "{skillSearch}" tidak ditemukan</div>
                            <div className="text-xs mt-1">Coba kata kunci lain atau hubungi admin untuk menambah skill baru</div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                {/* Help Text */}
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex items-start space-x-1">
                    <div>
                      <div className="font-medium">Tips:</div>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside ml-2">
                        <li>Tambahkan 3-8 skills utama yang benar-benar dibutuhkan</li>
                        <li>Mulai dengan skills teknis yang spesifik (misal: React, Python)</li>
                        <li>Lalu tambah soft skills jika diperlukan (misal: Communication)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Banner Gambar (Opsional)</label>
                <div className="mt-1">
                  {jobListing.banner_image && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Banner saat ini:</p>
                      <img
                        src={jobListing.banner_image_url}
                        alt="Current banner"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      updateForm('banner_image', file);
                      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
                      setBannerPreview(file ? URL.createObjectURL(file) : null);
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      file:cursor-pointer cursor-pointer"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Upload gambar banner untuk lowongan (JPG, PNG, max 2MB)
                  </p>
                  {form.banner_image && (
                    <div className="mt-3 space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 font-medium">
                          File terpilih: {form.banner_image.name}
                        </p>
                      </div>
                      {bannerPreview && (
                        <div className="h-40 sm:h-56 md:h-72 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <img
                            src={bannerPreview}
                            alt="Preview Banner Lowongan"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                <label className="text-sm font-medium">Lokasi (Opsional)</label>
                {jobListing.location && (
                  <p className="text-xs text-blue-600 mt-1 mb-1">
                    Saat ini: "{jobListing.location}"
                  </p>
                )}
                <Input
                  value={form.location}
                  onChange={(e) => updateForm('location', e.target.value)}
                  placeholder={jobListing.location || "contoh: Jakarta, Indonesia"}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Gaji Minimum (Opsional)</label>
                  {jobListing.salary_min && (
                    <p className="text-xs text-blue-600 mt-1 mb-1">
                      Saat ini: Rp {parseInt(jobListing.salary_min.toString()).toLocaleString()}
                    </p>
                  )}
                  <CurrencyInput
                    value={form.salary_min}
                    onChange={(value) => updateForm('salary_min', value)}
                    placeholder={jobListing.salary_min ? `Rp ${parseInt(jobListing.salary_min.toString()).toLocaleString()}` : "contoh: 5000000"}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Gaji Maksimum (Opsional)</label>
                  {jobListing.salary_max && (
                    <p className="text-xs text-blue-600 mt-1 mb-1">
                      Saat ini: Rp {parseInt(jobListing.salary_max.toString()).toLocaleString()}
                    </p>
                  )}
                  <CurrencyInput
                    value={form.salary_max}
                    onChange={(value) => updateForm('salary_max', value)}
                    placeholder={jobListing.salary_max ? `Rp ${parseInt(jobListing.salary_max.toString()).toLocaleString()}` : "contoh: 8000000"}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Kuota Pelamar (Opsional)</label>
                {jobListing.positions_available && (
                  <p className="text-xs text-blue-600 mt-1 mb-1">
                    Saat ini: {jobListing.positions_available} posisi
                  </p>
                )}
                <Input
                  type="number"
                  value={form.positions_available}
                  onChange={(e) => updateForm('positions_available', e.target.value)}
                  placeholder={jobListing.positions_available?.toString() || "1"}
                  min="1"
                  max="50"
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
              <CardTitle>Langkah 4: Tinjau & Simpan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Mode Edit - Review Perubahan</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Anda dalam mode edit lowongan. Review perubahan yang Anda buat sebelum menyimpan.
                </p>

                {/* Quick comparison */}
                <div className="text-xs space-y-1">
                  {form.title !== jobListing.title && (
                    <div className="bg-yellow-100 px-2 py-1 rounded">
                      <strong>Judul:</strong> \"{jobListing.title}\" → \"{form.title}\"
                    </div>
                  )}
                  {form.location !== jobListing.location && (
                    <div className="bg-yellow-100 px-2 py-1 rounded">
                      <strong>Lokasi:</strong> \"{jobListing.location}\" → \"{form.location}\"
                    </div>
                  )}
                  {form.positions_available !== jobListing.positions_available.toString() && (
                    <div className="bg-yellow-100 px-2 py-1 rounded">
                      <strong>Kuota:</strong> {jobListing.positions_available} → {form.positions_available} posisi
                    </div>
                  )}
                  {(form.salary_min !== (jobListing.salary_min?.toString() || '') ||
                    form.salary_max !== (jobListing.salary_max?.toString() || '')) && (
                    <div className="bg-yellow-100 px-2 py-1 rounded">
                      <strong>Gaji:</strong> Perubahan pada rentang gaji
                    </div>
                  )}
                </div>

                {/* No changes indicator */}
                {form.title === jobListing.title &&
                 form.location === jobListing.location &&
                 form.positions_available === jobListing.positions_available.toString() &&
                 form.salary_min === (jobListing.salary_min?.toString() || '') &&
                 form.salary_max === (jobListing.salary_max?.toString() || '') && (
                  <div className="text-green-700 text-xs mt-2">
                    Tidak ada perubahan pada field utama
                  </div>
                )}
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
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="font-medium">{form.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kuota Pelamar (Opsional):</span>
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Lowongan - {jobListing.title}</h1>
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
                  {step.id < currentStep ? '*' : step.id}
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
            <h3 className="font-medium text-blue-900">{steps[currentStep - 1]?.title} - Mode Edit</h3>
            <p className="text-sm text-blue-700">{steps[currentStep - 1]?.description} (Semua field opsional kecuali judul)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form - Step Content */}
            <div className="lg:col-span-2">
              {renderStepContent()}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview Button */}
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
                          <div className="font-semibold text-blue-600">{userCompany.job_posting_points} Poin</div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-800">Posting Lowongan</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Setiap publikasi lowongan akan mengurangi <strong>1 poin</strong> dari saldo perusahaan.
                        </div>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-purple-800">Job Invitation</div>
                        <div className="text-xs text-purple-600 mt-1">
                          Mengundang kandidat melalui database juga memerlukan <strong>1 poin</strong> per undangan.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preview Button - Hidden */}
              {/* <Card>
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
              </Card> */}

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
                       Langkah Sebelumnya
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
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.get(route('admin.job-listings.show', jobListing.slug))}
                  >
                    Lihat Detail
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
            </div>
          </div>
        </form>

        {/* Job Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Preview Lowongan</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    Tutup
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
                    <h4 className="font-medium mb-2">Lokasi</h4>
                    <p>{form.location || 'Belum diisi'}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Gaji</h4>
                    <p>
                      {form.salary_min && form.salary_max
                        ? `Rp ${parseInt(form.salary_min).toLocaleString()} - Rp ${parseInt(form.salary_max).toLocaleString()}`
                        : 'Gaji dapat dinegosiasi'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Deskripsi Pekerjaan</h4>
                    <div className="bg-gray-50 p-3 rounded border">
                      {form.description ? (
                        <div dangerouslySetInnerHTML={{ __html: form.description }} />
                      ) : (
                        <p className="text-gray-500 italic">Deskripsi belum diisi</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Persyaratan</h4>
                    <div className="bg-gray-50 p-3 rounded border">
                      {form.requirements ? (
                        <div dangerouslySetInnerHTML={{ __html: form.requirements }} />
                      ) : (
                        <p className="text-gray-500 italic">Persyaratan belum diisi</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Kuota Pelamar</h4>
                    <p>{form.positions_available} posisi</p>
                    <p className="text-sm text-slate-600">
                      Publikasi lowongan akan mengurangi 1 poin dari saldo perusahaan.
                    </p>
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
