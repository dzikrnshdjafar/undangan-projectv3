import React from 'react';
import { usePage } from '@inertiajs/react';
import DynamicSection from './DynamicSection';

export default function PreviewPane({ theme, onSelectElement, selectedElementPath }) {
    // const { theme: pageTheme } = usePage().props;
    
    const backgroundImageUrl = theme.background_image_url;

    // Handler untuk membatalkan seleksi ketika klik di luar element
    const handleBackgroundClick = (e) => {
        // Hanya jalankan jika klik langsung di background, bukan dari bubbling
        if (e.target === e.currentTarget) {
            onSelectElement(null, null); // Batalkan seleksi
        }
    };
    
    return (
        <div className="relative h-full xl:w-3/5 lg:w-full md:w-full sm:w-full mx-auto overflow-hidden">
            {/* Background Layer - Terbatas pada container ini */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
                onClick={handleBackgroundClick} // Handler untuk deselect
            />

            <div className="relative z-10 h-full overflow-y-auto">
                <div 
                    className="w-full mx-auto bg-transparent shadow-lg relative"
                    onClick={handleBackgroundClick} // Handler untuk deselect pada content area
                >
                    <div className="absolute inset-0 bg-red-100 bg-opacity-50 backdrop-saturate-50 z-0"></div>

                    <div className="relative z-10">
                        {theme.sections && theme.sections.map((section, idx) => (
                            <DynamicSection
                                key={idx}
                                section={section}
                                sectionIndex={idx}
                                onSelectElement={onSelectElement}
                                selectedElementPath={selectedElementPath}
                                isEditing={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}