import React, { useState, useEffect } from 'react';
import { animationVariants } from '../Utils/animations';

export default function ModalEditImage({ open, initialValue, onClose, onSave, onLiveUpdate, label = "Edit" }) {
    // State untuk semua properti yang bisa di-edit
    const [path, setPath] = useState('');
    const [size, setSize] = useState('100px');
    const [position, setPosition] = useState({}); 
    const [animation, setAnimation] = useState('');
     const [zIndex, setZIndex] = useState(1); 
     const [flipX, setFlipX] = useState(false); // <-- State baru untuk flipX
     
     // Mengisi state dengan data awal saat modal dibuka
     useEffect(() => {
         if (open && initialValue) {
             setPath(initialValue.path || '');
             setSize(initialValue.size || '100px');
             setZIndex(initialValue.zIndex || 1);
             setPosition(initialValue.position || {});
             setAnimation(initialValue.animation || '');
             setFlipX(initialValue.flipX || false);
            }
        }, [initialValue, open]);

         // useEffect BARU ini akan mengirim update setiap kali ada perubahan
    useEffect(() => {
        // Jangan kirim update saat modal baru dibuka (initialValue sedang di-set)
        if (!open) return;

        // Panggil onLiveUpdate dengan semua state saat ini
        onLiveUpdate({ path, size, position, animation, zIndex, flipX });

    }, [path, size, position, animation, zIndex, flipX]); // Bergantung pada semua state yang bisa diedit
       
        const animationOptions = Object.keys(animationVariants);
        
    if (!open) return null;

    // Handler untuk input posisi
    const handlePositionChange = (e) => {
        const { name, value } = e.target;
        setPosition(prev => ({ ...prev, [name]: value }));
    };

    // Mengemas semua data saat tombol simpan diklik
    // const handleSaveClick = () => {
    //     onSave({ path, size, position, animation, zIndex, flipX });
    // };

     // 1. Dapatkan status "checked" langsung dari state 'position'
    const isCenteredH = position.left === '50%' && (position.transform || '').includes('translateX(-50%)');
    const isCenteredV = position.top === '50%' && (position.transform || '').includes('translateY(-50%)');

    // 2. Handler untuk mengubah status centering
    const handleToggleCenter = (axis, isChecked) => {
        setPosition(prevPos => {
            let newPos = { ...prevPos };
            let transformParts = (newPos.transform || '').split(' ').filter(Boolean);

            if (axis === 'horizontal') {
                transformParts = transformParts.filter(t => !t.startsWith('translateX'));
                if (isChecked) {
                    newPos.left = '50%';
                    delete newPos.right; // Hapus properti yang konflik
                    transformParts.push('translateX(-50%)');
                } else {
                    delete newPos.left;
                }
            }

            if (axis === 'vertical') {
                transformParts = transformParts.filter(t => !t.startsWith('translateY'));
                if (isChecked) {
                    newPos.top = '50%';
                    delete newPos.bottom; // Hapus properti yang konflik
                    transformParts.push('translateY(-50%)');
                } else {
                    delete newPos.top;
                }
            }
            
            newPos.transform = transformParts.join(' ').trim();
            return newPos;
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{label}</h2>
                
                {/* 1. Input untuk Path Gambar */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Path Gambar</label>
                    <input 
                        type="text" 
                        value={path} 
                        onChange={e => setPath(e.target.value)} 
                        className="border p-2 w-full rounded" 
                        placeholder="/images/decorations/flower.png"
                    />
                </div>

                {/* 2. Input untuk Ukuran Gambar */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Ukuran (Width)</label>
                    <input 
                        type="text" 
                        value={size} 
                        onChange={e => setSize(e.target.value)} 
                        className="border p-2 w-full rounded" 
                        placeholder="cth: 150px atau 20%"
                    />
                </div>
                
                {/* 3. Input untuk Posisi (X dan Y) */}
                <h3 className="text-lg font-semibold mb-2">Posisi (%)</h3>
                <div className="flex gap-4 mb-4 p-2 bg-gray-50 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isCenteredH} onChange={(e) => handleToggleCenter('horizontal', e.target.checked)} className="rounded" />
                        Center Horizontal
                    </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isCenteredV} onChange={(e) => handleToggleCenter('vertical', e.target.checked)} className="rounded" />
                        Center Vertikal
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm mb-1">Top</label>
                        <input type="text" name="top" value={position.top || ''} onChange={handlePositionChange} className="border p-1 w-full rounded" placeholder="20%"/>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Bottom</label>
                        <input type="text" name="bottom" value={position.bottom || ''} onChange={handlePositionChange} className="border p-1 w-full rounded" placeholder="0px"/>
                    </div>
                     <div>
                        <label className="block text-sm mb-1">Left</label>
                        <input type="text" name="left" value={position.left || ''} onChange={handlePositionChange} className="border p-1 w-full rounded" placeholder="50%"/>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Right</label>
                        <input type="text" name="right" value={position.right || ''} onChange={handlePositionChange} className="border p-1 w-full rounded" placeholder="5%"/>
                    </div>
                </div>
                
                {/* 4. Dropdown untuk Memilih Animasi */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Animasi</label>
                    <select 
                        value={animation} 
                        onChange={e => setAnimation(e.target.value)} 
                        className="border p-2 w-full rounded bg-white"
                    >
                        <option value="">Tidak Ada</option>
                        {/* 3. Buat opsi dropdown secara dinamis dari daftar animasi */}
                        {animationOptions.map(animName => (
                            <option key={animName} value={animName}>
                                {animName.charAt(0).toUpperCase() + animName.slice(1)} {/* Membuat nama lebih rapi, cth: "Float" */}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            checked={flipX} 
                            onChange={e => setFlipX(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm font-semibold">Balik Gambar (Flip Horizontal)</span>
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Z-Index (Urutan Tumpukan)</label>
                    <input 
                        type="number" 
                        value={zIndex} 
                        onChange={e => setZIndex(parseInt(e.target.value) || 0)} 
                        className="border p-2 w-full" 
                        placeholder="cth: 1"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Simpan
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}