import React from 'react';

export default function OpeningV2Section({ section, backgroundImageUrl }) {

    return (
        <div style={{backgroundImage: `url(${backgroundImageUrl})`}} className='section-gallery text-center h-screen bg-cover bg-center py-8'>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
        </div>
    );
}