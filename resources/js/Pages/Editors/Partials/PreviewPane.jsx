import React from 'react';
import { usePage } from '@inertiajs/react';
import DynamicSection from './DynamicSection';
import { getImageUrl } from '@/Utils/imageHelper';

export default function PreviewPane({ theme, onSelectElement, selectedElementPath }) {
    // const { theme: pageTheme } = usePage().props;
    
    // Handler untuk membatalkan seleksi ketika klik di luar element
    const handleBackgroundClick = (e) => {
        // Hanya jalankan jika klik langsung di background, bukan dari bubbling
        if (e.target === e.currentTarget) {
            onSelectElement(null, null); // Batalkan seleksi
        }
    };
    
    return (
        <div className="relative h-full xl:w-[42rem] lg:w-[32rem] md:w-full sm:w-full mx-auto overflow-hidden rounded-xl">
            {/* Background Layer - Terbatas pada container ini */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${getImageUrl(theme.background_image_path)})`,
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
                    <div className="absolute inset-0 bg-red-200 bg-opacity-50 saturate-100 z-0"></div>

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