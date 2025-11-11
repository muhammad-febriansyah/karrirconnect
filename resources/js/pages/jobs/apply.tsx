import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
// import ModernNavbar from '@/components/modern-navbar';
// import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { 
    ArrowLeft, 
    FileText, 
    Upload, 
    MapPin, 
    Briefcase, 
    Building2,
    AlertCircle,
    CheckCircle,
    User,
    Mail,
    Phone,
    FileUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import MainLayout from '@/layouts/main-layout';

interface Company {
    id: number;
    name: string;
    logo: string | null;
    location: string;
    industry: string;
    is_verified: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface JobListing {
    id: number;
    slug: string;
    title: string;
    description: string;
    employment_type: string;
    work_arrangement: string;
    location: string;
    salary_min: number | null;
    salary_max: number | null;
    salary_currency: string;
    salary_negotiable: boolean;
    company: Company;
    category: Category | null;
}

interface JobApplyProps {
    job: JobListing;
}

export default function JobApply({ job }: JobApplyProps) {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [resumePreview, setResumePreview] = useState<string>('');
    
    const { data, setData, post, processing, errors, reset } = useForm({
        cover_letter: '',
        resume: null as File | null,
        additional_documents: [] as File[]
    });

    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('resume', file);
            setResumePreview(file.name);
        }
    };

    const handleAdditionalFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setData('additional_documents', fileArray);
            setSelectedFiles(files);
        }
    };

    const formatSalary = (min: number | null, max: number | null, currency: string = 'IDR', negotiable: boolean = false) => {
        if (negotiable) return 'Gaji dapat dinegosiasi';
        if (!min && !max) return 'Gaji tidak disebutkan';
        
        const formatNumber = (num: number) => {
            if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}M`;
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
            if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
            return num.toLocaleString();
        };

        const prefix = currency === 'IDR' ? 'Rp ' : `${currency} `;
        
        if (min && max) {
            return `${prefix}${formatNumber(min)} - ${formatNumber(max)}`;
        }
        if (min) return `Mulai dari ${prefix}${formatNumber(min)}`;
        if (max) return `Hingga ${prefix}${formatNumber(max)}`;
        return 'Gaji tidak disebutkan';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/jobs/${job.slug}/apply`, {
            onSuccess: () => {
                reset();
                setResumePreview('');
                setSelectedFiles(null);
                toast.success('Lamaran Berhasil Dikirim!', {
                    description: 'Terima kasih telah melamar. Kami akan menghubungi Anda jika profil Anda sesuai dengan kebutuhan perusahaan.',
                    duration: 5000,
                });
            },
            onError: () => {
                toast.error('Gagal Mengirim Lamaran', {
                    description: 'Terjadi kesalahan saat mengirim lamaran. Silakan periksa kembali data Anda dan coba lagi.',
                    duration: 4000,
                });
            }
        });
    };

    return (
        <MainLayout currentPage="jobs">
            <Head title={`Lamar - ${job.title} di ${job.company.name}`} />

                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24 pb-16 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <FlickeringGrid 
                            className="h-full w-full"
                            squareSize={4}
                            gridGap={6}
                            color="rgb(99, 102, 241)"
                            maxOpacity={0.05}
                            flickerChance={0.08}
                        />
                    </div>
                    
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Back Button */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <Link 
                                href={`/jobs/${job.slug}`}
                                className="inline-flex items-center text-gray-600 hover:text-[#2347FA] transition-colors group"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Kembali ke Detail Lowongan
                            </Link>
                        </motion.div>

                        {/* Page Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Lamar Pekerjaan
                            </h1>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Isi formulir di bawah ini untuk melamar posisi yang Anda minati. 
                                Pastikan semua informasi yang diberikan akurat dan lengkap.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Application Form */}
                <section className="py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Job Summary Card */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="sticky top-24"
                                >
                                    <Card className="shadow-lg border-0">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                                                <Briefcase className="w-5 h-5 mr-2 text-[#2347FA]" />
                                                Ringkasan Lowongan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Company Info */}
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="w-12 h-12 ring-2 ring-gray-200">
                                                    {job.company.logo ? (
                                                        <AvatarImage src={job.company.logo} alt={job.company.name} />
                                                    ) : (
                                                        <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white font-bold">
                                                            {job.company.name.charAt(0)}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{job.company.name}</h3>
                                                    <p className="text-sm text-gray-600">{job.company.industry}</p>
                                                </div>
                                            </div>

                                            {/* Job Title */}
                                            <div>
                                                <h2 className="font-bold text-lg text-gray-900 mb-2">{job.title}</h2>
                                                {job.category && (
                                                    <Badge className="bg-gray-100 text-gray-700">
                                                        {job.category.name}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Job Details */}
                                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 mr-2 text-[#2347FA]" />
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Building2 className="w-4 h-4 mr-2 text-[#2347FA]" />
                                                    {job.employment_type} • {job.work_arrangement}
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Gaji: </span>
                                                    <span className="font-medium text-[#2347FA]">
                                                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Tips */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                                                <div className="flex items-start space-x-2">
                                                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <h4 className="font-medium text-blue-900 mb-2">Tips Lamaran</h4>
                                                        <ul className="text-sm text-blue-800 space-y-1">
                                                            <li>• Tulis surat lamaran yang menarik</li>
                                                            <li>• Upload CV terbaru (PDF, DOC, DOCX)</li>
                                                            <li>• Periksa kembali semua informasi</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Application Form */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <Card className="shadow-lg border-0">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                                                <FileText className="w-6 h-6 mr-3 text-[#2347FA]" />
                                                Formulir Lamaran
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                {/* Cover Letter */}
                                                <div>
                                                    <Label htmlFor="cover_letter" className="text-base font-medium text-gray-900">
                                                        Surat Lamaran *
                                                    </Label>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Jelaskan mengapa Anda cocok untuk posisi ini.
                                                    </p>
                                                    <Textarea
                                                        id="cover_letter"
                                                        value={data.cover_letter}
                                                        onChange={(e) => setData('cover_letter', e.target.value)}
                                                        placeholder="Saya memiliki pengalaman 3 tahun di bidang yang relevan dan menguasai teknologi yang dibutuhkan untuk posisi ini. Saya yakin dapat berkontribusi dengan baik untuk mencapai target perusahaan..."
                                                        rows={8}
                                                        className="resize-none"
                                                        disabled={processing}
                                                    />
                                                    <InputError message={errors.cover_letter} />
                                                </div>

                                                {/* Resume Upload */}
                                                <div>
                                                    <Label htmlFor="resume" className="text-base font-medium text-gray-900">
                                                        CV/Resume *
                                                    </Label>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Upload CV atau resume terbaru Anda (format: PDF, DOC, DOCX, maksimal 5MB).
                                                    </p>
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            id="resume"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={handleResumeChange}
                                                            className="hidden"
                                                            disabled={processing}
                                                        />
                                                        <label 
                                                            htmlFor="resume"
                                                            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2347FA] hover:bg-gray-50 transition-colors"
                                                        >
                                                            <div className="text-center">
                                                                {resumePreview ? (
                                                                    <div className="flex items-center space-x-2">
                                                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                                                        <span className="text-sm font-medium text-gray-900">{resumePreview}</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                        <p className="text-sm text-gray-600">
                                                                            <span className="font-medium text-[#2347FA]">Klik untuk upload</span> atau drag & drop
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">PDF, DOC, DOCX (maks. 5MB)</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <InputError message={errors.resume} />
                                                </div>

                                                {/* Additional Documents */}
                                                <div>
                                                    <Label htmlFor="additional_documents" className="text-base font-medium text-gray-900">
                                                        Dokumen Tambahan (Opsional)
                                                    </Label>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Upload portofolio, sertifikat, atau dokumen pendukung lainnya.
                                                    </p>
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            id="additional_documents"
                                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                            multiple
                                                            onChange={handleAdditionalFilesChange}
                                                            className="hidden"
                                                            disabled={processing}
                                                        />
                                                        <label 
                                                            htmlFor="additional_documents"
                                                            className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2347FA] hover:bg-gray-50 transition-colors"
                                                        >
                                                            <div className="text-center">
                                                                {selectedFiles && selectedFiles.length > 0 ? (
                                                                    <div className="flex items-center space-x-2">
                                                                        <FileUp className="w-5 h-5 text-green-500" />
                                                                        <span className="text-sm font-medium text-gray-900">
                                                                            {selectedFiles.length} file(s) dipilih
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <FileUp className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                                                        <p className="text-sm text-gray-600">Upload dokumen tambahan</p>
                                                                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <InputError message={errors['additional_documents.0']} />
                                                </div>

                                                {/* Submit Button */}
                                                <div className="flex justify-end space-x-4 pt-6">
                                                    <Link href={`/jobs/${job.slug}`}>
                                                        <Button 
                                                            type="button"
                                                            variant="outline"
                                                            disabled={processing}
                                                        >
                                                            Batal
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        type="submit"
                                                        className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1e40e0] hover:to-[#2347FA] text-white px-8"
                                                        disabled={processing || !data.cover_letter || !data.resume}
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                Mengirim...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Mail className="w-4 h-4 mr-2" />
                                                                Kirim Lamaran
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

            </MainLayout>
    );
}