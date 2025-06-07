import React from 'react';
import { usePage } from '@inertiajs/react';
import SectionWrapper from './Sections/SectionWrapper';

export default function Show() {
    const { theme } = usePage().props;
    return (
        <div className='w-full max-w-[550px] mx-auto bg-white shadow-lg min-h-screen'>
            {theme.sections && theme.sections.map((section, idx) => (
                <SectionWrapper
                    key={idx}
                    section={section}
                    backgroundImageUrl={theme.background_image_url}
                    themeId={theme.id}
                    sectionIndex={idx}
                    isEditing={true}
                />
            ))}
        </div>
    );
}