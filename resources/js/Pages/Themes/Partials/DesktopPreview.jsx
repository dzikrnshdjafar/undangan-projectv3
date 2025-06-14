import React from 'react';

export default function DesktopPreview({ backgroundImageUrl }) {
    return (
        <div className="h-screen w-full sticky top-0">
            <div 
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            >
                 {/* Div ini bisa diisi dengan teks atau logo "Desktop Preview" jika mau */}
                 <div className="flex items-center justify-center h-full bg-black bg-opacity-20">
                    <span className="text-white text-2xl font-bold px-4 py-2 bg-black bg-opacity-50 rounded-lg">
                        Desktop Preview
                    </span>
                 </div>
            </div>
        </div>
    );
}