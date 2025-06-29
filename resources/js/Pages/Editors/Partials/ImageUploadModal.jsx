// resources/js/Pages/Editors/Partials/ImageUploadModal.jsx

import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import axios from 'axios';

export default function ImageUploadModal({ show, onClose, onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(route('editor.image.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUploadComplete(response.data.relative_path); // Kirim path relatif
            closeModal();
        } catch (err) {
            if (err.response && err.response.data.errors) {
                setError(Object.values(err.response.data.errors).join(', '));
            } else {
                setError('Gagal mengunggah gambar. Silakan coba lagi.');
            }
        } finally {
            setUploading(false);
        }
    };

    const closeModal = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        onClose();
    };

    return (
        <Modal show={show} onClose={closeModal} maxWidth="lg">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Unggah Gambar Baru
                </h2>
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="image" value="Pilih Gambar (Maks. 2MB)" />
                        <input
                            id="image"
                            type="file"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    {preview && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Preview:</p>
                            <img src={preview} alt="Preview" className="max-h-60 w-auto rounded-lg shadow-md" />
                        </div>
                    )}
                    {error && (
                        <div className="text-sm text-red-600 mt-2">{error}</div>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal} disabled={uploading}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton className="ms-3" onClick={handleUpload} disabled={uploading || !file}>
                        {uploading ? 'Mengunggah...' : 'Unggah'}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}