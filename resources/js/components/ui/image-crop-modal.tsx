import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Crop, RotateCw } from 'lucide-react';
import { useState, useCallback } from 'react';

interface ImageCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    onCropComplete: (croppedFile: File) => void;
}

export function ImageCropModal({ 
    isOpen, 
    onClose, 
    imageUrl, 
    onCropComplete 
}: ImageCropModalProps) {
    const [rotation, setRotation] = useState(0);
    
    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleCrop = useCallback(() => {
        // For now, we'll just return the original file
        // In a real implementation, you'd use a library like react-image-crop
        fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                onCropComplete(file);
                onClose();
            });
    }, [imageUrl, onCropComplete, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Crop className="h-5 w-5" />
                        Edit Gambar
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={imageUrl}
                                alt="Crop preview"
                                className="max-h-96 max-w-full object-contain"
                                style={{ transform: `rotate(${rotation}deg)` }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRotate}
                        >
                            <RotateCw className="h-4 w-4 mr-2" />
                            Putar
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleCrop}>
                        Gunakan Gambar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}