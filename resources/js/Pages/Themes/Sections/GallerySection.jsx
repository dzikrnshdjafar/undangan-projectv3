import React from 'react';

export default function GallerySection({ section, backgroundImageUrl }) {
    return (
        <div style={{backgroundImage: `url(${backgroundImageUrl})`}} className='section-gallery text-center h-screen bg-cover bg-center py-8'>
            <h2>{section.title}</h2>
            {section.images && (
                <div>
                    {section.images.map((img, i) => (
                        <img key={i} src={img} alt="" style={{ maxWidth: 200, marginRight: 10 }} />
                    ))}
                </div>
            )}
        </div>
    );
}