import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion'; 
import ModalEditField from '../../../Components/ModalEditField';
import ModalEditImage from '../../../Components/ModalEditImage';
import { animationVariants } from '../../../Utils/animations';

export default function OpeningSection({ section, themeId, sectionIndex }) {
    // ... (State dan semua fungsi handle Anda tetap sama)
    const [currentSectionData, setCurrentSectionData] = useState(section);
    const [textModalOpen, setTextModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
     // State untuk menyimpan nama field yang sedang diedit
    const [editingField, setEditingField] = useState(null);
    // State untuk menyimpan data "draf" yang sedang di-edit secara live
    const [liveEditingData, setLiveEditingData] = useState(null);


    const handleEditClick = (fieldName) => {
        setEditingField(fieldName);
        // Salin data asli ke state live-editing saat modal dibuka
        setLiveEditingData(currentSectionData[fieldName]); 

        if (currentSectionData[fieldName]?.path !== undefined) {
            setImageModalOpen(true);
        } else {
            setTextModalOpen(true);
        }
    };
    
    // Fungsi ini dipanggil setiap kali ada perubahan di modal
    const handleLiveChange = (newValue) => {
        setLiveEditingData(newValue);
    };

    // Fungsi untuk membatalkan perubahan
    const handleCancel = () => {
        setEditingField(null);
        setLiveEditingData(null);
        setTextModalOpen(false);
        setImageModalOpen(false);
    }

    // Fungsi ini hanya dipanggil saat tombol "Simpan" di modal diklik
    const handleFinalSave = () => {
        if (!editingField || !liveEditingData) return;

        const payload = { 
            fieldName: editingField, 
            data: liveEditingData 
        };

        router.put(`/themes/${themeId}/sections/${sectionIndex}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                // Update state utama dengan data dari live-editing
                setCurrentSectionData(prevData => ({ 
                    ...prevData, 
                    [editingField]: liveEditingData 
                }));
                handleCancel(); // Tutup modal dan reset state
            },
        });
    };
   
    const renderableFields = Object.keys(currentSectionData).filter(key => key !== 'type' && key !== 'height');


    return (
        <div className="relative section-gallery h-full w-full bg-cover bg-center overflow-hidden">
            
             {renderableFields.map((fieldName) => {
                // Saat me-render, cek apakah field ini yang sedang diedit.
                // Jika ya, gunakan data dari 'liveEditingData'. Jika tidak, gunakan data asli.
                const isCurrentlyEditing = editingField === fieldName;
                const fieldData = isCurrentlyEditing ? liveEditingData : currentSectionData[fieldName];

                if (typeof fieldData !== 'object' || fieldData === null) return null;
                const isImage = fieldData.path !== undefined;
                const animationName = fieldData.animation;
                const animateProps = animationName ? animationVariants[animationName] : {};
                const zIndexValue = fieldData.zIndex || 'auto';

                // ===================================
                // PERBAIKAN LOGIKA TRANSFORM DAN STYLE
                // ===================================

                // 1. Ambil nilai transform dari data (jika ada, cth: 'translateX(-50%)')
                let transformString = fieldData.position?.transform || '';

                // 2. Jika fieldData.flipX bernilai true, tambahkan 'scaleX(-1)'
                if (fieldData.flipX) {
                    transformString += ' scaleX(-1)';
                }
                
                // 3. Bangun objek style akhir
                const elementStyle = {
                    position: 'absolute',
                    zIndex: zIndexValue,
                    width: isImage ? fieldData.size : 'auto',
                    // Gunakan spread operator untuk menerapkan top, bottom, left, right dari data
                    ...(fieldData.position || {}),
                    // Timpa/atur properti transform dengan string yang sudah kita bangun
                    transform: transformString.trim(), 
                };

                return (
                    // Elemen 1 (Luar): Mengatur Posisi & Ukuran. TIDAK ADA ANIMASI.
                    <div
                        key={fieldName}
                        className='absolute cursor-pointer border-dashed border border-transparent hover:border-blue-500 rounded transition-all'
                         style={elementStyle} 
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
                label={`Edit Teks ${editingField}`}
                value={liveEditingData} // Kirim data draf
                onLiveChange={handleLiveChange} // Kirim fungsi untuk live update
                onClose={handleCancel} // Batal dan reset
                onSave={handleFinalSave} // Simpan final ke backend
            />
            <ModalEditImage
                open={imageModalOpen}
                label={`Edit Gambar ${editingField}`}
                value={liveEditingData} // Kirim data draf
                onLiveChange={handleLiveChange} // Kirim fungsi untuk live update
                onClose={handleCancel} // Batal dan reset
                onSave={handleFinalSave} // Simpan final ke backend
            />
        </div>
    );
}