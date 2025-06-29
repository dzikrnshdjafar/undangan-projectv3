// resources/js/Pages/Themes/Show.jsx

import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Preview } from '../Previews';
import DesktopPreview from '../Previews/DesktopPreview';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { getImageUrl } from '@/Utils/imageHelper';

export default function Show() {
    // 2. Hapus `storage_path`. Kita tidak membutuhkannya lagi.
    const { theme } = usePage().props;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!theme) {
            setIsLoading(false);
            return;
        }

        const imageUrls = new Set();

        // Fungsi rekursif untuk mencari semua path gambar
        const findImagePaths = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            for (const key in obj) {
                if (key === 'path' && typeof obj[key] === 'string' && obj[key]) {
                    // 3. Gunakan helper untuk membuat URL yang benar
                    imageUrls.add(getImageUrl(obj[key])); 
                } else if (typeof obj[key] === 'object') {
                    findImagePaths(obj[key]);
                }
            }
        };

        findImagePaths(theme.sections);

        // 4. Gunakan helper untuk path gambar background utama
        if (theme.background_image_path) {
            imageUrls.add(getImageUrl(theme.background_image_path));
        }

        if (imageUrls.size === 0) {
            setIsLoading(false);
            return;
        }

        const promises = Array.from(imageUrls).map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = resolve;
            });
        });

        Promise.all(promises).then(() => {
            setTimeout(() => setIsLoading(false), 500);
        });

    }, [theme]); // Hapus `storage_path` dari dependency array

    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    // 5. Buat URL lengkap untuk background sekali saja
    const fullBackgroundImageUrl = getImageUrl(theme.background_image_path);

    return (
        <div className="relative w-full bg-gray-100 md:flex">
            <div className="hidden md:block md:w-1/2 lg:w-6/12 xl:w-11/12">
                {/* 6. Teruskan URL yang sudah jadi ke komponen anak */}
                <DesktopPreview backgroundImageUrl={fullBackgroundImageUrl} />
            </div>
            <div className="w-full md:w-3/4 lg:w-6/12 xl:w-1/2">
                 {/* Teruskan juga helper `getImageUrl` jika `PreviewSection` membutuhkannya */}
                <Preview 
                    theme={theme} 
                    fullBackgroundImageUrl={fullBackgroundImageUrl} 
                    getImageUrl={getImageUrl} 
                />
            </div>
        </div>
    );
}