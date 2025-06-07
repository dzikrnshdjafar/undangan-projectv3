import React from 'react';
import OpeningSection from './OpeningSection';
import OpeningV2Section from './OpeningV2Section';
import EventSection from './EventSection';
import CoupleSection from './CoupleSection';
import GallerySection from './GallerySection';
import RSVPSection from './RSVPSection';
import ClosingSection from './ClosingSection';

export default function SectionWrapper({ section, backgroundImageUrl, themeId, sectionIndex, isEditing}) {
    switch (section.type) {
         case 'opening':
            return <OpeningSection
    section={section}
    backgroundImageUrl={backgroundImageUrl}
    themeId={themeId}
    sectionIndex={sectionIndex}
    isEditing={isEditing}
/>;
        case 'openingv2':
            return <OpeningV2Section section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'event':
            return <EventSection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'couple':
            return <CoupleSection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'gallery':
            return <GallerySection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'rsvp':
            return <RSVPSection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'closing':
            return <ClosingSection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        default:
            return (
                <div style={{ marginBottom: 30 }}>
                    <h2>{section.title}</h2>
                    <p>{section.content}</p>
                </div>
            );
    }
}