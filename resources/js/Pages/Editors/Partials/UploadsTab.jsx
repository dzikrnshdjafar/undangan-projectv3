// resources/js/Pages/Editors/Partials/UploadsTab.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UploadsTab({ onImageSelect }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('editor.image.index'));
            setImages(response.data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat gambar. Silakan coba lagi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    if (loading) {
        return <div className="p-4 text-center">Memuat gambar...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">{error}</div>;
    }

    // Fungsi untuk menyalin URL relatif gambar ke clipboard
    const handleCopyUrl = (url) => {
        const relativeUrl = url.replace(window.location.origin, '');
        navigator.clipboard.writeText(relativeUrl).then(() => {
            alert('URL gambar disalin: ' + relativeUrl);
        });
    };

    return (
        <div className="p-4">
             <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-lg font-bold">Galeri Saya</h2>
                <button
                    onClick={fetchImages}
                    className="p-1 text-gray-500 hover:bg-gray-200 rounded-full"
                    title="Muat Ulang Gambar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l16 16"/></svg>
                </button>
            </div>
            {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                    {images.map((imageUrl, index) => (
                        <div key={index} className="group relative cursor-pointer" onClick={() => onImageSelect(imageUrl.replace(window.location.origin, ''))}>
                            <img
                                src={imageUrl}
                                alt={`Unggahan ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md transition-transform group-hover:scale-105"
                                title="Gunakan gambar ini"
                            />
                             <button
                                onClick={(e) => { e.stopPropagation(); handleCopyUrl(imageUrl); }}
                                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs rounded-sm px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Salin URL"
                            >
                                Salin
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-8 text-sm">Anda belum mengunggah gambar. Gunakan tombol "Unggah" pada editor elemen gambar.</p>
            )}
        </div>
    );
}