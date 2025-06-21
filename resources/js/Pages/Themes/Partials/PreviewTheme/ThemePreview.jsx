import React from 'react';
import { usePage } from '@inertiajs/react';
import PreviewSection from './PreviewSection';

export default function ThemePreview({ theme }) {
    const { theme: pageTheme } = usePage().props;
    
    const backgroundImageUrl = theme?.background_image_url || pageTheme?.background_image_url;

    return (
        <div className="relative w-full mx-auto shadow-lg overflow-hidden">
            {/* Background Image */}
            <div className="fixed top-0 w-fit h-screen z-0">
                <img
                    src={backgroundImageUrl}
                    className="w-screen h-full object-cover"
                    style={{ imageRendering: 'optimizeQuality' }}
                    alt="Background"
                    loading="eager"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-red-100 bg-opacity-50 backdrop-saturate-50"></div>
            </div>
            
            {/* Content Container */}
            <div className="relative z-10">
                {/* Render sections secara dinamis */}
                {theme.sections && theme.sections.map((section, idx) => (
                    <PreviewSection
                        key={idx}
                        section={section}
                        sectionIndex={idx}
                    />
                ))}
            </div>
        </div>
    );
}