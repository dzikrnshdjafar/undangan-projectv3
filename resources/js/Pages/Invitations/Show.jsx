import React from 'react';
import { usePage } from '@inertiajs/react';
import { ThemePreview } from '../Themes/Partials/PreviewTheme';
import DesktopPreview from '../Themes/Partials/DesktopPreview';
import LoadingSpinner from '../../Components/LoadingSpinner';

export default function Show() {
    // 'theme' di sini adalah data yang sudah diproses dari invitation di controller
    const { invitation, theme, storage_path } = usePage().props; 
    
    // Logika preloading bisa ditambahkan di sini seperti pada Themes/Show.jsx
    const [isLoading, setIsLoading] = React.useState(false); 

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!invitation || !theme) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl text-gray-700">Undangan tidak ditemukan.</h1>
            </div>
        );
    }
    
    return (
        <div className="relative w-full bg-gray-100 md:flex">
            {/* Bagian ini hanya sebagai placeholder di tampilan desktop */}
            <div className="hidden md:block md:w-1/2 lg:w-6/12 xl:w-11/12">
                <DesktopPreview backgroundImageUrl={theme.background_image_url} />
            </div>

            {/* Preview Undangan untuk tampilan mobile */}
            <div className="w-full md:w-3/4 lg:w-6/12 xl:w-1/2">
                <ThemePreview theme={theme} />
            </div>
        </div>
    );
}