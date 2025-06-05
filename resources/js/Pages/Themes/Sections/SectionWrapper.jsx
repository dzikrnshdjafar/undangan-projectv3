import React from 'react';
import OpeningSection from './OpeningSection';
import OpeningV2Section from './OpeningV2Section';
import WaktuAcaraSection from './WaktuAcaraSection';
import MempelaiSection from './MempelaiSection';
import GallerySection from './GallerySection';
import RSVPSection from './RSVPSection';
import SalamSection from './SalamSection';

export default function SectionWrapper({ section, backgroundImageUrl }) {
    console.log(backgroundImageUrl)
    switch (section.type) {
        case 'opening':
            return <OpeningSection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'openingv2':
            return <OpeningV2Section section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'waktu-acara':
            return <WaktuAcaraSection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'mempelai':
            return <MempelaiSection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'gallery':
            return <GallerySection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'rsvp':
            return <RSVPSection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        case 'salam':
            return <SalamSection section={section} backgroundImageUrl={backgroundImageUrl}/>;
        default:
            return (
                <div style={{ marginBottom: 30 }}>
                    <h2>{section.title}</h2>
                    <p>{section.content}</p>
                </div>
            );
    }
}