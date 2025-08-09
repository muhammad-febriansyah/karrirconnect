import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface ImageUploadProps {
    value?: File | null;
    onChange: (file: File | null) => void;
    currentImage?: string;
    onRemove?: () => void;
    className?: string;
    maxSize?: number; // in MB
    acceptedTypes?: string[];
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    currentImage,
    onRemove,
    className,
    maxSize = 2,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    disabled = false,
}: ImageUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                // Validate file size
                if (file.size > maxSize * 1024 * 1024) {
                    toast.error(`Ukuran file terlalu besar. Maksimal ${maxSize}MB`);
                    return;
                }

                // Create preview URL
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                onChange(file);
                toast.success('Gambar berhasil dipilih');
            }
        },
        [maxSize, onChange]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: acceptedTypes.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as Record<string, string[]>),
        maxFiles: 1,
        disabled,
    });

    const removeImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        onChange(null);
        onRemove?.();
        toast.success('Gambar dihapus');
    };

    const displayImage = previewUrl || (currentImage ? `/storage/${currentImage}` : null);

    return (
        <div className={cn('space-y-4', className)}>
            {displayImage ? (
                <div className="relative group">
                    <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                        <img
                            src={displayImage}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeImage}
                                disabled={disabled}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Hapus
                            </Button>
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 text-center">
                        {value ? `${value.name} (${(value.size / 1024 / 1024).toFixed(2)}MB)` : 'Gambar saat ini'}
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200',
                        isDragActive && !isDragReject && 'border-blue-400 bg-blue-50',
                        isDragReject && 'border-red-400 bg-red-50',
                        !isDragActive && !isDragReject && 'border-gray-300 hover:border-gray-400',
                        disabled && 'cursor-not-allowed opacity-50'
                    )}
                >
                    <input {...getInputProps()} />
                    
                    <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            {isDragActive ? (
                                <Upload className="h-6 w-6 text-blue-500" />
                            ) : (
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-900">
                                {isDragActive
                                    ? 'Lepas gambar di sini...'
                                    : 'Upload gambar'}
                            </p>
                            <p className="text-sm text-gray-600">
                                Drag & drop atau klik untuk memilih gambar
                            </p>
                            <p className="text-xs text-gray-500">
                                Format: JPG, PNG, WEBP • Maksimal {maxSize}MB
                            </p>
                        </div>

                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            disabled={disabled}
                            onClick={(e) => e.stopPropagation()}
                        >
                            Pilih Gambar
                        </Button>
                    </div>
                </div>
            )}

            {isDragReject && (
                <p className="text-sm text-red-600 text-center">
                    Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.
                </p>
            )}
        </div>
    );
}