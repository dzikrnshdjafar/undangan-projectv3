import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion'; 
import ModalEditField from '../../../Components/ModalEditField';
import ModalEditImage from '../../../Components/ModalEditImage';
import { animationVariants } from '../../../Utils/animations';

export default function CoupleSection({ section, themeId, sectionIndex }) {
    // ... (State dan semua fungsi handle Anda tetap sama)
    const [currentSectionData, setCurrentSectionData] = useState(section);
    const [textModalOpen, setTextModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);

    const handleEditClick = (fieldName) => {
        setEditingField(fieldName);
        if (currentSectionData[fieldName]?.path !== undefined) {
            setImageModalOpen(true);
        } else {
            setTextModalOpen(true);
        }
    };
    
    const handleSave = (newValue, isImage = false) => {
        const fieldName = editingField;
        let payloadData = { ...newValue };
        if (!isImage) payloadData.text = (newValue.text || '').replace(/\n/g, '\\n');
        const payload = { fieldName, data: payloadData };

        router.put(`/themes/${themeId}/sections/${sectionIndex}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setCurrentSectionData(prevData => ({ ...prevData, [fieldName]: newValue }));
                setTextModalOpen(false);
                setImageModalOpen(false);
                setEditingField(null);
            },
        });
    };
   
    const renderableFields = Object.keys(currentSectionData).filter(key => key !== 'type');

    return (
        <div className="relative section-gallery h-full w-full bg-cover bg-center overflow-hidden">
            {renderableFields.map((fieldName) => {
                const fieldData = currentSectionData[fieldName];
                if (typeof fieldData !== 'object' || fieldData === null) return null;

                const isImage = fieldData.path !== undefined;
                const { x = 50, y = 50 } = fieldData.position || {};
                const animationName = fieldData.animation;
                const animateProps = animationName ? animationVariants[animationName] : {};
                const zIndexValue = fieldData.zIndex || 'auto';
               const rotateValue = fieldData.rotate || 0;

                // Bangun string transform secara dinamis
                const transformString = `translate(-50%, -50%) rotate(${rotateValue}deg)`;


                return (
                    // Elemen 1 (Luar): Mengatur Posisi & Ukuran. TIDAK ADA ANIMASI.
                    <div
                        key={fieldName}
                        className='absolute cursor-pointer border-dashed border border-transparent hover:border-blue-500 rounded transition-all'
                        style={{
                            top: `${y}%`,
                            left: `${x}%`,
                            transform: transformString, 
                            zIndex: zIndexValue,
                            width: isImage ? fieldData.size : '100%',
                        }}
                        onClick={() => handleEditClick(fieldName)}
                    >
                           <motion.div
                            className="w-full h-full"
                            animate={animateProps}
                        >
                            {isImage ? (
                                <img
                                    src={`/storage${fieldData.path}`}
                                    alt={fieldName}
                                    className="w-full h-full object-contain pointer-events-none"
                                />
                            ) : (
                                <div className="whitespace-pre-line text-center" style={{ color: fieldData.color, fontSize: fieldData.size }}>
                                    {fieldData.text || `[Edit ${fieldName}]`}
                                </div>
                            )}
                        </motion.div>
                    </div>
                );
            })}


            {/* ... Modal-modal tetap sama ... */}
            <ModalEditField
                open={textModalOpen}
                initialValue={editingField ? currentSectionData[editingField] : {}}
                label={`Edit Teks ${editingField}`}
                onClose={() => setTextModalOpen(false)}
                onSave={(value) => handleSave(value, false)}
            />
            <ModalEditImage
                open={imageModalOpen}
                initialValue={editingField ? currentSectionData[editingField] : {}}
                label={`Edit Gambar ${editingField}`}
                onClose={() => setImageModalOpen(false)}
                onSave={(value) => handleSave(value, true)}
            />
        </div>
    );
}