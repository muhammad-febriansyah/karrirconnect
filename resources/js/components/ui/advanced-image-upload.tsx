import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { compressImage, validateImageDimensions } from '@/utils/image-compression';
import { Check, Upload, X, Image as ImageIcon, AlertCircle, Loader2, Info } from 'lucide-react';
import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface AdvancedImageUploadProps {
    value?: File | null;
    onChange: (file: File | null) => void;
    currentImage?: string;
    onRemove?: () => void;
    className?: string;
    maxSize?: number; // in MB
    acceptedTypes?: string[];
    disabled?: boolean;
    showProgress?: boolean;
    allowMultiple?: boolean;
    minWidth?: number;
    minHeight?: number;
    enableCompression?: boolean;
}

export function AdvancedImageUpload({
    value,
    onChange,
    currentImage,
    onRemove,
    className,
    maxSize = 5,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    disabled = false,
    showProgress = true,
    allowMultiple = false,
    minWidth = 800,
    minHeight = 600,
    enableCompression = true,
}: AdvancedImageUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageInfo, setImageInfo] = useState<{ width: number; height: number; originalSize: number; compressedSize?: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Simulate upload progress for demo
    const simulateUploadProgress = () => {
        setIsProcessing(true);
        setUploadProgress(0);
        
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsProcessing(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);
    };

    const validateFile = (file: File): string | null => {
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            return `Ukuran file terlalu besar. Maksimal ${maxSize}MB`;
        }

        // Check file type
        if (!acceptedTypes.includes(file.type)) {
            return `Format file tidak didukung. Gunakan: ${acceptedTypes.join(', ')}`;
        }

        return null;
    };

    const processFile = async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            toast.error(validationError);
            return;
        }

        setError(null);
        setIsProcessing(true);
        
        try {
            // Validate image dimensions
            const dimensionCheck = await validateImageDimensions(file, minWidth, minHeight);
            if (!dimensionCheck.isValid) {
                setError(dimensionCheck.message || 'Dimensi gambar tidak valid');
                toast.error(dimensionCheck.message || 'Dimensi gambar tidak valid');
                setIsProcessing(false);
                return;
            }

            // Store original image info
            setImageInfo({
                width: dimensionCheck.dimensions.width,
                height: dimensionCheck.dimensions.height,
                originalSize: file.size
            });

            let processedFile = file;
            
            // Compress if enabled and file is large
            if (enableCompression && file.size > 1024 * 1024) { // > 1MB
                toast.info('Mengoptimalkan gambar...');
                processedFile = await compressImage(file);
                
                setImageInfo(prev => prev ? {
                    ...prev,
                    compressedSize: processedFile.size
                } : null);
            }

            // Create preview URL
            const url = URL.createObjectURL(processedFile);
            setPreviewUrl(url);
            
            // Simulate upload progress
            if (showProgress) {
                simulateUploadProgress();
            }
            
            onChange(processedFile);
            toast.success('Gambar berhasil diproses');
        } catch (error) {
            setError('Gagal memproses gambar');
            toast.error('Gagal memproses gambar');
            setIsProcessing(false);
        }
    };

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            if (rejectedFiles.length > 0) {
                const error = rejectedFiles[0].errors[0];
                setError(error.message);
                toast.error('File ditolak: ' + error.message);
                return;
            }

            const file = acceptedFiles[0];
            if (file) {
                processFile(file);
            }
        },
        [maxSize, onChange, acceptedTypes, showProgress]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: acceptedTypes.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as Record<string, string[]>),
        maxFiles: 1,
        disabled: disabled || isProcessing,
    });

    const removeImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setUploadProgress(0);
        setError(null);
        onChange(null);
        onRemove?.();
        toast.success('Gambar dihapus');
    };

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const displayImage = previewUrl || (currentImage ? (currentImage.startsWith('http') ? currentImage : `/storage/${currentImage}`) : null);
    const hasImage = displayImage && !isProcessing;

    return (
        <div className={cn('space-y-4', className)}>
            {hasImage ? (
                <div className="relative group">
                    <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
                        <img
                            src={displayImage}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Action buttons */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleFileInputClick}
                                disabled={disabled}
                                className="bg-white/90 hover:bg-white text-gray-900"
                            >
                                <Upload className="h-3 w-3 mr-1" />
                                Ganti
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeImage}
                                disabled={disabled}
                                className="bg-red-500/90 hover:bg-red-600"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* File info */}
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                                {value && imageInfo ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-3 w-3 text-green-400" />
                                            <span>{value.name}</span>
                                        </div>
                                        <div className="text-xs opacity-75 space-y-0.5">
                                            <div>{imageInfo.width} × {imageInfo.height}px</div>
                                            <div>
                                                {imageInfo.compressedSize ? (
                                                    <>
                                                        Original: {(imageInfo.originalSize / 1024 / 1024).toFixed(2)}MB
                                                        <br />
                                                        Optimized: {(imageInfo.compressedSize / 1024 / 1024).toFixed(2)}MB
                                                    </>
                                                ) : (
                                                    <>{(value.size / 1024 / 1024).toFixed(2)}MB</>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : value ? (
                                    <div className="flex items-center gap-2">
                                        <Check className="h-3 w-3 text-green-400" />
                                        <span>{value.name}</span>
                                        <span className="text-xs opacity-75">
                                            ({(value.size / 1024 / 1024).toFixed(2)}MB)
                                        </span>
                                    </div>
                                ) : (
                                    <span>Gambar saat ini</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hidden file input for replace action */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedTypes.join(',')}
                        onChange={handleFileInputChange}
                        className="hidden"
                        disabled={disabled}
                    />
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        'relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300',
                        'hover:border-gray-400 hover:bg-gray-50/50',
                        isDragActive && !isDragReject && 'border-blue-400 bg-blue-50 scale-[1.02]',
                        isDragReject && 'border-red-400 bg-red-50',
                        !isDragActive && !isDragReject && 'border-gray-300',
                        disabled && 'cursor-not-allowed opacity-50',
                        isProcessing && 'pointer-events-none'
                    )}
                >
                    <input {...getInputProps()} />
                    
                    <div className="space-y-6">
                        {/* Icon */}
                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            {isProcessing ? (
                                <Loader2 className="h-8 w-8 text-white animate-spin" />
                            ) : isDragActive ? (
                                <Upload className="h-8 w-8 text-white animate-bounce" />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-white" />
                            )}
                        </div>
                        
                        {/* Text content */}
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {isProcessing
                                    ? 'Memproses gambar...'
                                    : isDragActive
                                    ? 'Lepas gambar di sini'
                                    : 'Upload Gambar Unggulan'}
                            </h3>
                            
                            {!isProcessing && (
                                <>
                                    <p className="text-gray-600">
                                        Drag & drop gambar atau klik untuk memilih file
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                                            <span>Format: JPG, PNG, WEBP</span>
                                            <span>•</span>
                                            <span>Maksimal {maxSize}MB</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mx-4">
                                            <Info className="h-3 w-3 flex-shrink-0" />
                                            <span>Rekomendasi: minimal {minWidth} × {minHeight}px</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Upload progress */}
                        {isProcessing && showProgress && (
                            <div className="w-full max-w-xs mx-auto space-y-2">
                                <Progress value={uploadProgress} className="h-2" />
                                <p className="text-sm text-gray-600">{uploadProgress}%</p>
                            </div>
                        )}

                        {/* Upload button */}
                        {!isProcessing && !isDragActive && (
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="lg"
                                disabled={disabled}
                                className="mt-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Pilih Gambar
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Drag rejected message */}
            {isDragReject && !error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.</span>
                </div>
            )}
        </div>
    );
}