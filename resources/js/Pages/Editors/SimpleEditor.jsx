import React, { useState, useCallback, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';

// Ganti komponen yang di-import
import PreviewPane from './Partials/PreviewPane';
import EditModal from './Partials/EditModal';

export default function SimpleEditor() {
    const { invitation: initialInvitation } = usePage().props;

    const [invitationData, setInvitationData] = useState({
        ...initialInvitation,
        sections: JSON.parse(initialInvitation.sections_json || '[]'),
        background_image_url: initialInvitation.background_image_url,
    });
    
    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentElement, setCurrentElement] = useState(null);

    // Fungsi ini dipanggil saat elemen di pratinjau diklik
    const handleElementClick = useCallback((path, elementData) => {
        // Cek apakah element bisa diedit (modifiable)
        if (elementData && typeof elementData === 'object') {
            // Cek apakah element memiliki properti modifiable dan nilainya true
            if (elementData.modifiable === false) {
                console.log('Element ini tidak bisa diedit (modifiable: false)');
                return; // Jangan buka modal jika tidak bisa diedit
            }

            // Jika modifiable tidak ada atau true, cek apakah element memiliki konten yang bisa diedit
            const hasEditableContent = 
                elementData.text !== undefined || 
                elementData.path !== undefined || 
                elementData.href !== undefined ||
                elementData.type !== undefined ||
                elementData.animation !== undefined ||
                elementData.datetime !== undefined ||
                elementData.title !== undefined ||
                elementData.description !== undefined ||
                elementData.buttonText !== undefined ||
                elementData.accounts !== undefined ||
                elementData.bankName !== undefined ||
                elementData.accountName !== undefined ||
                elementData.accountNumber !== undefined;

            if (hasEditableContent) {
                setCurrentElement({ data: elementData, path });
                setIsModalOpen(true);
            }
        }
    }, []);

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentElement(null);
    };

    // Fungsi untuk menyimpan perubahan dari modal
    const handleSaveFromModal = (path, updatedData) => {
        const [sectionIndex, ...elementPath] = path;
        const fieldName = elementPath.join('.');

        // Kirim data ke backend
        router.put(
            route('invitations.sections.update', { invitation: invitationData.slug, index: sectionIndex }),
            {
                fieldName: fieldName,
                data: updatedData,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Update state lokal setelah berhasil menyimpan
                    setInvitationData(prevData => {
                        const newSections = JSON.parse(JSON.stringify(prevData.sections));
                        let current = newSections[sectionIndex];
                        elementPath.slice(0, -1).forEach(key => current = current[key]);
                        const finalKey = elementPath[elementPath.length - 1];
                        current[finalKey] = { ...current[finalKey], ...updatedData };
                        return { ...prevData, sections: newSections };
                    });
                    handleCloseModal();
                },
                onError: (errors) => {
                    console.error('Gagal menyimpan:', errors);
                    alert('Gagal menyimpan perubahan. Cek konsol untuk detail.');
                }
            }
        );
    };

    return (
        <div className="flex h-screen w-full justify-center bg-gray-200">
            {/* Hanya ada PreviewPane yang sekarang memenuhi layar */}
            <div className="xl:w-3/5 lg:w-full md:w-4/5 sm:w-full relative z-10 h-screen py-1">
                <PreviewPane
                    theme={invitationData} 
                    onSelectElement={handleElementClick} 
                />
            </div>
            
            {/* Modal akan muncul di atas segalanya saat aktif */}
            {currentElement && (
                <EditModal
                    show={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveFromModal}
                    element={currentElement.data}
                    path={currentElement.path}
                />
            )}
        </div>
    );
}