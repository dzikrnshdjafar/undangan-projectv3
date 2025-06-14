import React from 'react';
import OpeningSection from './OpeningSection';
import OpeningV2Section from './OpeningV2Section';
import EventSection from './EventSection';
import CoupleSection from './CoupleSection';
import GallerySection from './GallerySection';
import RSVPSection from './RSVPSection';
import ClosingSection from './ClosingSection';

export default function SectionWrapper({ section, themeId, sectionIndex, isEditing}) {

     const getResponsiveHeight = (minHeight) => {
        if (minHeight === '100vh' || minHeight === 'max(60rem, 100vh)') {
            // Gunakan CSS yang responsive terhadap zoom
            return 'max(60rem, 100vh)';
        }
        return minHeight || 'auto';
    };
    // Terapkan tinggi dari data, atau 'auto' jika tidak ditentukan
    const sectionStyle = {
        minHeight: getResponsiveHeight(section.minHeight),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: section.color,
    };
    
    const renderSection = () => {
        switch (section.type) {
            case 'opening':
                return <OpeningSection
                    section={section}
                    themeId={themeId}
                    sectionIndex={sectionIndex}
                    isEditing={isEditing}
                />;
            case 'openingv2':
                return <OpeningV2Section section={section} />;
            case 'event':
                return <EventSection section={section} />;
            case 'couple':
                return <CoupleSection section={section} />;
            case 'gallery':
                return <GallerySection section={section} />;
            case 'rsvp':
                return <RSVPSection section={section} />;
            case 'closing':
                return <ClosingSection section={section} />;
            default:
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold">{section.title}</h2>
                        <p>{section.content}</p>
                    </div>
                );
        }
    }

    return (
        // Div ini sekarang menjadi pembungkus utama untuk setiap section
        <div style={sectionStyle} className="w-full relative overflow-hidden">
            {renderSection()}
        </div>
    );
}