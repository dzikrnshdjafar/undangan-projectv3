import React from 'react';
import PreviewElement from './PreviewElement';

const isElementKey = (key) => !['type', 'order', 'minHeight', 'wrapperStyle'].includes(key);

export default function PreviewSection({ section, sectionIndex }) {
    if (!section || !section.type) {
        return <div>Error: Invalid section data</div>;
    }

    // Ambil semua elemen level atas dari section
    const topLevelElementKeys = Object.keys(section)
        .filter(key => isElementKey(key) && typeof section[key] === 'object');
    
    // Urutkan elemen berdasarkan properti 'order'
    const sortedElementKeys = topLevelElementKeys.sort((a, b) => {
        const orderA = section[a]?.order || 0;
        const orderB = section[b]?.order || 0;
        return orderA - orderB;
    });

    const sectionStyle = {
        minHeight: section.minHeight || '100vh',
        position: 'relative',
        overflow: 'hidden',
        ...section.wrapperStyle
    };

    return (
        <section 
            id={`preview-section-${sectionIndex}`} 
            style={sectionStyle}
            className="preview-section"
        >
            {sortedElementKeys.map((elementKey) => (
                <PreviewElement
                    key={elementKey}
                    data={section[elementKey]}
                    path={[sectionIndex, elementKey]}
                />
            ))}
        </section>
    );
}