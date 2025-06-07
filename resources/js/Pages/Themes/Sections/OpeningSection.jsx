import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import ModalEditField from '../../../Components/ModalEditField';

export default function OpeningSection({ section, backgroundImageUrl, themeId, sectionIndex }) {
    // Deteksi struktur
    const titleObj = typeof section.title === 'object'
        ? section.title
        : { text: section.title || '', color: '#000', size: '24px' };
    const contentObj = typeof section.content === 'object'
        ? section.content
        : { text: section.content || '', color: '#222', size: '16px' };
    const content2Obj = typeof section.content2 === 'object'
        ? section.content2
        : { text: section.content2 || '', color: '#222', size: '16px' };

    const [modalOpen, setModalOpen] = useState(false);
    const [editField, setEditField] = useState(null); // 'title', 'content', or 'content2'
    const [title, setTitle] = useState(titleObj);
    const [content, setContent] = useState(contentObj);
    const [content2, setContent2] = useState(content2Obj);

    const handleSave = (newValue) => {
        // newValue: { text, color, size }
        let updatedData = {};
        let localStateUpdate = {};

        if (editField === 'title') {
            const updatedTitle = { ...title, ...newValue };
            setTitle(updatedTitle);
            localStateUpdate.title = updatedTitle;
            
            // Hanya kirim title yang diupdate
            updatedData = {
                field: 'title',
                data: {
                    ...updatedTitle,
                    text: updatedTitle.text.replace(/\n/g, '\\n') // Encode \n
                }
            };
        } else if (editField === 'content') {
            const updatedContent = { ...content, ...newValue };
            setContent(updatedContent);
            localStateUpdate.content = updatedContent;
            
            // Hanya kirim content yang diupdate
            updatedData = {
                field: 'content', 
                data: {
                    ...updatedContent,
                    text: updatedContent.text.replace(/\n/g, '\\n') // Encode \n
                }
            };
        } else if (editField === 'content2') {
            const updatedContent2 = { ...content2, ...newValue };
            setContent2(updatedContent2);
            localStateUpdate.content2 = updatedContent2;
            
            // Hanya kirim content2 yang diupdate
            updatedData = {
                field: 'content2', 
                data: {
                    ...updatedContent2,
                    text: updatedContent2.text.replace(/\n/g, '\\n') // Encode \n
                }
            };
        }

        console.log('Sending only changed data:', updatedData);

        router.put(`/themes/${themeId}/sections/${sectionIndex}`, updatedData, {
            onSuccess: () => {
                setModalOpen(false);
                setEditField(null);
            }
        });
    };

    return (
        <div
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            className="section-gallery text-center h-screen bg-cover bg-center py-8"
        >
            <div className='border-dashed border border-black rounded w-fit mx-auto max-w-full'>
                <h2
                    className="text-2xl font-bold cursor-pointer whitespace-pre-line text-clip overflow-hidden"
                    style={{
                        color: title.color,
                        fontSize: title.size,
                    }}
                    onClick={() => {
                        setEditField('title');
                        setModalOpen(true);
                    }}
                >
                    {title.text}
                </h2>
            </div>

            <div className='border-dashed border border-black rounded w-fit mx-auto max-w-full'>
                <h2
                    className="cursor-pointer transition-colors whitespace-pre-line text-clip overflow-hidden"
                    style={{
                        color: content.color,
                        fontSize: content.size,
                    }}
                    onClick={() => {
                        setEditField('content');
                        setModalOpen(true);
                    }}
                >
                    {content.text}
                </h2>
            </div>

            {/* Content2 section - baru ditambahkan */}
            <div className='border-dashed border border-black rounded w-fit mx-auto max-w-full'>
                <h2
                    className="cursor-pointer transition-colors whitespace-pre-line text-clip overflow-hidden"
                    style={{
                        color: content2.color,
                        fontSize: content2.size,
                    }}
                    onClick={() => {
                        setEditField('content2');
                        setModalOpen(true);
                    }}
                >
                    {content2.text}
                </h2>
            </div>

            <ModalEditField
                open={modalOpen}
                initialValue={
                    editField === 'title'
                        ? { ...title }
                        : editField === 'content'
                        ? { ...content }
                        : { ...content2 }
                }
                label={
                    editField === 'title' 
                        ? 'Edit Judul' 
                        : editField === 'content'
                        ? 'Edit Isi'
                        : 'Edit Isi 2'
                }
                onClose={() => {
                    setModalOpen(false);
                    setEditField(null);
                }}
                onSave={handleSave}
            />
        </div>
    );
}