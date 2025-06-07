import React, { useState, useEffect } from 'react';

export default function ModalEditField({ open, initialValue, onClose, onSave, label = "Edit" }) {
    const [text, setText] = useState(initialValue?.text || '');
    const [color, setColor] = useState(initialValue?.color || '#000000');
    const [size, setSize] = useState(initialValue?.size || '16px');

    useEffect(() => {
        setText(initialValue?.text || '');
        setColor(initialValue?.color || '#000000');
        setSize(initialValue?.size || '16px');
    }, [initialValue, open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{label}</h2>
                <textarea
                    className="border p-2 w-full mb-4"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={4}
                />
                <div className="flex gap-4 mb-4">
                    <div>
                        <label className="block text-sm mb-1">Warna</label>
                        <input
                            type="color"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Ukuran</label>
                        <input
                            type="number"
                            min={8}
                            max={72}
                            value={parseInt(size)}
                            onChange={e => setSize(e.target.value + 'px')}
                            className="border p-1 w-16"
                        /> px
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onSave({ text, color, size })}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Simpan
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}