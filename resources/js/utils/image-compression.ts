/**
 * Compress image file to reduce size while maintaining quality
 */
export const compressImage = (
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.8
): Promise<File> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        resolve(file);
                    }
                },
                file.type,
                quality
            );
        };

        img.src = URL.createObjectURL(file);
    });
};

/**
 * Generate image thumbnail
 */
export const generateThumbnail = (
    file: File,
    width: number = 300,
    height: number = 200
): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = width;
            canvas.height = height;
            
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };

        img.src = URL.createObjectURL(file);
    });
};

/**
 * Validate image dimensions
 */
export const validateImageDimensions = (
    file: File,
    minWidth?: number,
    minHeight?: number,
    maxWidth?: number,
    maxHeight?: number
): Promise<{ isValid: boolean; message?: string; dimensions: { width: number; height: number } }> => {
    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
            const { width, height } = img;
            
            if (minWidth && width < minWidth) {
                resolve({
                    isValid: false,
                    message: `Lebar gambar minimal ${minWidth}px (saat ini: ${width}px)`,
                    dimensions: { width, height }
                });
                return;
            }
            
            if (minHeight && height < minHeight) {
                resolve({
                    isValid: false,
                    message: `Tinggi gambar minimal ${minHeight}px (saat ini: ${height}px)`,
                    dimensions: { width, height }
                });
                return;
            }
            
            if (maxWidth && width > maxWidth) {
                resolve({
                    isValid: false,
                    message: `Lebar gambar maksimal ${maxWidth}px (saat ini: ${width}px)`,
                    dimensions: { width, height }
                });
                return;
            }
            
            if (maxHeight && height > maxHeight) {
                resolve({
                    isValid: false,
                    message: `Tinggi gambar maksimal ${maxHeight}px (saat ini: ${height}px)`,
                    dimensions: { width, height }
                });
                return;
            }
            
            resolve({
                isValid: true,
                dimensions: { width, height }
            });
        };
        
        img.onerror = () => {
            resolve({
                isValid: false,
                message: 'File gambar tidak valid',
                dimensions: { width: 0, height: 0 }
            });
        };

        img.src = URL.createObjectURL(file);
    });
};