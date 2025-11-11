import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { verificationColumns, VerificationCompany } from '@/components/tables/verification-review-columns';
import { 
    Shield, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Download, 
    Eye, 
    FileText, 
    Building2,
    User,
    Calendar,
    AlertCircle,
    ArrowLeft,
    X,
    ChevronLeft,
    ChevronRight,
    Plus,
    Minus,
    RotateCw,
    File
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { route } from 'ziggy-js';

interface Props {
    companies: {
        data: VerificationCompany[];
        links: any;
        meta: any;
    };
    filters: {
        status?: string;
        search?: string;
    };
}

export default function VerificationReview({ companies, filters }: Props) {
    const [selectedCompany, setSelectedCompany] = useState<VerificationCompany | null>(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
    const [documents, setDocuments] = useState<any[]>([]);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const { toast } = useToast();

    const handleStatusChange = async (companyId: number, status: 'approved' | 'rejected') => {
        setProcessing(true);
        
        try {
            await router.post(route('admin.companies.verification.update', companyId), {
                status,
                admin_notes: adminNotes,
            });
            
            toast({
                title: "Berhasil",
                description: `Verifikasi perusahaan telah ${status === 'approved' ? 'disetujui' : 'ditolak'}`,
            });
            
            setSelectedCompany(null);
            setAdminNotes('');
        } catch (error) {
            toast({
                title: "Error",
                description: "Terjadi kesalahan saat memperbarui status verifikasi",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    const openLightbox = (docs: any[], startIndex: number) => {
        setDocuments(docs);
        setCurrentDocumentIndex(startIndex);
        setLightboxOpen(true);
        setZoom(1);
        setRotation(0);
    };

    const goToNext = () => {
        setCurrentDocumentIndex((prev) => (prev + 1) % documents.length);
        setZoom(1);
        setRotation(0);
    };

    const goToPrevious = () => {
        setCurrentDocumentIndex((prev) => (prev - 1 + documents.length) % documents.length);
        setZoom(1);
        setRotation(0);
    };

    // Handle custom event from table actions
    useEffect(() => {
        const handleViewCompany = (event: CustomEvent) => {
            setSelectedCompany(event.detail);
        };

        window.addEventListener('viewCompany', handleViewCompany as EventListener);
        return () => window.removeEventListener('viewCompany', handleViewCompany as EventListener);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    setLightboxOpen(false);
                    break;
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
                case '+':
                case '=':
                    setZoom(prev => Math.min(prev + 0.25, 3));
                    break;
                case '-':
                    setZoom(prev => Math.max(prev - 0.25, 0.25));
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, documents.length]);

    const currentDocument = documents[currentDocumentIndex];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const CustomLightbox = () => {
        if (!lightboxOpen || !currentDocument) return null;
        
        return (
            <div 
                className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setLightboxOpen(false);
                    }
                }}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <h3 className="text-xl font-semibold">{currentDocument.name}</h3>
                            <p className="text-sm text-gray-300">
                                {currentDocumentIndex + 1} / {documents.length} • Upload: {formatDate(currentDocument.uploaded_at)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {currentDocument.path.match(/\.(jpg|jpeg|png|gif)$/i) && (
                                <>
                                    <button
                                        onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        title="Zoom In"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.25))}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        title="Zoom Out"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setRotation(prev => prev + 90)}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        title="Rotate"
                                    >
                                        <RotateCw className="w-5 h-5" />
                                    </button>
                                    <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
                                </>
                            )}
                            <button
                                onClick={() => setLightboxOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                title="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                {documents.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Content */}
                <div className="w-full h-full flex items-center justify-center p-20">
                    {currentDocument.path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img
                            src={`/storage/${currentDocument.path}`}
                            alt={currentDocument.name}
                            className="max-w-full max-h-full object-contain transition-transform duration-200"
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                cursor: zoom > 1 ? 'grab' : 'default'
                            }}
                        />
                    ) : currentDocument.path.match(/\.pdf$/i) ? (
                        <iframe
                            src={`/storage/${currentDocument.path}`}
                            className="w-full h-full border-none"
                            title={currentDocument.name}
                        />
                    ) : (
                        <div className="text-center text-white">
                            <div className="mb-4">
                                <File className="w-16 h-16 mx-auto mb-2" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">{currentDocument.original_name}</h3>
                            <a
                                href={`/storage/${currentDocument.path}`}
                                download={currentDocument.original_name}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download File
                            </a>
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {documents.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <div className="flex justify-center gap-2 overflow-x-auto">
                            {documents.map((doc, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentDocumentIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                                        index === currentDocumentIndex ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    {doc.path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                        <img
                                            src={`/storage/${doc.path}`}
                                            alt={doc.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                            <File className="w-6 h-6 text-gray-300" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Filter the data based on current filter
    const filteredData = companies.data.filter(company => {
        if (!filters.status) return company.verification_status === 'pending';
        return company.verification_status === filters.status;
    });

    if (selectedCompany) {
        const documents = selectedCompany.verification_documents || [];
        
        return (
            <AppLayout>
                <Head title={`Review Verifikasi - ${selectedCompany.name}`} />
                
                <CustomLightbox />

                <div className="space-y-6 p-6">
                    <div className="flex flex-col space-y-4">
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedCompany(null)}
                            className="w-fit"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl font-bold truncate">{selectedCompany.name}</h1>
                                <p className="text-sm sm:text-base text-gray-600">Review verifikasi perusahaan</p>
                            </div>
                            <Badge className={`w-fit ${
                                selectedCompany.verification_status === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                                    : selectedCompany.verification_status === 'verified'
                                    ? 'bg-green-100 text-green-800 border-green-300'
                                    : 'bg-red-100 text-red-800 border-red-300'
                            }`}>
                                {selectedCompany.verification_status === 'pending' && <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
                                {selectedCompany.verification_status === 'verified' && <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
                                {selectedCompany.verification_status === 'rejected' && <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
                                <span className="text-xs sm:text-sm">
                                    {selectedCompany.verification_status === 'pending' ? 'Menunggu Review' :
                                     selectedCompany.verification_status === 'verified' ? 'Disetujui' : 'Ditolak'}
                                </span>
                            </Badge>
                        </div>
                    </div>

                    <Tabs defaultValue="data" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="data" className="text-xs sm:text-sm">
                                <span className="hidden sm:inline">Data Verifikasi</span>
                                <span className="sm:hidden">Data</span>
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="text-xs sm:text-sm">
                                <span className="hidden sm:inline">Dokumen ({documents.length})</span>
                                <span className="sm:hidden">Docs ({documents.length})</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="data" className="space-y-4">
                            {/* Company Profile Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Building2 className="mr-2 h-5 w-5" />
                                        Profil Perusahaan/Usaha
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <Label className="text-xs sm:text-sm font-medium text-gray-700">Nama Perusahaan/Usaha</Label>
                                            <p className="mt-1 text-sm sm:text-base text-gray-900 font-medium">{selectedCompany.name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs sm:text-sm font-medium text-gray-700">Tipe Verifikasi</Label>
                                            <p className="mt-1">
                                                <Badge variant="secondary" className="text-xs sm:text-sm">
                                                    {selectedCompany.verification_data?.verification_type === 'legal' ? 'Verifikasi dengan Dokumen Legal' : 'Verifikasi dengan Bukti Kepemilikan'}
                                                </Badge>
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-xs sm:text-sm font-medium text-gray-700">Email Perusahaan/Usaha</Label>
                                            <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.email || '-'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs sm:text-sm font-medium text-gray-700">Website/Media Sosial</Label>
                                            <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.website || '-'}</p>
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                            <Label className="text-xs sm:text-sm font-medium text-gray-700">Alamat</Label>
                                            <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.address || '-'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs sm:text-sm font-medium text-gray-700">Industri</Label>
                                            <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.industry || '-'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs sm:text-sm font-medium text-gray-700">Ukuran Tim</Label>
                                            <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.size || '-'}</p>
                                        </div>
                                        {selectedCompany.description && (
                                            <div className="col-span-1 sm:col-span-2">
                                                <Label className="text-xs sm:text-sm font-medium text-gray-700">Deskripsi Perusahaan</Label>
                                                <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Legal Entity Specific Information */}
                            {selectedCompany.verification_data?.verification_type === 'legal' && (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <FileText className="mr-2 h-5 w-5" />
                                                Informasi Badan Usaha
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                {selectedCompany.verification_data?.business_entity_type && (
                                                    <div>
                                                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Tipe Badan Usaha</Label>
                                                        <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.verification_data.business_entity_type.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {selectedCompany.verification_data?.npwp_number && (
                                                    <div>
                                                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Nomor NPWP Perusahaan</Label>
                                                        <p className="mt-1 text-sm sm:text-base text-gray-900 font-mono">{selectedCompany.verification_data.npwp_number}</p>
                                                    </div>
                                                )}
                                                {selectedCompany.verification_data?.nib_number && (
                                                    <div>
                                                        <Label className="text-xs sm:text-sm font-medium text-gray-700">NIB (Nomor Induk Berusaha)</Label>
                                                        <p className="mt-1 text-sm sm:text-base text-gray-900 font-mono">{selectedCompany.verification_data.nib_number}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <User className="mr-2 h-5 w-5" />
                                                Person in Charge (PIC)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                {selectedCompany.verification_data?.pic_name && (
                                                    <div>
                                                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Nama PIC</Label>
                                                        <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.verification_data.pic_name}</p>
                                                    </div>
                                                )}
                                                {selectedCompany.verification_data?.pic_position && (
                                                    <div>
                                                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Jabatan PIC</Label>
                                                        <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.verification_data.pic_position}</p>
                                                    </div>
                                                )}
                                                {selectedCompany.verification_data?.pic_email && (
                                                    <div>
                                                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Email PIC</Label>
                                                        <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.verification_data.pic_email}</p>
                                                    </div>
                                                )}
                                                {selectedCompany.verification_data?.pic_phone && (
                                                    <div>
                                                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Telepon PIC</Label>
                                                        <p className="mt-1 text-sm sm:text-base text-gray-900">{selectedCompany.verification_data.pic_phone}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {/* Individual Business Specific Information */}
                            {selectedCompany.verification_data?.verification_type === 'individual' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <User className="mr-2 h-5 w-5" />
                                            Informasi Usaha Perorangan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            {selectedCompany.verification_data?.identity_document_type && (
                                                <div>
                                                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Jenis Dokumen Identitas</Label>
                                                    <p className="mt-1">
                                                        <Badge variant="outline" className="text-xs sm:text-sm">
                                                            {selectedCompany.verification_data.identity_document_type === 'npwp' ? 'NPWP Pribadi' : 'KTP Pribadi'}
                                                        </Badge>
                                                    </p>
                                                </div>
                                            )}
                                            {selectedCompany.verification_data?.npwp_pribadi_number && (
                                                <div>
                                                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Nomor NPWP Pribadi</Label>
                                                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-mono">{selectedCompany.verification_data.npwp_pribadi_number}</p>
                                                </div>
                                            )}
                                            {selectedCompany.verification_data?.nib_pribadi_number && (
                                                <div>
                                                    <Label className="text-xs sm:text-sm font-medium text-gray-700">NIB Pribadi</Label>
                                                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-mono">{selectedCompany.verification_data.nib_pribadi_number}</p>
                                                </div>
                                            )}
                                            {selectedCompany.verification_data?.business_activity_type && (
                                                <div>
                                                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Jenis Aktivitas Bisnis</Label>
                                                    <p className="mt-1">
                                                        <Badge variant="outline" className="text-xs sm:text-sm">
                                                            {selectedCompany.verification_data.business_activity_type === 'online' ? 'Bisnis Online' : 'Bisnis Offline'}
                                                        </Badge>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Submission Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Informasi Pengajuan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <Label className="text-xs sm:text-sm font-medium text-gray-700">Status Verifikasi</Label>
                                            <p className="mt-1">
                                                <Badge className={`text-xs sm:text-sm ${
                                                    selectedCompany.verification_status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : selectedCompany.verification_status === 'verified'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {selectedCompany.verification_status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                                    {selectedCompany.verification_status === 'verified' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                                    {selectedCompany.verification_status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                                    {selectedCompany.verification_status === 'pending' ? 'Menunggu Review' :
                                                     selectedCompany.verification_status === 'verified' ? 'Disetujui' : 'Ditolak'}
                                                </Badge>
                                            </p>
                                        </div>
                                        {selectedCompany.verification_data?.submitted_at && (
                                            <div>
                                                <Label className="text-xs sm:text-sm font-medium text-gray-700">Tanggal Pengajuan</Label>
                                                <p className="mt-1 text-sm sm:text-base text-gray-900">{formatDate(selectedCompany.verification_data.submitted_at)}</p>
                                            </div>
                                        )}
                                        <div>
                                            <Label className="text-xs sm:text-sm font-medium text-gray-700">Jumlah Dokumen</Label>
                                            <p className="mt-1 text-sm sm:text-base text-gray-900">{documents.length} dokumen</p>
                                        </div>
                                        {selectedCompany.is_verified && (
                                            <div>
                                                <Label className="text-xs sm:text-sm font-medium text-gray-700">Verified Badge</Label>
                                                <p className="mt-1">
                                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        {selectedCompany.verification_data?.verification_type === 'legal' ? 'Verified Badge' : 'Basic Verified'}
                                                    </Badge>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dokumen Verifikasi</CardTitle>
                                    <CardDescription>
                                        Klik pada dokumen untuk melihat dalam tampilan penuh
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {documents.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                            {documents.map((document, index) => (
                                                <div
                                                    key={index}
                                                    className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer group"
                                                    onClick={() => openLightbox(documents, index)}
                                                >
                                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                                                            {document.path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                                <img 
                                                                    src={`/storage/${document.path}`} 
                                                                    alt={document.name}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                                {document.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {document.original_name}
                                                            </p>
                                                            <p className="text-xs text-gray-400 hidden sm:block">
                                                                {formatDate(document.uploaded_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 sm:py-8">
                                            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                                            <p className="text-sm sm:text-base text-gray-500">Tidak ada dokumen yang diupload</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {selectedCompany.verification_status === 'pending' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Review Verifikasi</CardTitle>
                                <CardDescription>
                                    Berikan catatan admin dan tentukan status verifikasi
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="adminNotes" className="text-sm font-medium">Catatan Admin</Label>
                                    <Textarea
                                        id="adminNotes"
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Berikan catatan terkait keputusan verifikasi..."
                                        rows={4}
                                        className="text-sm"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <Button
                                        onClick={() => handleStatusChange(selectedCompany.id, 'approved')}
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700 text-sm flex-1 sm:flex-none"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">{processing ? 'Menyetujui...' : 'Setujui Verifikasi'}</span>
                                        <span className="sm:hidden">{processing ? 'Menyetujui...' : 'Setujui'}</span>
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusChange(selectedCompany.id, 'rejected')}
                                        disabled={processing}
                                        variant="destructive"
                                        className="text-sm flex-1 sm:flex-none"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">{processing ? 'Menolak...' : 'Tolak Verifikasi'}</span>
                                        <span className="sm:hidden">{processing ? 'Menolak...' : 'Tolak'}</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Review Verifikasi Perusahaan" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Review Verifikasi Perusahaan</h1>
                        <p className="text-gray-600">Kelola dan review permintaan verifikasi perusahaan</p>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => router.get(route('admin.companies.verification.index'), { status: 'pending' })}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                (!filters.status || filters.status === 'pending')
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Clock className="w-4 h-4 inline mr-2" />
                            Menunggu Review
                            <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                                {companies.data.filter(c => c.verification_status === 'pending').length}
                            </Badge>
                        </button>
                        <button
                            onClick={() => router.get(route('admin.companies.verification.index'), { status: 'verified' })}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                filters.status === 'verified'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <CheckCircle2 className="w-4 h-4 inline mr-2" />
                            Disetujui
                            <Badge className="ml-2 bg-green-100 text-green-800">
                                {companies.data.filter(c => c.verification_status === 'verified').length}
                            </Badge>
                        </button>
                        <button
                            onClick={() => router.get(route('admin.companies.verification.index'), { status: 'rejected' })}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                filters.status === 'rejected'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <XCircle className="w-4 h-4 inline mr-2" />
                            Ditolak
                            <Badge className="ml-2 bg-red-100 text-red-800">
                                {companies.data.filter(c => c.verification_status === 'rejected').length}
                            </Badge>
                        </button>
                    </nav>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {filters.status === 'verified' ? 'Perusahaan Terverifikasi' :
                             filters.status === 'rejected' ? 'Verifikasi Ditolak' :
                             'Menunggu Review'}
                        </CardTitle>
                        <CardDescription>
                            {filteredData.length} perusahaan dengan status{' '}
                            {filters.status === 'verified' ? 'disetujui' :
                             filters.status === 'rejected' ? 'ditolak' :
                             'menunggu review'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={verificationColumns}
                            data={filteredData}
                            searchKey="name"
                            searchPlaceholder="Cari nama perusahaan..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}