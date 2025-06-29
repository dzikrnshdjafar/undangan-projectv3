// resources/js/Pages/Previews/DesktopPreview.jsx

import React from 'react';

// Tidak ada yang berubah di sini, karena komponen ini sudah menerima URL jadi.
// Nama prop `backgroundImageUrl` sudah cocok.
export default function DesktopPreview({ backgroundImageUrl }) {
    return (
        <div className="h-screen w-full sticky top-0">
            <div 
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            >
                 <div className="flex items-center justify-center h-full bg-black bg-opacity-20">
                    <span className="text-white text-2xl font-bold px-4 py-2 bg-black bg-opacity-50 rounded-lg">
                        Desktop Preview
                    </span>
                 </div>
            </div>
        </div>
    );
}