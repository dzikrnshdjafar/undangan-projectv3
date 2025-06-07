import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import ModalEditField from '../../../Components/ModalEditField';

export default function OpeningSection({ section, backgroundImageUrl, themeId, sectionIndex }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editField, setEditField] = useState(null); // 'title' or 'content'
    const [title, setTitle] = useState(section.title?.text || '');
    const [content, setContent] = useState(section.content?.text || '');

    const handleSave = (newValue) => {
         const updatedTitle = editField === 'title' ? newValue : title;
        const updatedContent = editField === 'content' ? newValue : content;

        router.put(`/themes/${themeId}/sections/${sectionIndex}`, {
            title: {
                ...section.title,
                text: updatedTitle,
            },
            content: {
                ...section.content,
                text: updatedContent,
            },
         }, {
            onSuccess: () => {
                setTitle(updatedTitle);
                setContent(updatedContent);
                setModalOpen(false);
                setEditField(null);
            }
        });
    };
    console.log(title)

    
    return (
        <div
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            className="section-gallery text-center h-screen bg-cover bg-center py-8"
        >
                        <h2
                className="text-2xl font-bold cursor-pointer whitespace-pre-line text-clip overflow-hidden"
                onClick={() => {
                    setEditField('title');
                    setModalOpen(true);
                }}
            >
                {title}
            </h2>
            <div className='border border-transparent hover:border-dashed hover:border hover:border-black text-clip overflow-hidden inline-block rounded'>
                <p
                className="p-1 cursor-pointer whitespace-pre-line transition-colors`]"
                style={{ color: content.color }}
                onClick={() => {
                    setEditField('content');
                    setModalOpen(true);
                }}
                >
                {content}
            </p>
                </div>
            <ModalEditField
                open={modalOpen}
                initialValue={editField === 'title' ? title.text : content.text}
                label={editField === 'title' ? 'Edit Judul' : 'Edit Isi'}
                onClose={() => {
                    setModalOpen(false);
                    setEditField(null);
                }}
                onSave={handleSave}
            />
        </div>
    );
}