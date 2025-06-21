import React from 'react';
import { usePage } from '@inertiajs/react';
import DynamicSection from './DynamicSection';

export default function PreviewPane({ theme, onSelectElement, selectedElementPath }) {
    const { theme: pageTheme } = usePage().props;
    
    const backgroundImageUrl = pageTheme.background_image_url; 
    
    return (
        <div className="relative h-full w-3/5 mx-auto overflow-hidden">
            {/* Background Layer - Terbatas pada container ini */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: 'cover', // Ubah ke cover agar memenuhi container
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    // Hapus background-attachment: fixed
                }}
            />

            {/* Scrollable Content */}
            <div className="relative z-10 h-full overflow-y-auto">
                <div className="w-full mx-auto bg-transparent shadow-lg relative">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-red-100 bg-opacity-50 backdrop-saturate-50 z-0"></div>

                    {/* Sections */}
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