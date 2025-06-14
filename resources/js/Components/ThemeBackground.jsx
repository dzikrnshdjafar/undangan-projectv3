import React from 'react';

export default function ThemeBackground({ imageUrl, overlayClassName = 'bg-red-100 bg-opacity-50' }) {
    return (
        <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden fixed">
            <img
                src={imageUrl}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'optimizeQuality' }}
                alt="Background"
            />
            {/* Overlay untuk efek gelap/warna */}
            <div className={`absolute inset-0 ${overlayClassName} backdrop-saturate-50`}></div>
        </div>
    );
}