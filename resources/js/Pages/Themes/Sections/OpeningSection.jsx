import React, { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModalEditField from '../../../Components/ModalEditField';
import ModalEditImage from '../../../Components/ModalEditImage';
import { animationVariants } from '../../../Utils/animations';

/**
 * Komponen rekursif untuk me-render sebuah field atau sebuah wrapper.
 */
const RenderFieldOrWrapper = ({ fieldName, fieldData, path, onEditClick }) => {
    if (typeof fieldData !== 'object' || fieldData === null) return null;

    // Definisikan kunci-kunci yang merupakan properti konfigurasi/styling,
    // bukan elemen anak yang bisa dirender, meskipun nilainya adalah objek.
    const nonRenderableChildKeys = ['wrapperStyle', 'imageStyle', 'textStyle', 'order']; // Updated keys

    // Cek apakah ini wrapper. Wrapper adalah objek yang tidak memiliki 'path' atau 'text'
    // tapi memiliki child yang merupakan objek (dan bukan salah satu dari nonRenderableChildKeys).
    const childKeys = Object.keys(fieldData).filter(key =>
        typeof fieldData[key] === 'object' &&
        fieldData[key] !== null &&
        !nonRenderableChildKeys.includes(key) // Pastikan kunci ini bukan untuk styling/konfigurasi objek induk
    );

    // isWrapper ditentukan jika tidak ada 'path' atau 'text' (bukan field daun)
    // DAN memiliki childKeys yang valid untuk dirender.
    const isWrapper = !('path' in fieldData) && !('text' in fieldData) && childKeys.length > 0;

    // --- Kalkulasi Style ---
    let transformString = '';
    if (fieldData.flipX) {
        transformString = 'scaleX(-1)';
    }

    // Tentukan style berdasarkan jenis field
    let elementStyle = {};
    
    if (isWrapper) {
        // Untuk wrapper, gunakan wrapperStyle
        elementStyle = {
            ...fieldData.wrapperStyle,
            ...(transformString && { transform: `${fieldData.wrapperStyle?.transform || ''} ${transformString}`.trim() })
        };
    } else if ('path' in fieldData) {
        // Untuk gambar, gunakan imageStyle
        elementStyle = {
            ...fieldData.imageStyle,
            ...(transformString && { transform: `${fieldData.imageStyle?.transform || ''} ${transformString}`.trim() })
        };
    } else {
        // Untuk teks, gunakan textStyle
        elementStyle = {
            ...fieldData.textStyle,
            ...(transformString && { transform: `${fieldData.textStyle?.transform || ''} ${transformString}`.trim() })
        };
    }

    if (isWrapper) {
        // Ini adalah WRAPPER. Render sebuah div dan panggil komponen ini lagi untuk anak-anaknya.
        return (
            <div
                style={elementStyle}
                className="cursor-pointer border-2 border-dashed border-transparent hover:border-red-500 transition-all p-1"
                onClick={(e) => { e.stopPropagation(); onEditClick(path, fieldData); }}
            >
                <div className="relative w-full h-full">
                    {childKeys.map(key => (
                        <RenderFieldOrWrapper
                            key={key}
                            fieldName={key}
                            fieldData={fieldData[key]}
                            path={[...path, key]} // Tambahkan key ke path
                            onEditClick={onEditClick}
                        />
                    ))}
                </div>
            </div>
        );
    } else {
        // Ini adalah FIELD BIASA (gambar atau teks). Render seperti sebelumnya.
        const isImage = 'path' in fieldData;
        const animateProps = fieldData.animation ? animationVariants[fieldData.animation] : {};

        return (
            <div
                key={fieldName}
                className="absolute cursor-pointer border-dashed border-2 border-transparent hover:border-blue-500 rounded transition-all"
                style={elementStyle}
                onClick={(e) => { e.stopPropagation(); onEditClick(path, fieldData); }}
            >
                <motion.div className="w-full h-full" animate={animateProps}>
                    {isImage ? (
                        <img
                            src={`/storage${fieldData.path}`}
                            alt={fieldName}
                            className="w-full h-full object-cover pointer-events-none rounded"
                            
                        />
                    ) : (
                        <div
                            className="relative whitespace-pre-line text-center"
                        >
                            {fieldData.text || `[Edit ${fieldName}]`}
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }
};

export default function OpeningSection({ section, themeId, sectionIndex }) {
    const [currentSectionData, setCurrentSectionData] = useState(section);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('text'); // 'text' or 'image'
    const [editingFieldPath, setEditingFieldPath] = useState([]);
    const [originalFieldData, setOriginalFieldData] = useState(null);

    // Helper untuk update state secara nested
    const updateNestedState = (path, newValues) => {
        setCurrentSectionData(prev => {
            const newState = JSON.parse(JSON.stringify(prev)); // Deep copy
            let current = newState;
            path.slice(0, -1).forEach(key => {
                current = current[key];
            });
            current[path[path.length - 1]] = {
                ...current[path[path.length - 1]],
                ...newValues
            };
            return newState;
        });
    };

    const handleEditClick = useCallback((path, fieldData) => {
        setEditingFieldPath(path);
        setOriginalFieldData(fieldData);
        setModalType('path' in fieldData ? 'image' : 'text');
        setModalOpen(true);
    }, []);

    const handleLiveUpdate = useCallback((newValues) => {
        if (!editingFieldPath.length) return;
        updateNestedState(editingFieldPath, newValues);
    }, [editingFieldPath]);

    const handleSave = () => {
        const fieldData = editingFieldPath.reduce((acc, key) => acc[key], currentSectionData);
        const payloadData = { ...fieldData };

        if (!payloadData.path) {
            payloadData.text = (payloadData.text || '').replace(/\n/g, '\\n');
        }

        router.put(`/themes/${themeId}/sections/${sectionIndex}`, {
            fieldName: editingFieldPath.join('.'), // Kirim path dengan notasi titik
            data: payloadData,
        }, {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingFieldPath([]);
        setOriginalFieldData(null);
    };

    const handleCancel = () => {
        if (originalFieldData) {
            updateNestedState(editingFieldPath, originalFieldData);
        }
        closeModal();
    };

     // Ambil semua key level atas dari data section
    const allTopLevelKeys = Object.keys(currentSectionData).filter(
        key => !['type', 'height', 'minHeight'].includes(key)
    );

    // Urutkan keys berdasarkan properti 'order' pada data fieldnya
    // Field tanpa 'order' atau dengan 'order' yang tidak valid akan diletakkan di akhir
    const sortedFieldNames = allTopLevelKeys.sort((keyA, keyB) => {
        const orderA = currentSectionData[keyA]?.order;
        const orderB = currentSectionData[keyB]?.order;

        // Handle jika order tidak ada atau bukan angka
        if (typeof orderA !== 'number' && typeof orderB !== 'number') return 0; // Pertahankan urutan asli jika keduanya tidak punya order
        if (typeof orderA !== 'number') return 1; // Taruh A di akhir jika tidak punya order
        if (typeof orderB !== 'number') return -1; // Taruh B di akhir jika tidak punya order

        return orderA - orderB;
    });

    const getFieldDataByPath = (path) => {
        return path.reduce((acc, key) => acc[key], currentSectionData);
    };
    
    return (
        <>
            {sortedFieldNames.map(fieldName => (
                <RenderFieldOrWrapper
                    key={fieldName}
                    fieldName={fieldName}
                    fieldData={currentSectionData[fieldName]}
                    path={[fieldName]}
                    onEditClick={handleEditClick}
                />
            ))}

            {modalOpen && (
                modalType === 'image' ? (
                    <ModalEditImage
                        open={modalOpen}
                        initialValue={getFieldDataByPath(editingFieldPath)}
                        label={`Edit Gambar ${editingFieldPath.join(' > ')}`}
                        onClose={handleCancel}
                        onSave={handleSave}
                        onLiveUpdate={handleLiveUpdate}
                    />
                ) : (
                    <ModalEditField
                        open={modalOpen}
                        initialValue={getFieldDataByPath(editingFieldPath)}
                        label={`Edit Teks ${editingFieldPath.join(' > ')}`}
                        onClose={handleCancel}
                        onSave={handleSave}
                        onLiveUpdate={handleLiveUpdate}
                    />
                )
            )}
        </>
    );
}