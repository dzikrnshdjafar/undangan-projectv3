import React from 'react';

export default function RSVPSection({ section, backgroundImageUrl }) {
    return (
         <div style={{backgroundImage: `url(${backgroundImageUrl})`}} className='section-gallery text-center h-screen bg-cover bg-center py-8'>

            <h2>{section.title}</h2>
            <p>{section.content}</p>
            {/* Tambahkan form RSVP jika diperlukan */}
        </div>
    );
}