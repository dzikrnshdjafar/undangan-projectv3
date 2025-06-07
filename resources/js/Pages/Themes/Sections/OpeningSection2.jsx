import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';

export default function OpeningSection({ section, backgroundImageUrl, themeId, sectionIndex, }) {
    const [title, setTitle] = useState(section.title);
    const [content, setContent] = useState(section.content);
    const [isEditing, setIsEditing] = useState(false);

    const titleRef = useRef(null);
    const contentRef = useRef(null);

    // Set isi DOM saat mulai edit
    const handleEdit = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (titleRef.current) titleRef.current.textContent = title;
            if (contentRef.current) contentRef.current.textContent = content;
        }, 0);
    };

    const handleSave = () => {
        router.put(`/themes/${themeId}/sections/${sectionIndex}`, {
            title,
            content,
        }, {
            onSuccess: () => setIsEditing(false)
        });
    };

    return (
        <div
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            className="section-gallery text-center h-screen bg-cover bg-center py-8"
        >
            <h2
                ref={titleRef}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                className="text-2xl font-bold"
                onInput={e => setTitle(e.currentTarget.textContent)}
                style={isEditing ? { outline: '1px solid #ddd', background: '#fff8' } : {}}
            >
                {!isEditing ? title : null}
            </h2>
            <p
                ref={contentRef}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                className="mb-4"
                onInput={e => setContent(e.currentTarget.textContent)}
                style={isEditing ? { outline: '1px solid #ddd', background: '#fff8' } : {}}
            >
                {!isEditing ? content : null}
            </p>
            {isEditing ? (
                <>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded mr-2">Simpan</button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Batal</button>
                </>
            ) : (
                <button onClick={handleEdit} className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded">Edit</button>
            )}
        </div>
    );
}