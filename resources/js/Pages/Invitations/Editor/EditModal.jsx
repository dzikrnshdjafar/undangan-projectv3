import React, { useState, useEffect, Fragment } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import TextareaInput from '@/Components/TextareaInput';

// --- Helper Components (ditempatkan di dalam file yang sama untuk kemudahan) ---

// Helper untuk mengedit JSON style
const StyleEditor = ({ name, value, onChange }) => {
    const [jsonString, setJsonString] = useState(JSON.stringify(value || {}, null, 2));
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        setJsonString(JSON.stringify(value || {}, null, 2));
    }, [value]);

    const handleJsonChange = (e) => {
        const newJsonString = e.target.value;
        setJsonString(newJsonString);
        try {
            const parsedJson = JSON.parse(newJsonString);
            onChange({ target: { name, value: parsedJson } });
            setIsValid(true);
        } catch (error) {
            setIsValid(false);
        }
    };

    return (
        <div className="pt-2">
            <InputLabel htmlFor={name} value={name.charAt(0).toUpperCase() + name.slice(1)} />
            <TextareaInput
                id={name}
                name={name}
                value={jsonString}
                onChange={handleJsonChange}
                className={`mt-1 block w-full font-mono text-xs ${!isValid ? 'border-red-500 ring-red-500' : ''}`}
                rows={6}
            />
            {!isValid && <p className="text-xs text-red-600 mt-1">Format JSON tidak valid.</p>}
        </div>
    );
};

// Helper untuk field input standar
const FieldWrapper = ({ label, children }) => (
    <div>
        <InputLabel value={label} />
        <div className="mt-1">{children}</div>
    </div>
);

// Helper untuk checkbox
const CheckboxField = ({ name, checked, onChange, children }) => (
    <label className="flex items-center text-sm">
        <input type="checkbox" name={name} checked={!!checked} onChange={onChange} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" />
        <span className="ms-2 text-gray-700">{children}</span>
    </label>
);


// --- Komponen Modal Utama ---

export default function EditModal({ element, path, show, onClose, onSave }) {
    const [data, setData] = useState({});

    useEffect(() => {
        setData(element || {});
    }, [element]);

    if (!element) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setData(currentData => ({ ...currentData, [name]: finalValue }));
    };

    const handleSave = () => {
        onSave(path, data);
    };

    // Logika deteksi tipe elemen yang lebih kuat
    const getElementType = (el) => {
        if (el.type) return el.type;
        if ('datetime' in el) return 'countdown';
        if ('bankName' in el || 'accounts' in el) return 'gift';
        if ('rsvpStyle' in el) return 'rsvp';
        if ('href' in el) return 'button';
        if ('src' in el && 'allowFullScreen' in el) return 'iframe';
        if ('src' in el) return 'video';
        if ('path' in el) return 'image';
        if ('text' in el) return 'text';
        return 'wrapper';
    };

    const elementType = getElementType(data);

    // Daftar field yang boleh ditampilkan berdasarkan tipe elemen
    const getAllowedFields = (type) => {
        const commonFields = ['type', 'order', 'animation'];
        const styleFields = Object.keys(data).filter(key => key.endsWith('Style'));
        
        switch (type) {
            case 'text':
                return [...commonFields, 'text', ...styleFields];
            case 'image':
                return [...commonFields, 'path', ...styleFields];
            case 'button':
                return [...commonFields, 'text', 'href', ...styleFields];
            case 'video':
                return [...commonFields, 'src', 'controls', 'autoPlay', 'muted', 'loop', ...styleFields];
            case 'iframe':
                return [...commonFields, 'src', 'allowFullScreen', ...styleFields];
            case 'countdown':
                return [...commonFields, 'datetime', 'title', 'description', ...styleFields];
            case 'rsvp':
                return [...commonFields, 'title', 'description', 'buttonText', ...styleFields];
            case 'gift':
                return [...commonFields, 'title', 'description', 'buttonText', 'bankName', 'accountName', 'accountNumber', 'accounts', ...styleFields];
            case 'wrapper':
                // Wrapper hanya boleh edit style dan properti struktural
                return [...commonFields, ...styleFields];
            default:
                // Untuk tipe lain, tampilkan field yang relevan saja
                return [...commonFields, ...styleFields];
        }
    };

    const allowedFields = getAllowedFields(elementType);

    // Fungsi untuk merender field yang diizinkan saja
    const renderAllowedFields = () => (
        <Fragment>
            {/* -- KONTEN SPESIFIK -- */}
            {Object.keys(data)
                .filter(key => allowedFields.includes(key) && !key.endsWith('Style')) // Style akan dirender terpisah
                .map(key => {
                    switch (key) {
                        case 'text':
                            return <FieldWrapper key={key} label="Teks"><TextareaInput name="text" value={data.text || ''} onChange={handleChange} rows={3} /></FieldWrapper>;
                        case 'path':
                            return <FieldWrapper key={key} label="Path Gambar"><TextInput name="path" value={data.path || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        case 'href':
                            return <FieldWrapper key={key} label="URL (href)"><TextInput name="href" value={data.href || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        case 'src':
                            return <FieldWrapper key={key} label="Sumber Media (src)"><TextInput name="src" value={data.src || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        case 'datetime':
                            return <FieldWrapper key={key} label="Tanggal & Waktu Acara"><TextInput type="datetime-local" name="datetime" value={(data.datetime || '').substring(0, 16)} onChange={e => handleChange({ target: { name: 'datetime', value: e.target.value.replace('T', ' ') + ':00' } })} className="w-full" /></FieldWrapper>;
                         case 'title':
                        // Hanya tampilkan title jika itu string, bukan object
                        if (typeof data.title === 'string') {
                            return <FieldWrapper key={key} label="Judul"><TextInput name="title" value={data.title || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        }
                        return null;
                    case 'description':
                        // Hanya tampilkan description jika itu string, bukan object
                        if (typeof data.description === 'string') {
                            return <FieldWrapper key={key} label="Deskripsi"><TextareaInput name="description" value={data.description || ''} onChange={handleChange} rows={3} /></FieldWrapper>;
                        }
                        return null;
                    case 'buttonText':
                        // Hanya tampilkan buttonText jika itu string, bukan object
                        if (typeof data.buttonText === 'string') {
                            return <FieldWrapper key={key} label="Teks Tombol"><TextInput name="buttonText" value={data.buttonText || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        }
                        return null;
                            case 'bankName':
                            return <FieldWrapper key={key} label="Nama Bank/E-Wallet"><TextInput name="bankName" value={data.bankName || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        case 'accountNumber':
                            return <FieldWrapper key={key} label="Nomor Rekening/Telp"><TextInput name="accountNumber" value={data.accountNumber || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        case 'accountName':
                            return <FieldWrapper key={key} label="Atas Nama"><TextInput name="accountName" value={data.accountName || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        case 'type':
                            return <FieldWrapper key={key} label="Tipe Element"><TextInput name="type" value={data.type || ''} onChange={handleChange} className="w-full" disabled /></FieldWrapper>;
                        case 'order':
                            return <FieldWrapper key={key} label="Urutan"><TextInput type="number" name="order" value={data.order || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        case 'animation':
                            return <FieldWrapper key={key} label="Animasi"><TextInput name="animation" value={data.animation || ''} onChange={handleChange} className="w-full" /></FieldWrapper>;
                        case 'accounts':
                            // Untuk accounts array, kita bisa tampilkan sebagai JSON editor
                            return (
                                <div key={key} className="pt-2">
                                    <InputLabel value="Daftar Rekening (JSON)" />
                                    <TextareaInput
                                        name="accounts"
                                        value={JSON.stringify(data.accounts || [], null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const accounts = JSON.parse(e.target.value);
                                                handleChange({ target: { name: 'accounts', value: accounts } });
                                            } catch (error) {
                                                // Handle invalid JSON
                                            }
                                        }}
                                        className="mt-1 block w-full font-mono text-xs"
                                        rows={8}
                                    />
                                </div>
                            );
                        default:
                            return null;
                    }
                })}

            {/* -- OPSI BOOLEAN (CHECKBOX) -- */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                {allowedFields.includes('controls') && 'controls' in data && <CheckboxField name="controls" checked={data.controls} onChange={handleChange}>Show Controls</CheckboxField>}
                {allowedFields.includes('autoPlay') && 'autoPlay' in data && <CheckboxField name="autoPlay" checked={data.autoPlay} onChange={handleChange}>Auto Play</CheckboxField>}
                {allowedFields.includes('muted') && 'muted' in data && <CheckboxField name="muted" checked={data.muted} onChange={handleChange}>Muted</CheckboxField>}
                {allowedFields.includes('loop') && 'loop' in data && <CheckboxField name="loop" checked={data.loop} onChange={handleChange}>Loop</CheckboxField>}
                {allowedFields.includes('allowFullScreen') && 'allowFullScreen' in data && <CheckboxField name="allowFullScreen" checked={data.allowFullScreen} onChange={handleChange}>Allow Fullscreen</CheckboxField>}
            </div>

            {/* -- SEMUA STYLE PROPERTIES -- */}
            <div className="pt-4 mt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-800">Gaya (JSON)</h3>
                {Object.keys(data)
                    .filter(key => key.endsWith('Style') && allowedFields.includes(key))
                    .map(styleKey => (
                        <StyleEditor key={styleKey} name={styleKey} value={data[styleKey]} onChange={handleChange} />
                    ))}
            </div>
        </Fragment>
    );

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Edit Element: <span className="font-bold capitalize text-indigo-600">{elementType}</span>
                </h2>
                <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 pr-4">
                    {renderAllowedFields()}
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Batal</SecondaryButton>
                    <PrimaryButton className="ms-3" onClick={handleSave}>
                        Simpan Perubahan
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}