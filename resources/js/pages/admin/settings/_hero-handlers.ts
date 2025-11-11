// Hero Image Handlers - to be integrated into edit.tsx
// Copy these functions into the edit.tsx file after the favicon handlers

const triggerHeroImageInput = () => {
    heroImageInputRef.current?.click();
};

const processHeroImageFile = (file: File) => {
    const error = validateFile(file);
    setHeroImageError(error);

    if (error) {
        toast.error('File Hero Image Tidak Valid', {
            description: error,
            duration: 4000,
        });
        return;
    }

    setData('hero_image', file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    toast.success('Hero Image Siap Diupload', {
        description: `File ${file.name} telah dipilih. Klik "Simpan Pengaturan" untuk menyimpan.`,
        duration: 3000,
    });
};

const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        processHeroImageFile(file);
    } else {
        setData('hero_image', null);
        setHeroImagePreview(null);
        setHeroImageError(null);
    }
};

const handleHeroImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHeroImageDragOver(true);
};

const handleHeroImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHeroImageDragOver(false);
};

const handleHeroImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHeroImageDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        processHeroImageFile(files[0]);
    }
};

const removeHeroImagePreview = () => {
    setData('hero_image', null);
    setHeroImagePreview(null);
    setHeroImageError(null);
    if (heroImageInputRef.current) {
        heroImageInputRef.current.value = '';
    }

    toast.info('Hero Image Dihapus', {
        description: 'Preview hero image telah dihapus. Pilih file baru untuk mengupload hero image.',
        duration: 3000,
    });
};
