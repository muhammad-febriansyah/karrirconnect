import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Upload, FileCheck, Shield, AlertCircle, CheckCircle2, Briefcase, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Company {
    id: number;
    name: string;
    is_verified: boolean;
    verification_status?: string;
}

interface Props {
    company: Company;
}

export default function CompanyVerification({ company }: Props) {
    const [verificationType, setVerificationType] = useState<'legal' | 'individual'>('legal');
    const [businessType, setBusinessType] = useState<'online' | 'offline'>('online');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors, progress } = useForm({
        // Common fields
        verification_type: 'legal',

        // Company Profile (Legal)
        legal_company_name: '',
        business_entity_type: '',
        office_address: '',
        website: '',
        work_email: '',
        company_description: '',
        company_logo: null as File | null,
        industry: '',
        team_size: '',

        // Contact PIC (Legal)
        pic_name: '',
        pic_position: '',
        pic_email: '',
        pic_phone: '',
        
        // Legal Data
        nib_number: '',
        npwp_number: '',
        establishment_deed: null as File | null,
        kemenkumham_sk: null as File | null,
        domicile_certificate: null as File | null,
        
        // Legal Documents Upload
        nib_document: null as File | null,
        npwp_document: null as File | null,
        supporting_documents: [] as File[],
        
        // Individual Business - Identity Document Choice
        identity_document_type: 'npwp', // 'npwp' or 'ktp'
        
        // Individual Documents
        npwp_pribadi_document: null as File | null,
        ktp_pribadi_document: null as File | null,
        npwp_pribadi_number: '',
        nib_pribadi_number: '',
        
        // Business Activity Type
        business_activity_type: 'online', // 'online' or 'offline'
        
        // Business Activity Photos
        online_business_photos: [] as File[],
        offline_business_photos: [] as File[],
        
        // Additional supporting documents
        individual_supporting_documents: [] as File[],
        
        // Agreements
        data_accuracy_agreement: false,
        terms_agreement: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!data.data_accuracy_agreement || !data.terms_agreement) {
            toast.error('Persetujuan diperlukan', {
                description: 'Mohon centang semua persetujuan yang diperlukan',
                icon: <AlertCircle className="h-4 w-4" />,
            });
            return;
        }

        // Validate required fields based on verification type
        if (!data.legal_company_name.trim()) {
            toast.error('Data tidak lengkap', {
                description: 'Nama perusahaan/usaha wajib diisi',
                icon: <AlertCircle className="h-4 w-4" />,
            });
            return;
        }

        if (!data.office_address.trim()) {
            toast.error('Data tidak lengkap', {
                description: 'Alamat kantor/usaha wajib diisi',
                icon: <AlertCircle className="h-4 w-4" />,
            });
            return;
        }

        if (!data.work_email.trim()) {
            toast.error('Data tidak lengkap', {
                description: 'Email perusahaan/usaha wajib diisi',
                icon: <AlertCircle className="h-4 w-4" />,
            });
            return;
        }

        // Validation for legal entity
        if (verificationType === 'legal') {
            if (!data.business_entity_type) {
                toast.error('Data tidak lengkap', {
                    description: 'Tipe badan usaha wajib dipilih',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }

            if (!data.pic_name.trim()) {
                toast.error('Data PIC tidak lengkap', {
                    description: 'Nama PIC wajib diisi',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }

            if (!data.pic_position.trim()) {
                toast.error('Data PIC tidak lengkap', {
                    description: 'Jabatan PIC wajib diisi',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }

            if (!data.pic_email.trim()) {
                toast.error('Data PIC tidak lengkap', {
                    description: 'Email PIC wajib diisi',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }

            if (!data.pic_phone.trim()) {
                toast.error('Data PIC tidak lengkap', {
                    description: 'Telepon PIC wajib diisi',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }

            if (!data.npwp_number.trim()) {
                toast.error('Dokumen legal tidak lengkap', {
                    description: 'Nomor NPWP perusahaan wajib diisi',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }

            if (!data.npwp_document) {
                toast.error('Dokumen legal tidak lengkap', {
                    description: 'Dokumen NPWP perusahaan wajib diupload',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }
        }

        // Validation for individual business
        if (verificationType === 'individual') {
            if (!data.identity_document_type) {
                toast.error('Dokumen identitas diperlukan', {
                    description: 'Jenis dokumen identitas wajib dipilih',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }

            if (data.identity_document_type === 'npwp') {
                if (!data.npwp_pribadi_number.trim()) {
                    toast.error('Data NPWP tidak lengkap', {
                        description: 'Nomor NPWP pribadi wajib diisi',
                        icon: <AlertCircle className="h-4 w-4" />,
                    });
                    return;
                }
                if (!data.npwp_pribadi_document) {
                    toast.error('Dokumen NPWP tidak lengkap', {
                        description: 'Dokumen NPWP pribadi wajib diupload',
                        icon: <AlertCircle className="h-4 w-4" />,
                    });
                    return;
                }
            } else {
                if (!data.ktp_pribadi_document) {
                    toast.error('Dokumen KTP diperlukan', {
                        description: 'Dokumen KTP pribadi wajib diupload',
                        icon: <AlertCircle className="h-4 w-4" />,
                    });
                    return;
                }
            }

            if (!data.business_activity_type) {
                toast.error('Jenis bisnis diperlukan', {
                    description: 'Jenis aktivitas bisnis wajib dipilih',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }

            // Check business photos
            const photosField = data.business_activity_type === 'online' ? data.online_business_photos : data.offline_business_photos;
            if (!photosField || photosField.length < 2) {
                toast.error('Foto bisnis tidak lengkap', {
                    description: 'Minimal 2 foto aktivitas bisnis wajib diupload',
                    icon: <AlertCircle className="h-4 w-4" />,
                });
                return;
            }
        }


        post(route('admin.company.verify.submit'), {
            forceFormData: true,
            onStart: () => {
            },
            onProgress: (progress) => {
            },
            onSuccess: (page) => {
                setShowSuccessAlert(true);

                // Show success toast
                toast.success('Verifikasi berhasil dikirim!', {
                    description: 'Tim kami akan meninjau dokumen dalam 1-3 hari kerja.',
                    icon: <Clock className="h-4 w-4" />,
                    duration: 5000,
                });

                // Auto-redirect to dashboard after 3 seconds
                setTimeout(() => {
                    window.location.href = route('admin.dashboard');
                }, 3000);
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);

                // Show error toast with first error message
                const firstError = Object.values(errors)[0];
                const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;

                toast.error('Gagal mengirim verifikasi', {
                    description: errorMessage || 'Terjadi kesalahan saat mengirim dokumen verifikasi.',
                    icon: <AlertCircle className="h-4 w-4" />,
                    duration: 6000,
                });

                // Also show detailed error information in console
                let detailedErrorMessage = 'Detail kesalahan:\n';
                Object.entries(errors).forEach(([field, message]) => {
                    if (Array.isArray(message)) {
                        detailedErrorMessage += `- ${field}: ${message.join(', ')}\n`;
                    } else {
                        detailedErrorMessage += `- ${field}: ${message}\n`;
                    }
                });
            },
            onFinish: () => {
            }
        });
    };

    useEffect(() => {
        return () => {
            if (companyLogoPreview) URL.revokeObjectURL(companyLogoPreview);
        };
    }, [companyLogoPreview]);

    const handleFileChange = (field: string, file: File | null) => {
        setData(field as any, file);
        if (field === 'company_logo') {
            if (companyLogoPreview) URL.revokeObjectURL(companyLogoPreview);
            setCompanyLogoPreview(file ? URL.createObjectURL(file) : null);
        }
    };

    const handleMultipleFileChange = (field: string, files: FileList | null) => {
        if (files) {
            setData(field as any, Array.from(files));
        }
    };

    const handleVerificationTypeChange = (type: 'legal' | 'individual') => {
        setVerificationType(type);
        setData('verification_type', type);
    };

    return (
        <AppLayout>
            <Head title="Verifikasi Perusahaan" />

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Verifikasi Perusahaan</h1>
                        <p className="text-gray-600">Lengkapi data perusahaan untuk mendapatkan akses penuh</p>
                    </div>
                    {company.verification_status === 'verified' ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Verified Badge
                        </Badge>
                    ) : company.verification_status === 'rejected' ? (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            Ditolak
                        </Badge>
                    ) : company.verification_status === 'pending' ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">
                            <Clock className="mr-1 h-4 w-4" />
                            Menunggu Review
                        </Badge>
                    ) : company.verification_status === 'unverified' ? (
                        <Badge variant="outline" className="text-gray-600 border-gray-600">
                            <Shield className="mr-1 h-4 w-4" />
                            Belum Terverifikasi
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-gray-600 border-gray-600">
                            <Shield className="mr-1 h-4 w-4" />
                            Belum Terverifikasi
                        </Badge>
                    )}
                </div>

                {/* Status Alerts */}
                {company.verification_status === 'verified' && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Selamat! Perusahaan Anda telah terverifikasi. Anda kini dapat mengakses semua fitur premium dan mendapatkan Verified Badge.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Success Alert - Menunggu Review */}
                {showSuccessAlert && (
                    <Alert className="border-blue-200 bg-blue-50">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                            <strong>Verifikasi berhasil dikirim!</strong> Status perusahaan Anda sekarang sedang menunggu review.
                            Tim kami akan meninjau dokumen dalam 1-3 hari kerja. Anda akan diarahkan ke dashboard dalam beberapa detik.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Pending Status Alert */}
                {company.verification_status === 'pending' && !showSuccessAlert && (
                    <Alert className="border-orange-200 bg-orange-50">
                        <Clock className="h-4 w-4" style={{ color: '#9a3412' }} />
                        <AlertDescription className="text-orange-800">
                            Dokumen verifikasi Anda sedang ditinjau oleh tim kami. Proses review membutuhkan waktu 1-3 hari kerja.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Unverified Status Info */}
                {company.verification_status === 'unverified' && !showSuccessAlert && (
                    <Alert className="border-blue-200 bg-blue-50">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                            Lengkapi dokumen verifikasi untuk mendapatkan akses penuh ke fitur KarirConnect.
                        </AlertDescription>
                    </Alert>
                )}

                {company.verification_status === 'rejected' && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            Dokumen verifikasi Anda ditolak. Silakan periksa email untuk detail dan kirim ulang dokumen yang diperlukan.
                        </AlertDescription>
                    </Alert>
                )}

                {/* General Errors Display */}
                {errors.general && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {errors.general}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Document Upload Guidelines */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center text-blue-800">
                            <FileCheck className="mr-2 h-5 w-5" />
                            Petunjuk Upload Dokumen
                        </CardTitle>
                        <CardDescription className="text-blue-700">
                            Pastikan dokumen Anda memenuhi persyaratan berikut untuk mempercepat proses verifikasi
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-blue-800 mb-3">Format & Ukuran File</h4>
                                <ul className="space-y-2 text-sm text-blue-700">
                                    <li className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                        Format: PDF, JPG, JPEG, PNG
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                        Ukuran maksimal: 10MB per file
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                        Resolusi minimal: 300 DPI untuk gambar
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                        Dokumen harus jelas dan terbaca
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-blue-800 mb-3">Keamanan Data</h4>
                                <ul className="space-y-2 text-sm text-blue-700">
                                    <li className="flex items-center">
                                        <Shield className="h-4 w-4 mr-2 text-green-600" />
                                        Data dienkripsi saat upload
                                    </li>
                                    <li className="flex items-center">
                                        <Shield className="h-4 w-4 mr-2 text-green-600" />
                                        Hanya untuk keperluan verifikasi
                                    </li>
                                    <li className="flex items-center">
                                        <Shield className="h-4 w-4 mr-2 text-green-600" />
                                        Tidak dibagikan ke pihak ketiga
                                    </li>
                                    <li className="flex items-center">
                                        <Shield className="h-4 w-4 mr-2 text-green-600" />
                                        Dihapus setelah verifikasi selesai
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium text-blue-800 mb-3">Tips Sukses Verifikasi</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                                <div className="flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
                                    <span>Pastikan semua informasi di dokumen cocok dengan data yang diisi</span>
                                </div>
                                <div className="flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
                                    <span>Upload dokumen terbaru (tidak lebih dari 6 bulan)</span>
                                </div>
                                <div className="flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
                                    <span>Foto/scan harus menampilkan seluruh dokumen tanpa terpotong</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Verification Type Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Building2 className="mr-2 h-5 w-5" />
                            Pilih Jenis Verifikasi
                        </CardTitle>
                        <CardDescription>
                            Pilih jalur verifikasi yang sesuai dengan status perusahaan Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card 
                                className={`cursor-pointer transition-all ${verificationType === 'legal' ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'}`}
                                onClick={() => handleVerificationTypeChange('legal')}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <input 
                                            type="radio" 
                                            checked={verificationType === 'legal'} 
                                            onChange={() => handleVerificationTypeChange('legal')}
                                            className="mt-1"
                                        />
                                        <div>
                                            <h3 className="font-medium text-lg">Verifikasi dengan Dokumen Legal</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Untuk bisnis yang memiliki kelengkapan legalitas (NPWP Perusahaan, NIB, dll.)
                                            </p>
                                            <div className="flex items-center mt-2 space-x-4">
                                                <div className="flex items-center">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                                                    <span className="text-sm text-green-600">Verified Badge</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Briefcase className="h-4 w-4 text-blue-500 mr-1" />
                                                    <span className="text-sm text-blue-600">5 Lowongan Aktif</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card 
                                className={`cursor-pointer transition-all ${verificationType === 'individual' ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'}`}
                                onClick={() => handleVerificationTypeChange('individual')}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <input 
                                            type="radio" 
                                            checked={verificationType === 'individual'} 
                                            onChange={() => handleVerificationTypeChange('individual')}
                                            className="mt-1"
                                        />
                                        <div>
                                            <h3 className="font-medium text-lg">Verifikasi dengan Bukti Kepemilikan</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Untuk usaha perorangan tanpa kelengkapan legalitas (NPWP/KTP Pribadi)
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <Briefcase className="h-4 w-4 text-blue-500 mr-1" />
                                                <span className="text-sm text-blue-600">3 Lowongan Aktif</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Profile Form - Common for both types */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Building2 className="mr-2 h-5 w-5" />
                                Profil Perusahaan/Usaha
                            </CardTitle>
                            <CardDescription>
                                Lengkapi informasi dasar perusahaan atau usaha Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Company Name */}
                            <div>
                                <Label htmlFor="legal_company_name">Nama Perusahaan/Usaha *</Label>
                                <Input
                                    id="legal_company_name"
                                    value={data.legal_company_name}
                                    onChange={(e) => setData('legal_company_name', e.target.value)}
                                    placeholder="PT. Contoh Perusahaan / Toko Saya"
                                    required
                                />
                                {errors.legal_company_name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.legal_company_name}</p>
                                )}
                            </div>

                            {/* Business Entity Type - only for legal entities */}
                            {verificationType === 'legal' && (
                                <div>
                                    <Label htmlFor="business_entity_type">Tipe Badan Usaha *</Label>
                                    <Select
                                        value={data.business_entity_type}
                                        onValueChange={(value) => setData('business_entity_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tipe badan usaha" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pt">PT (Perseroan Terbatas)</SelectItem>
                                            <SelectItem value="cv">CV (Comanditaire Vennootschap)</SelectItem>
                                            <SelectItem value="ud">UD (Usaha Dagang)</SelectItem>
                                            <SelectItem value="fa">FA (Firma)</SelectItem>
                                            <SelectItem value="yayasan">Yayasan</SelectItem>
                                            <SelectItem value="koperasi">Koperasi</SelectItem>
                                            <SelectItem value="lainnya">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.business_entity_type && (
                                        <p className="text-sm text-red-600 mt-1">{errors.business_entity_type}</p>
                                    )}
                                </div>
                            )}

                            {/* Industry */}
                            <div>
                                <Label htmlFor="industry">Industri/Kategori</Label>
                                <Select
                                    value={data.industry || ''}
                                    onValueChange={(value) => setData('industry', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih industri" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="teknologi">Teknologi Informasi</SelectItem>
                                        <SelectItem value="retail">Retail & E-commerce</SelectItem>
                                        <SelectItem value="f&b">Makanan & Minuman</SelectItem>
                                        <SelectItem value="manufacturing">Manufaktur</SelectItem>
                                        <SelectItem value="healthcare">Kesehatan</SelectItem>
                                        <SelectItem value="education">Pendidikan</SelectItem>
                                        <SelectItem value="finance">Keuangan</SelectItem>
                                        <SelectItem value="construction">Konstruksi</SelectItem>
                                        <SelectItem value="media">Media & Hiburan</SelectItem>
                                        <SelectItem value="lainnya">Lainnya</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Company Logo */}
                            <div>
                                <Label htmlFor="company_logo">Logo Perusahaan/Usaha</Label>
                                <Input
                                    id="company_logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange('company_logo', e.target.files?.[0] || null)}
                                />
                                <p className="text-sm text-gray-500 mt-1">JPG, PNG - Maksimal 2MB, rasio 1:1 disarankan</p>
                                {companyLogoPreview && (
                                    <div className="mt-3">
                                        <div className="w-28 h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                            <img
                                                src={companyLogoPreview}
                                                alt="Preview logo perusahaan"
                                                className="w-full h-full object-contain p-1"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Company Description */}
                            <div>
                                <Label htmlFor="company_description">Deskripsi Perusahaan/Usaha</Label>
                                <Textarea
                                    id="company_description"
                                    value={data.company_description}
                                    onChange={(e) => setData('company_description', e.target.value)}
                                    placeholder="Ceritakan tentang perusahaan/usaha Anda..."
                                    rows={4}
                                    maxLength={800}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {data.company_description.length}/800 karakter
                                </p>
                            </div>

                            {/* Office Address */}
                            <div>
                                <Label htmlFor="office_address">Alamat {verificationType === 'legal' ? 'Kantor' : 'Usaha'} *</Label>
                                <Textarea
                                    id="office_address"
                                    value={data.office_address}
                                    onChange={(e) => setData('office_address', e.target.value)}
                                    placeholder="Alamat lengkap kantor/tempat usaha"
                                    rows={3}
                                    required
                                />
                                {errors.office_address && (
                                    <p className="text-sm text-red-600 mt-1">{errors.office_address}</p>
                                )}
                            </div>

                            {/* Website */}
                            <div>
                                <Label htmlFor="website">Website/Media Sosial</Label>
                                <Input
                                    id="website"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    placeholder="https://website.com atau @instagram"
                                />
                                <p className="text-sm text-gray-500 mt-1">Opsional - untuk pemeriksaan cepat</p>
                            </div>

                            {/* Contact Email */}
                            <div>
                                <Label htmlFor="work_email">Email {verificationType === 'legal' ? 'Perusahaan' : 'Usaha'} *</Label>
                                <Input
                                    id="work_email"
                                    type="email"
                                    value={data.work_email}
                                    onChange={(e) => setData('work_email', e.target.value)}
                                    placeholder="info@perusahaan.com"
                                    required
                                />
                                {errors.work_email && (
                                    <p className="text-sm text-red-600 mt-1">{errors.work_email}</p>
                                )}
                            </div>

                            {/* Team Size */}
                            <div>
                                <Label htmlFor="team_size">Ukuran Tim</Label>
                                <Select
                                    value={data.team_size || ''}
                                    onValueChange={(value) => setData('team_size', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih ukuran tim" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 orang (Solo)</SelectItem>
                                        <SelectItem value="2-5">2-5 orang</SelectItem>
                                        <SelectItem value="6-10">6-10 orang</SelectItem>
                                        <SelectItem value="11-25">11-25 orang</SelectItem>
                                        <SelectItem value="26-50">26-50 orang</SelectItem>
                                        <SelectItem value="51-100">51-100 orang</SelectItem>
                                        <SelectItem value="100+">100+ orang</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* PIC Information - only for legal entities */}
                            {verificationType === 'legal' && (
                                <>
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-lg mb-4">Informasi Person in Charge (PIC)</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="pic_name">Nama PIC *</Label>
                                                <Input
                                                    id="pic_name"
                                                    value={data.pic_name}
                                                    onChange={(e) => setData('pic_name', e.target.value)}
                                                    placeholder="Nama lengkap PIC"
                                                    required
                                                />
                                                {errors.pic_name && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.pic_name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="pic_position">Jabatan PIC *</Label>
                                                <Input
                                                    id="pic_position"
                                                    value={data.pic_position}
                                                    onChange={(e) => setData('pic_position', e.target.value)}
                                                    placeholder="Direktur, HRD, Manager, dll"
                                                    required
                                                />
                                                {errors.pic_position && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.pic_position}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="pic_email">Email PIC *</Label>
                                                <Input
                                                    id="pic_email"
                                                    type="email"
                                                    value={data.pic_email}
                                                    onChange={(e) => setData('pic_email', e.target.value)}
                                                    placeholder="email@perusahaan.com"
                                                    required
                                                />
                                                {errors.pic_email && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.pic_email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="pic_phone">Telepon PIC *</Label>
                                                <Input
                                                    id="pic_phone"
                                                    value={data.pic_phone}
                                                    onChange={(e) => setData('pic_phone', e.target.value)}
                                                    placeholder="08123456789"
                                                    required
                                                />
                                                {errors.pic_phone && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.pic_phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {verificationType === 'legal' ? (
                        // Legal Document Verification Form
                        <>
                            {/* Document Upload - Legal */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Upload className="mr-2 h-5 w-5" />
                                        Dokumen Legal Perusahaan
                                    </CardTitle>
                                    <CardDescription>
                                        Upload dokumen legalitas perusahaan Anda. Proses verifikasi membutuhkan waktu sekitar dua hari kerja.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* NPWP Perusahaan */}
                                    <div>
                                        <Label htmlFor="npwp_document">Upload NPWP Perusahaan *</Label>
                                        <Input
                                            id="npwp_document"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange('npwp_document', e.target.files?.[0] || null)}
                                            required
                                        />
                                        <p className="text-sm text-gray-500 mt-1">PDF, JPG, JPEG, PNG - Maksimal 10MB</p>
                                        {errors.npwp_document && (
                                            <p className="text-sm text-red-600 mt-1">{errors.npwp_document}</p>
                                        )}
                                    </div>

                                    {/* Nomor NPWP */}
                                    <div>
                                        <Label htmlFor="npwp_number">Nomor NPWP Perusahaan *</Label>
                                        <Input
                                            id="npwp_number"
                                            value={data.npwp_number}
                                            onChange={(e) => setData('npwp_number', e.target.value)}
                                            placeholder="XX.XXX.XXX.X-XXX.XXX"
                                            required
                                        />
                                        {errors.npwp_number && (
                                            <p className="text-sm text-red-600 mt-1">{errors.npwp_number}</p>
                                        )}
                                    </div>

                                    {/* NIB Document Upload */}
                                    <div>
                                        <Label htmlFor="nib_document">Upload NIB (Nomor Induk Berusaha)</Label>
                                        <Input
                                            id="nib_document"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange('nib_document', e.target.files?.[0] || null)}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">PDF, JPG, JPEG, PNG - Maksimal 10MB</p>
                                    </div>

                                    {/* NIB Number */}
                                    <div>
                                        <Label htmlFor="nib_number">Nomor NIB (13 digit)</Label>
                                        <Input
                                            id="nib_number"
                                            value={data.nib_number}
                                            onChange={(e) => setData('nib_number', e.target.value)}
                                            placeholder="1234567890123"
                                            maxLength={13}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Opsional - Dapat mempercepat proses verifikasi</p>
                                    </div>

                                    {/* Additional Legal Documents */}
                                    <div>
                                        <Label htmlFor="establishment_deed">Akta Pendirian & Perubahan</Label>
                                        <Input
                                            id="establishment_deed"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange('establishment_deed', e.target.files?.[0] || null)}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Opsional - PDF, JPG, JPEG, PNG - Maksimal 10MB</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="kemenkumham_sk">SK Kemenkumham</Label>
                                        <Input
                                            id="kemenkumham_sk"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange('kemenkumham_sk', e.target.files?.[0] || null)}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Opsional - PDF, JPG, JPEG, PNG - Maksimal 10MB</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="domicile_certificate">Surat Keterangan Domisili</Label>
                                        <Input
                                            id="domicile_certificate"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange('domicile_certificate', e.target.files?.[0] || null)}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Opsional jika relevan - PDF, JPG, JPEG, PNG - Maksimal 10MB</p>
                                    </div>

                                    {/* Dokumen Tambahan */}
                                    <div>
                                        <Label htmlFor="supporting_documents">Dokumen Tambahan</Label>
                                        <Input
                                            id="supporting_documents"
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleMultipleFileChange('supporting_documents', e.target.files)}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Maksimal 5 file (PDF, JPG, JPEG, PNG) - 10MB per file<br/>
                                            Contoh: SIUP, NIB, foto kegiatan usaha, surat izin praktik
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        // Individual Business Form - Bukti Kepemilikan
                        <>
                            {/* Identity Document Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dokumen Identitas</CardTitle>
                                    <CardDescription>
                                        Pilih salah satu dokumen identitas yang akan digunakan untuk verifikasi
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Identity Document Choice */}
                                    <div>
                                        <Label className="text-base font-medium">Pilih Dokumen Identitas *</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                            <Card 
                                                className={`cursor-pointer transition-all ${data.identity_document_type === 'npwp' ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'}`}
                                                onClick={() => setData('identity_document_type', 'npwp')}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start space-x-3">
                                                        <input 
                                                            type="radio" 
                                                            checked={data.identity_document_type === 'npwp'} 
                                                            onChange={() => setData('identity_document_type', 'npwp')}
                                                            className="mt-1"
                                                        />
                                                        <div>
                                                            <h4 className="font-medium">NPWP Pribadi</h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Nomor Pokok Wajib Pajak Pribadi
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card 
                                                className={`cursor-pointer transition-all ${data.identity_document_type === 'ktp' ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'}`}
                                                onClick={() => setData('identity_document_type', 'ktp')}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start space-x-3">
                                                        <input 
                                                            type="radio" 
                                                            checked={data.identity_document_type === 'ktp'} 
                                                            onChange={() => setData('identity_document_type', 'ktp')}
                                                            className="mt-1"
                                                        />
                                                        <div>
                                                            <h4 className="font-medium">KTP Pribadi</h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Kartu Tanda Penduduk
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>

                                    {/* Document Upload based on choice */}
                                    {data.identity_document_type === 'npwp' ? (
                                        <>
                                            <div>
                                                <Label htmlFor="npwp_pribadi_document">Upload NPWP Pribadi *</Label>
                                                <Input
                                                    id="npwp_pribadi_document"
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) => handleFileChange('npwp_pribadi_document', e.target.files?.[0] || null)}
                                                    required
                                                />
                                                <p className="text-sm text-gray-500 mt-1">PDF, JPG, JPEG, PNG - Maksimal 10MB</p>
                                            </div>

                                            <div>
                                                <Label htmlFor="npwp_pribadi_number">Nomor NPWP Pribadi *</Label>
                                                <Input
                                                    id="npwp_pribadi_number"
                                                    value={data.npwp_pribadi_number}
                                                    onChange={(e) => setData('npwp_pribadi_number', e.target.value)}
                                                    placeholder="XX.XXX.XXX.X-XXX.XXX"
                                                    required
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <Label htmlFor="ktp_pribadi_document">Upload KTP Pribadi *</Label>
                                            <Input
                                                id="ktp_pribadi_document"
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => handleFileChange('ktp_pribadi_document', e.target.files?.[0] || null)}
                                                required
                                            />
                                            <p className="text-sm text-gray-500 mt-1">JPG, JPEG, PNG - Maksimal 10MB</p>
                                        </div>
                                    )}

                                    {/* NIB Pribadi */}
                                    <div>
                                        <Label htmlFor="nib_pribadi_number">NIB Pribadi</Label>
                                        <Input
                                            id="nib_pribadi_number"
                                            value={data.nib_pribadi_number}
                                            onChange={(e) => setData('nib_pribadi_number', e.target.value)}
                                            placeholder="Nomor Induk Berusaha Pribadi"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Opsional</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Business Activity Proof */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Bukti Aktivitas Bisnis</CardTitle>
                                    <CardDescription>
                                        Pilih jenis aktivitas bisnis dan upload bukti operasional Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Business Activity Type */}
                                    <div>
                                        <Label className="text-base font-medium">Jenis Aktivitas Bisnis *</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                            <Card 
                                                className={`cursor-pointer transition-all ${data.business_activity_type === 'online' ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'}`}
                                                onClick={() => setData('business_activity_type', 'online')}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start space-x-3">
                                                        <input 
                                                            type="radio" 
                                                            checked={data.business_activity_type === 'online'} 
                                                            onChange={() => setData('business_activity_type', 'online')}
                                                            className="mt-1"
                                                        />
                                                        <div>
                                                            <h4 className="font-medium">Bisnis Online</h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Instagram, Shopee, marketplace, dll.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card 
                                                className={`cursor-pointer transition-all ${data.business_activity_type === 'offline' ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'}`}
                                                onClick={() => setData('business_activity_type', 'offline')}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start space-x-3">
                                                        <input 
                                                            type="radio" 
                                                            checked={data.business_activity_type === 'offline'} 
                                                            onChange={() => setData('business_activity_type', 'offline')}
                                                            className="mt-1"
                                                        />
                                                        <div>
                                                            <h4 className="font-medium">Bisnis Offline</h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Toko fisik, warung, kantor, dll.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>

                                    {/* Business Photos based on type */}
                                    {data.business_activity_type === 'online' ? (
                                        <div>
                                            <Label htmlFor="online_business_photos">Foto Aktivitas Bisnis Online *</Label>
                                            <Input
                                                id="online_business_photos"
                                                type="file"
                                                multiple
                                                accept="image/*,video/*"
                                                onChange={(e) => handleMultipleFileChange('online_business_photos', e.target.files)}
                                                required
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Minimal 2 foto/video yang menunjukkan operasional bisnis online<br/>
                                                Contoh: screenshot akun Instagram, akun penjual Shopee, dll.<br/>
                                                Format: JPG, PNG, MP4 - Maksimal 10MB per file
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Label htmlFor="offline_business_photos">Foto Aktivitas Bisnis Offline *</Label>
                                            <Input
                                                id="offline_business_photos"
                                                type="file"
                                                multiple
                                                accept="image/*,video/*"
                                                onChange={(e) => handleMultipleFileChange('offline_business_photos', e.target.files)}
                                                required
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Minimal 2 foto/video aktivitas operasional bisnis offline<br/>
                                                Contoh: foto bangunan bisnis, toko, etalase produk, dll.<br/>
                                                Format: JPG, PNG, MP4 - Maksimal 10MB per file
                                            </p>
                                        </div>
                                    )}

                                    {/* Additional Supporting Documents */}
                                    <div>
                                        <Label htmlFor="individual_supporting_documents">Dokumen Pendukung Tambahan</Label>
                                        <Input
                                            id="individual_supporting_documents"
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleMultipleFileChange('individual_supporting_documents', e.target.files)}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Maksimal 5 file tambahan untuk membantu proses verifikasi<br/>
                                            Format: PDF, JPG, JPEG, PNG - Maksimal 10MB per file
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Agreements */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileCheck className="mr-2 h-5 w-5" />
                                Pernyataan & Persetujuan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-2">
                                <Checkbox 
                                    id="data_accuracy_agreement"
                                    checked={data.data_accuracy_agreement}
                                    onCheckedChange={(checked) => setData('data_accuracy_agreement', !!checked)}
                                />
                                <Label htmlFor="data_accuracy_agreement" className="text-sm leading-relaxed">
                                    Saya menyatakan bahwa semua data yang saya berikan adalah benar dan dapat dipertanggungjawabkan. 
                                    Saya bersedia menerima konsekuensi jika dikemudian hari terbukti data yang saya berikan tidak benar.
                                </Label>
                            </div>
                            {errors.data_accuracy_agreement && (
                                <p className="text-sm text-red-600">{errors.data_accuracy_agreement}</p>
                            )}

                            <div className="flex items-start space-x-2">
                                <Checkbox 
                                    id="terms_agreement"
                                    checked={data.terms_agreement}
                                    onCheckedChange={(checked) => setData('terms_agreement', !!checked)}
                                />
                                <Label htmlFor="terms_agreement" className="text-sm leading-relaxed">
                                    Saya telah membaca dan menyetujui{' '}
                                    <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                                        Syarat dan Ketentuan
                                    </a>{' '}
                                    serta{' '}
                                    <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                                        Kebijakan Privasi
                                    </a>{' '}
                                    KarirConnect.
                                </Label>
                            </div>
                            {errors.terms_agreement && (
                                <p className="text-sm text-red-600">{errors.terms_agreement}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" asChild>
                            <a href={route('admin.dashboard')}>Batal</a>
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing || !data.data_accuracy_agreement || !data.terms_agreement}
                            className="min-w-[150px]"
                        >
                            {processing ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Mengirim...
                                </div>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Kirim Verifikasi
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Upload Progress */}
                    {progress && (
                        <div className="mt-4">
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600">{progress.percentage}%</span>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}
