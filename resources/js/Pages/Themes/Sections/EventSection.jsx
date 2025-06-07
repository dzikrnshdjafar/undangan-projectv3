import React from 'react';

export default function EventSection({ section, backgroundImageUrl }) {
    return (
        <div style={{backgroundImage: `url(${backgroundImageUrl})`}} className='section-gallery text-center h-screen bg-cover bg-center py-8'>
           <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
            {section.date && section.time && (
                <p className="mb-1">
                    <span className="font-semibold">Tanggal:</span> {section.date}
                    <br />
                    <span className="font-semibold">Waktu:</span> {section.time}
                </p>
            )}
            {section.place && (
                <p className="mb-1">
                    <span className="font-semibold">Tempat:</span> {section.place}
                </p>
            )}
            {section.content && (
                <p className="mt-2">{section.content}</p>
            )}
        </div>
    );
}