import React from 'react';
import OpeningSection from '../Sections/OpeningSection';
import CoupleSection from '../Sections/CoupleSection';
import EventSection from '../Sections/EventSection';
import GallerySection from '../Sections/GallerySection';
import RsvpSection from '../Sections/RsvpSection';
import ClosingSection from '../Sections/ClosingSection';

const sectionComponents = {
    opening: OpeningSection,
    couple: CoupleSection,
    event: EventSection,
    gallery: GallerySection,
    rsvp: RsvpSection,
    closing: ClosingSection,
};

export default function SectionRenderer({ section, theme, index }) {
    const SectionComponent = sectionComponents[section.type];
    
    if (!SectionComponent) {
        console.warn(`Section type "${section.type}" not found`);
        return null;
    }

    return (
        <SectionComponent 
            section={section}
            theme={theme}
            index={index}
        />
    );
}