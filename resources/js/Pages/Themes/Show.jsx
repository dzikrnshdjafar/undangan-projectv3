import React from 'react';
import { usePage } from '@inertiajs/react';
import { ThemePreview } from './Partials/PreviewTheme';
import DesktopPreview from './Partials/DesktopPreview'; 

export default function Show() {
    const { theme } = usePage().props;

    return (
        <div className="relative w-full bg-gray-100 md:flex">
            {/* Kolom Kiri: Hanya tampil di desktop */}
            <div className="hidden md:block md:w-1/2 lg:w-6/12 xl:w-11/12">
                <DesktopPreview backgroundImageUrl={theme.background_image_url} />
            </div>

            {/* Kolom Kanan: Preview Undangan */}
            <div className="w-full md:w-3/4 lg:w-6/12 xl:w-1/2">
                <ThemePreview theme={theme} />
            </div>
        </div>
    );
}