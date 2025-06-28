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

    // Helper function untuk menambah/menghapus item array
    const handleArrayChange = (arrayKey, index, value, action = 'update') => {
        const currentArray = Array.isArray(data[arrayKey]) ? [...data[arrayKey]] : [];
        
        switch (action) {
            case 'add':
                currentArray.push(value);
                break;
            case 'remove':
                currentArray.splice(index, 1);
                break;
            case 'update':
            default:
                currentArray[index] = value;
                break;
        }
        
        const updatedData = { ...data, [arrayKey]: currentArray };
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

    // Detect element type
    const detectElementType = () => {
        if (data.type) return data.type;
        if ('path' in data) return 'image';
        if ('text' in data) return 'text';
        if ('href' in data) return 'button';
        if ('src' in data) return 'video';
        if ('rsvpStyle' in data) return 'rsvp';
        if ('giftStyle' in data && 'giftBoxStyle' in data) return 'gift';
        return 'wrapper';
    };

    const elementType = detectElementType();
    
    if (!elementData) {
        return (
            <div className="p-4 text-gray-500">
                <p>Pilih sebuah elemen dari preview untuk diedit.</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-bold border-b pb-2">Element Editor</h3>

            {/* Info Type Element */}
            <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                Type: <strong>{elementType}</strong>
            </div>

            {/* Editor untuk Type (manual override) */}
            <div>
                <label className="block text-sm font-medium mb-1">Element Type</label>
                <select
                    value={data.type || ''}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Auto Detect</option>
                    <option value="wrapper">Wrapper</option>
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="button">Button</option>
                    <option value="video">Video</option>
                    <option value="iframe">Iframe</option>
                    <option value="countdown">Countdown</option>
                    <option value="rsvp">RSVP</option>
                    <option value="gift">Gift</option>
                </select>
            </div>

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

            <div className="border border-orange-300 bg-orange-50 p-3 rounded">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={data.modifiable !== false} // Default true jika tidak ada
                        onChange={(e) => handleChange('modifiable', e.target.checked)}
                        className="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <div>
                        <span className="text-sm font-medium text-orange-800">
                            User dapat mengedit element ini
                        </span>
                        <p className="text-xs text-orange-600 mt-1">
                            {data.modifiable !== false 
                                ? "✓ Element ini bisa diedit oleh user di invitation editor" 
                                : "✗ Element ini tidak bisa diedit oleh user (hanya ornamen/struktur)"
                            }
                        </p>
                    </div>
                </label>
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

            {/* Content Editors berdasarkan tipe */}
            
            {/* Text Content */}
            {(['text', 'button'].includes(elementType) || data.text !== undefined) && (
                <div>
                    <label className="block text-sm font-medium mb-1">
                        {elementType === 'button' ? 'Button Text' : 'Teks'}
                    </label>
                    <textarea
                        value={data.text || ''}
                        onChange={(e) => handleChange('text', e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="4"
                        placeholder="Masukkan teks..."
                    />
                </div>
            )}

            {/* Image Path */}
            {(elementType === 'image' || data.path !== undefined) && (
                <div>
                    <label className="block text-sm font-medium mb-1">Path Gambar</label>
                    <input
                        type="text"
                        value={data.path || ''}
                        onChange={(e) => handleChange('path', e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="/images/themes/theme-name/image.webp"
                    />
                    <small className="text-gray-500">Gunakan {'{$slug}'} untuk placeholder nama theme</small>
                </div>
            )}

            {/* Button/Link Properties */}
            {(elementType === 'button' || data.href !== undefined) && (
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Link (href)</label>
                        <input
                            type="text"
                            value={data.href || ''}
                            onChange={(e) => handleChange('href', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="https://example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Target</label>
                        <select
                            value={data.target || '_self'}
                            onChange={(e) => handleChange('target', e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="_self">Same Window</option>
                            <option value="_blank">New Window</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">onClick Function</label>
                        <input
                            type="text"
                            value={data.onClick || ''}
                            onChange={(e) => handleChange('onClick', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="alert('Hello!')"
                        />
                    </div>
                </div>
            )}

            {/* Video/Media Properties */}
            {(elementType === 'video' || data.src !== undefined) && (
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Video Source (src)</label>
                        <input
                            type="text"
                            value={data.src || ''}
                            onChange={(e) => handleChange('src', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="/videos/video.mp4"
                        />
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.controls !== false}
                                onChange={(e) => handleChange('controls', e.target.checked)}
                                className="mr-2"
                            />
                            Show Controls
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.autoPlay || false}
                                onChange={(e) => handleChange('autoPlay', e.target.checked)}
                                className="mr-2"
                            />
                            Auto Play
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.muted || false}
                                onChange={(e) => handleChange('muted', e.target.checked)}
                                className="mr-2"
                            />
                            Muted
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.loop || false}
                                onChange={(e) => handleChange('loop', e.target.checked)}
                                className="mr-2"
                            />
                            Loop
                        </label>
                    </div>
                </div>
            )}

            {/* Iframe Properties */}
            {elementType === 'iframe' && (
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Iframe Source</label>
                        <input
                            type="text"
                            value={data.src || ''}
                            onChange={(e) => handleChange('src', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="https://www.youtube.com/embed/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={data.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Iframe title"
                        />
                    </div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.allowFullScreen || false}
                            onChange={(e) => handleChange('allowFullScreen', e.target.checked)}
                            className="mr-2"
                        />
                        Allow Full Screen
                    </label>
                </div>
            )}

            {/* Style Editors */}
            <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium text-gray-800">Styles</h4>

                {/* Text Style */}
                {(elementType === 'text' || elementType === 'button' || data.textStyle) && 
                    renderStyleEditor('textStyle', `{
  "fontSize": "2rem",
  "color": "#ffffff",
  "position": "relative",
  "textAlign": "center"
}`)}

                {/* Image Style */}
                {(elementType === 'image' || data.imageStyle) && 
                    renderStyleEditor('imageStyle', `{
  "width": "100%",
  "height": "auto",
  "borderRadius": "50%",
  "position": "absolute"
}`)}

                {/* Wrapper Style */}
                {(elementType === 'wrapper' || data.wrapperStyle) && 
                    renderStyleEditor('wrapperStyle', `{
  "position": "relative",
  "width": "100%",
  "backgroundColor": "rgba(0, 0, 0, 0.5)",
  "zIndex": 2
}`)}

                {/* Button Style */}
                {(elementType === 'button' || data.buttonStyle) && 
                    renderStyleEditor('buttonStyle', `{
  "backgroundColor": "#007bff",
  "color": "white",
  "padding": "10px 20px",
  "borderRadius": "5px"
}`)}

                {/* Video Style */}
                {(elementType === 'video' || data.videoStyle) && 
                    renderStyleEditor('videoStyle', `{
  "width": "100%",
  "height": "auto",
  "borderRadius": "8px"
}`)}

{elementType === 'rsvp' && (
    <div className="space-y-4">
        {/* ... Editor untuk Teks (title, description, buttonText) tidak berubah ... */}
        <div>
            <label className="block text-sm font-medium mb-1">Judul</label>
            <input
                type="text"
                value={data.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white"
            />
        </div>
         <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
                value={data.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                rows="3"
            ></textarea>
        </div>
         <div>
            <label className="block text-sm font-medium mb-1">Teks Tombol</label>
            <input
                type="text"
                value={data.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white"
            />
        </div>

        {/* Editor untuk Style dengan nama baru */}
        <h4 className="text-lg font-semibold mt-4 mb-2">RSVP Container Style</h4>
        {renderStyleEditor('rsvpStyle', `{ "textAlign": "center" }`)}

        <h4 className="text-lg font-semibold mt-4 mb-2">Title Style</h4>
        {renderStyleEditor('rsvpTitleStyle', `{ "fontSize": "2rem" }`)}

        <h4 className="text-lg font-semibold mt-4 mb-2">Description Style</h4>
        {renderStyleEditor('rsvpDescriptionStyle', `{ "fontSize": "1rem" }`)}

        <h4 className="text-lg font-semibold mt-4 mb-2">Form Style</h4>
        {renderStyleEditor('rsvpFormStyle', `{ "display": "flex" }`)}

        <h4 className="text-lg font-semibold mt-4 mb-2">Input & Select Style</h4>
        {renderStyleEditor('rsvpInputStyle', `{ "padding": "12px" }`)}

        <h4 className="text-lg font-semibold mt-4 mb-2">Button Style</h4>
        {renderStyleEditor('rsvpButtonStyle', `{ "backgroundColor": "#F08080" }`)}
    </div>
)}

                {elementType === 'countdown' && (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Tanggal & Waktu Acara</label>
            <input
                type="datetime-local"
                value={data.datetime ? data.datetime.replace(' ', 'T') : ''}
                onChange={(e) => handleChange('datetime', e.target.value.replace('T', ' ') + ':00')}
                className="w-full p-2 border rounded bg-gray-700 text-white"
            />
        </div>

        {/* Editor untuk countdownStyle */}
        <div>
            <h4 className="text-lg font-semibold mt-4 mb-2">Countdown Container Style</h4>
            {renderStyleEditor('countdownStyle', `{
  "position": "relative",
  "width": "90%",
  "maxWidth": "600px",
  "margin": "40px auto",
  "padding": "20px",
  "backgroundColor": "rgba(255, 255, 255, 0.9)",
  "borderRadius": "15px",
  "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.1)",
  "zIndex": 2,
  "textAlign": "center"
}`)}
        </div>

        {/* Editor untuk titleStyle */}
        <div>
            <h4 className="text-lg font-semibold mt-4 mb-2">Title Style</h4>
            {renderStyleEditor('titleStyle', `{
  "fontSize": "1.5rem",
  "color": "#333",
  "marginBottom": "20px"
}`)}
        </div>

        {/* Editor untuk timerStyle */}
        <div>
            <h4 className="text-lg font-semibold mt-4 mb-2">Timer Style (Angka)</h4>
            {renderStyleEditor('timerStyle', `{
  "display": "flex",
  "justifyContent": "center",
  "gap": "15px",
  "fontSize": "2rem",
  "fontWeight": "bold",
  "color": "#F08080",
  "backgroundColor": "#00ffff"
}`)}
        </div>

        {/* Editor untuk unitStyle */}
        <div>
            <h4 className="text-lg font-semibold mt-4 mb-2">Unit Style (Teks: Hari, Jam, dll.)</h4>
            {renderStyleEditor('unitStyle', `{
  "fontSize": "0.8rem",
  "color": "#666"
}`)}
        </div>
    </div>
)}

           {/* Gift Editor (Struktur Baru) */}
{elementType === 'gift' && (
    <div className="space-y-4">
        <h3 className="text-xl font-bold mb-4">Edit Wedding Gift</h3>

        {/* Input untuk data teks */}
        <div className="space-y-2">
            <div>
                <label className="block text-sm font-medium mb-1">Bank / E-Wallet</label>
                <input type="text" value={data.bankName || ''} onChange={e => handleChange('bankName', e.target.value)} className="w-full p-2 border rounded bg-gray-700 text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Nomor Rekening</label>
                <input type="text" value={data.accountNumber || ''} onChange={e => handleChange('accountNumber', e.target.value)} className="w-full p-2 border rounded bg-gray-700 text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Nama Pemilik Akun</label>
                <input type="text" value={data.accountName || ''} onChange={e => handleChange('accountName', e.target.value)} className="w-full p-2 border rounded bg-gray-700 text-white" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Teks Tombol</label>
                <input type="text" value={data.buttonText || ''} onChange={e => handleChange('buttonText', e.target.value)} className="w-full p-2 border rounded bg-gray-700 text-white" />
            </div>
        </div>

        {/* Editor untuk semua style */}
        <div className="space-y-3 pt-4 border-t border-gray-600">
            <h4 className="text-lg font-semibold mt-2 mb-2">Container Style</h4>
            {renderStyleEditor('giftStyle', `{ "textAlign": "center" }`)}

            <h4 className="text-lg font-semibold mt-2 mb-2">Gift Box Style</h4>
            {renderStyleEditor('giftBoxStyle', `{ "padding": "20px" }`)}

            <h4 className="text-lg font-semibold mt-2 mb-2">Bank Name Style</h4>
            {renderStyleEditor('giftBankNameStyle', `{ "fontWeight": "bold" }`)}

            <h4 className="text-lg font-semibold mt-2 mb-2">Account Name Style</h4>
            {renderStyleEditor('giftAccountNameStyle', `{ "fontWeight": "bold" }`)}

            <h4 className="text-lg font-semibold mt-2 mb-2">Account Number Style</h4>
            {renderStyleEditor('giftAccountNumberStyle', `{ "color": "#555" }`)}

            <h4 className="text-lg font-semibold mt-2 mb-2">Button Style</h4>
            {renderStyleEditor('giftButtonStyle', `{ "backgroundColor": "#F08080" }`)}
        </div>
    </div>
)}

            
            </div>

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
