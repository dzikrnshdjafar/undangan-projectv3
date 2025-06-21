import React, { useState, useEffect } from 'react';
import { animationVariants } from '@/Utils/animations';

export default function ElementEditor({ elementData, onUpdate, onSave }) {
    const [data, setData] = useState(elementData || {});

    useEffect(() => {
        console.log('ElementEditor received data:', elementData); // DEBUG
        setData(elementData || {});
    }, [elementData]);

    const handleChange = (key, value) => {
        const updatedData = { ...data, [key]: value };
        setData(updatedData);
        onUpdate(updatedData);
    };

    const handleStyleChange = (styleType, value) => {
        try {
            // Parse JSON input untuk style
            const parsedStyle = JSON.parse(value);
            
            // Validasi bahwa hasil parsing adalah object
            if (typeof parsedStyle !== 'object' || parsedStyle === null || Array.isArray(parsedStyle)) {
                throw new Error('Style harus berupa object JSON yang valid');
            }
            
            const updatedData = {
                ...data,
                [styleType]: parsedStyle // Langsung replace dengan object baru
            };
            setData(updatedData);
            onUpdate(updatedData);
        } catch (error) {
            console.error('Invalid JSON for style:', error);
            // Bisa tambahkan notifikasi error di sini
            alert('Format JSON tidak valid. Pastikan syntax JSON benar.');
        }
    };

    // Fungsi untuk menambah properti CSS baru
    const handleAddStyleProperty = (styleType, property, value) => {
        const currentStyle = data[styleType] || {};
        const updatedStyle = {
            ...currentStyle,
            [property]: value
        };
        
        const updatedData = {
            ...data,
            [styleType]: updatedStyle
        };
        setData(updatedData);
        onUpdate(updatedData);
    };

    // Fungsi untuk menghapus properti CSS
    const handleRemoveStyleProperty = (styleType, propertyToRemove) => {
        const currentStyle = data[styleType] || {};
        const { [propertyToRemove]: removed, ...updatedStyle } = currentStyle;
        
        const updatedData = {
            ...data,
            [styleType]: updatedStyle
        };
        setData(updatedData);
        onUpdate(updatedData);
    };

    // Helper function untuk render style editor dengan kontrol tambahan
    const renderStyleEditor = (styleType, placeholder) => {
        const styleData = data[styleType] || {};
        
        return (
            <div>
                <label className="block text-sm font-medium mb-1">
                    {styleType.charAt(0).toUpperCase() + styleType.slice(1)} (JSON)
                </label>
                
                {/* JSON Editor */}
                <textarea
                    value={JSON.stringify(styleData, null, 2)}
                    onChange={(e) => handleStyleChange(styleType, e.target.value)}
                    className="w-full p-2 border rounded font-mono text-xs mb-2"
                    rows="8"
                    placeholder={placeholder}
                />
                
                {/* Quick Add Property */}
                <div className="border-t pt-2">
                    <h4 className="text-xs font-medium mb-2 text-gray-600">Quick Add Property:</h4>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="property"
                            className="flex-1 p-1 border rounded text-xs"
                            id={`${styleType}-prop`}
                        />
                        <input
                            type="text"
                            placeholder="value"
                            className="flex-1 p-1 border rounded text-xs"
                            id={`${styleType}-value`}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const propInput = document.getElementById(`${styleType}-prop`);
                                const valueInput = document.getElementById(`${styleType}-value`);
                                if (propInput.value && valueInput.value) {
                                    handleAddStyleProperty(styleType, propInput.value, valueInput.value);
                                    propInput.value = '';
                                    valueInput.value = '';
                                }
                            }}
                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        >
                            Add
                        </button>
                    </div>
                    
                    {/* Existing Properties dengan tombol hapus */}
                    <div className="space-y-1">
                        {Object.keys(styleData).map(property => (
                            <div key={property} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                <span className="font-mono">{property}: {JSON.stringify(styleData[property])}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveStyleProperty(styleType, property)}
                                    className="ml-2 px-1 py-0.5 bg-red-500 text-white rounded hover:bg-red-600"
                                    title={`Remove ${property}`}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };
    
    if (!elementData) {
        return (
            <div className="p-4 text-gray-500">
                <p>Pilih sebuah elemen dari preview untuk diedit.</p>
            </div>
        );
    }

    const isImage = 'path' in elementData;
    const isWrapper = !isImage && !('text' in elementData);

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Element Editor</h3>

            {/* Info Type Element */}
            <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                Type: {isImage ? 'Image' : isWrapper ? 'Wrapper' : 'Text'}
            </div>

            {/* Editor untuk Teks */}
            {elementData.text !== undefined && (
                <div>
                    <label className="block text-sm font-medium mb-1">Teks</label>
                    <textarea
                        value={data.text || ''}
                        onChange={(e) => handleChange('text', e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="4"
                        placeholder="Masukkan teks..."
                    />
                </div>
            )}

            {/* Editor untuk Gambar */}
            {isImage && (
                <div>
                    <label className="block text-sm font-medium mb-1">Path Gambar</label>
                    <input
                        type="text"
                        value={data.path || ''}
                        onChange={(e) => handleChange('path', e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="/images/themes/theme-name/image.webp"
                    />
                </div>
            )}

            {/* Editor untuk Order */}
            <div>
                <label className="block text-sm font-medium mb-1">Urutan (Order)</label>
                <input
                    type="number"
                    value={data.order || 1}
                    onChange={(e) => handleChange('order', parseInt(e.target.value, 10))}
                    className="w-full p-2 border rounded"
                    min="1"
                />
            </div>

            {/* Editor untuk Animasi */}
            <div>
                <label className="block text-sm font-medium mb-1">Animasi</label>
                <select
                    value={data.animation || ''}
                    onChange={(e) => handleChange('animation', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Tidak Ada</option>
                    {Object.keys(animationVariants).map(anim => (
                        <option key={anim} value={anim}>{anim}</option>
                    ))}
                </select>
            </div>

            {/* Editor untuk Text Style */}
            {data.textStyle && renderStyleEditor('textStyle', `{
  "fontSize": "2rem",
  "color": "#ffffff",
  "position": "relative",
  "textAlign": "center"
}`)}

            {/* Editor untuk Image Style */}
            {data.imageStyle && renderStyleEditor('imageStyle', `{
  "width": "100%",
  "height": "auto",
  "borderRadius": "50%",
  "position": "absolute"
}`)}

            {/* Editor untuk Wrapper Style */}
            {data.wrapperStyle && renderStyleEditor('wrapperStyle', `{
  "position": "relative",
  "width": "100%",
  "backgroundColor": "rgba(0, 0, 0, 0.5)",
  "zIndex": 2
}`)}

            <button
                onClick={onSave}
                className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
            >
                Simpan Perubahan
            </button>

            {/* DEBUG INFO */}
            <div className="mt-4 p-2 bg-gray-100 text-xs">
                <strong>DEBUG Element Data:</strong>
                <pre className="mt-1 overflow-auto max-h-32">
                    {JSON.stringify(elementData, null, 2)}
                </pre>
            </div>
        </div>
    );
}