// resources/js/Pages/Previews/Preview.jsx

import React from 'react';
import PreviewSection from './PreviewSection';

// 1. Terima `fullBackgroundImageUrl` dan `getImageUrl` dari props
export default function Preview({ theme, fullBackgroundImageUrl, getImageUrl }) {
    return (
        <div className="relative w-full mx-auto shadow-lg overflow-hidden">
            {/* Background Image */}
            <div className="fixed top-0 w-fit h-screen z-0">
                <img
                    // 2. Langsung gunakan prop URL yang sudah jadi
                    src={fullBackgroundImageUrl}
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
                {theme.sections && theme.sections.map((section, idx) => (
                    <PreviewSection
                        key={idx}
                        section={section}
                        sectionIndex={idx}
                        // 3. Teruskan helper `getImageUrl` ke komponen section
                        // agar ia bisa merender gambar-gambar di dalamnya
                        getImageUrl={getImageUrl} 
                    />
                ))}
            </div>
        </div>
    );
}