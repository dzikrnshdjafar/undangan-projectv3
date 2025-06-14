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

   // State untuk menyimpan data asli sebelum diedit (untuk fitur 'Batal')
    const [originalFieldData, setOriginalFieldData] = useState(null);

    const handleEditClick = (fieldName) => {
        setEditingField(fieldName);
        // Simpan data asli dari field yang akan diedit
        setOriginalFieldData(currentSectionData[fieldName]);

        if (currentSectionData[fieldName]?.path !== undefined) {
            setImageModalOpen(true);
        } else {
            setTextModalOpen(true);
        }
    };

    // Fungsi BARU untuk menerima update real-time dari modal
    const handleLiveUpdate = (newValues) => {
        if (!editingField) return;
        setCurrentSectionData(prevData => ({
            ...prevData,
            [editingField]: {
                ...prevData[editingField], // Gabungkan dengan properti lama
                ...newValues
            }
        }));
    };

    const handleSave = () => {
        const fieldName = editingField;
        const payloadData = { ...currentSectionData[fieldName] };
        if (!payloadData.path) { // Jika ini adalah field teks
            payloadData.text = (payloadData.text || '').replace(/\n/g, '\\n');
        }
        const payload = { fieldName, data: payloadData };

        router.put(`/themes/${themeId}/sections/${sectionIndex}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                // Tidak perlu update state lagi karena sudah live
                setEditingField(null);
                setOriginalFieldData(null);
                setTextModalOpen(false);
                setImageModalOpen(false);
            },
        });
    };

    // Fungsi BARU untuk membatalkan perubahan
    const handleCancel = () => {
        if (originalFieldData) {
            // Kembalikan data ke state aslinya
            setCurrentSectionData(prevData => ({
                ...prevData,
                [editingField]: originalFieldData
            }));
        }
        setEditingField(null);
        setOriginalFieldData(null);
        setTextModalOpen(false);
        setImageModalOpen(false);
    };

    const renderField = (fieldName, fieldData, isInWrapper = false) => {
        if (typeof fieldData !== 'object' || fieldData === null) return null;

        const isImage = fieldData.path !== undefined;
        const animationName = fieldData.animation;
        const zIndexValue = fieldData.zIndex || 'auto';

        // Cek apakah ini adalah wrapper
        const isWrapper = fieldData.children !== undefined;
        
        // Hanya gunakan posisi absolute jika bukan di dalam wrapper
        const position = isInWrapper ? 'relative' : (fieldData.position || 'absolute');

        let transformString = fieldData.padding?.transform || '';
        if (fieldData.flipX) {
            transformString += ' scaleX(-1)';
        }
        
        const elementStyle = {
            position: position,
            zIndex: zIndexValue,
            width: isImage ? fieldData.size : 'auto',
            ...(fieldData.padding || {}),
            transform: transformString.trim(),
        };

        // Jika ini adalah wrapper, render sebagai div dengan children di dalamnya
        if (isWrapper) {
            return (
                <div
                    key={fieldName}
                    className='absolute cursor-pointer border-dashed border border-transparent hover:border-blue-500 rounded transition-all'
                    style={elementStyle}
                    onClick={() => handleEditClick(fieldName)}
                >
                    {Object.entries(fieldData.children || {}).map(([childName, childData]) => (
                        renderField(`${fieldName}.${childName}`, childData, true)
                    ))}
                </div>
            );
        }
        
        // Jika bukan wrapper, render seperti biasa
        return (
            <div
                key={fieldName}
                className={`${isInWrapper ? 'relative' : 'absolute'} cursor-pointer border-dashed border border-transparent hover:border-blue-500 rounded transition-all`}
                style={elementStyle}
                onClick={() => handleEditClick(fieldName)}
            >
                <motion.div
                    className="w-full h-full"
                    animate={fieldData.animation ? animationVariants[fieldData.animation] : {}}
                >
                    {isImage ? (
                        <img
                            src={`/storage${fieldData.path}`}
                            alt={fieldName}
                            style={fieldData.style || {}}
                            className="w-full h-full object-cover pointer-events-none"
                        />
                    ) : (
                        <div className="relative whitespace-pre-line text-center" style={{ ...fieldData.style, color: fieldData.color, fontSize: fieldData.size, }}>
                            {fieldData.text || `[Edit ${fieldName}]`}
                        </div>
                    )}
                </motion.div>
            </div>
        );
    };
   
    const renderableFields = Object.keys(currentSectionData).filter(key => key !== 'type' && key !== 'height' && key !== 'minHeight');

    return (
        <>
            
            {renderableFields.map((fieldName) => {
                const fieldData = currentSectionData[fieldName];
                return renderField(fieldName, fieldData);
            })}


            {/* ... Modal-modal tetap sama ... */}
            <ModalEditField
                open={textModalOpen}
                initialValue={editingField ? currentSectionData[editingField] : {}}
                label={`Edit Teks ${editingField}`}
                onClose={handleCancel} // Gunakan handleCancel
                onSave={handleSave}     // Gunakan handleSave
                onLiveUpdate={handleLiveUpdate} // Prop BARU untuk update real-time
            />
            <ModalEditImage
                open={imageModalOpen}
                initialValue={editingField ? currentSectionData[editingField] : {}}
                label={`Edit Gambar ${editingField}`}
                onClose={handleCancel} // Gunakan handleCancel
                onSave={handleSave}     // Gunakan handleSave
                onLiveUpdate={handleLiveUpdate} // Prop BARU untuk update real-time
            />
        </>
    );
}