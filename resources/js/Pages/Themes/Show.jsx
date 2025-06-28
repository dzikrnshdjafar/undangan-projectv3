import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Preview } from '../Previews';
import DesktopPreview from '../Previews/DesktopPreview'; 
import LoadingSpinner from '../../Components/LoadingSpinner';

export default function Show() {
    const { theme, storage_path } = usePage().props;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Jika tidak ada data tema, hentikan loading
        if (!theme) {
            setIsLoading(false);
            return;
        }

        const imageUrls = new Set();

        // Fungsi rekursif untuk mencari semua nilai dari key 'path' di dalam object sections
        const findImagePaths = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            for (const key in obj) {
                if (key === 'path' && typeof obj[key] === 'string' && obj[key]) {
                    const imagePath = obj[key];
                    // Tambahkan path storage jika path gambar bersifat relatif
                    const fullUrl = imagePath.startsWith('/') ? `${storage_path}${imagePath}` : imagePath;
                    imageUrls.add(fullUrl);
                } else if (typeof obj[key] === 'object') {
                    findImagePaths(obj[key]);
                }
            }
        };

        // Cari semua path gambar di dalam sections
        findImagePaths(theme.sections);

        // Tambahkan gambar background utama ke dalam daftar aset yang akan dimuat
        if (theme.background_image_url) {
            imageUrls.add(theme.background_image_url);
        }

        // Jika tidak ada gambar untuk dimuat, langsung tampilkan halaman
        if (imageUrls.size === 0) {
            setIsLoading(false);
            return;
        }

        // Buat promise untuk setiap gambar yang akan dimuat
        const promises = Array.from(imageUrls).map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                // Anggap selesai baik saat berhasil (onload) maupun gagal (onerror)
                // agar halaman tidak stuck jika ada satu gambar yang rusak.
                img.onload = resolve;
                img.onerror = resolve;
            });
        });

        // Tunggu semua promise selesai
        Promise.all(promises).then(() => {
            // Beri jeda singkat untuk mencegah kedipan jika aset dimuat sangat cepat
            setTimeout(() => setIsLoading(false), 500);
        });

    }, [theme, storage_path]); // Jalankan efek ini jika data theme atau storage_path berubah

    // Tampilkan LoadingSpinner jika isLoading true
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Tampilkan konten utama jika semua aset telah dimuat
    return (
        <div className="relative w-full bg-gray-100 md:flex">
            {/* Kolom Kiri: Hanya tampil di desktop */}
            <div className="hidden md:block md:w-1/2 lg:w-6/12 xl:w-11/12">
                <DesktopPreview backgroundImageUrl={theme.background_image_url} />
            </div>

            {/* Kolom Kanan: Preview Undangan */}
            <div className="w-full md:w-3/4 lg:w-6/12 xl:w-1/2">
                <Preview theme={theme} />
            </div>
        </div>
    );
}