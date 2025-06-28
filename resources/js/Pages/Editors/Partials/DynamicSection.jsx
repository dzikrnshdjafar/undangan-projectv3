import React from 'react';
import RecursiveElement from './RecursiveElement';

// Fungsi helper yang sama seperti di RecursiveElement
const isElementKey = (key) => !['type', 'order', 'minHeight', 'wrapperStyle'].includes(key);

export default function DynamicSection({ section, sectionIndex, onSelectElement, selectedElementPath, isEditing }) {
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

    // Handler untuk membatalkan seleksi ketika klik di area kosong section
    const handleSectionClick = (e) => {
        // Hanya jalankan jika klik langsung di section, bukan dari bubbling
        if (e.target === e.currentTarget) {
            onSelectElement(null, null); // Batalkan seleksi
        }
    };

    return (
        <section 
            id={`section-${sectionIndex}`} 
            style={sectionStyle}
            onClick={handleSectionClick} // Handler untuk deselect
        >
            {sortedElementKeys.map((elementKey) => (
                <RecursiveElement
                    key={elementKey}
                    data={section[elementKey]}
                    path={[sectionIndex, elementKey]}
                    onSelectElement={onSelectElement}
                    selectedElementPath={selectedElementPath}
                    isEditing={isEditing}
                />
            ))}
        </section>
    );
}