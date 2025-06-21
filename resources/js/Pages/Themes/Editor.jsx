import React, { useState, useCallback, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';

import SectionList from './Partials/Editor/SectionList';
import PreviewPane from './Partials/Editor/PreviewPane';
import ElementEditor from './Partials/Editor/ElementEditor.jsx';

export default function Editor() {
    const { theme: initialTheme } = usePage().props;

    // State utama untuk seluruh data tema yang sedang diedit
    const [themeData, setThemeData] = useState(initialTheme);
    // State untuk mengetahui elemen mana yang sedang dipilih
    const [selectedElementPath, setSelectedElementPath] = useState(null);

    // Memoize data elemen yang dipilih dengan perbaikan path
    const selectedElementData = useMemo(() => {
        if (!selectedElementPath || selectedElementPath.length < 2) return null;
        
        try {
            console.log('Selected path:', selectedElementPath); // DEBUG
            console.log('Theme data structure:', themeData); // DEBUG
            
            // Path format: [sectionIndex, elementKey, ...subKeys]
            const [sectionIndex, ...elementPath] = selectedElementPath;
            
            // Ambil sections dari theme data (bisa sections_json yang sudah di-parse atau sections)
            const sections = themeData.sections || JSON.parse(themeData.sections_json || '[]');
            
            if (!sections[sectionIndex]) {
                console.log('Section not found:', sectionIndex);
                return null;
            }
            
            // Traverse ke elemen yang dipilih
            let current = sections[sectionIndex];
            for (const key of elementPath) {
                if (!current || typeof current !== 'object' || !current[key]) {
                    console.log('Element not found at path:', elementPath, 'current:', current);
                    return null;
                }
                current = current[key];
            }
            
            console.log('Found element data:', current); // DEBUG
            return current;
        } catch (error) {
            console.error('Error getting selected element:', error);
            return null;
        }
    }, [selectedElementPath, themeData]);

    // Callback untuk memilih elemen dari PreviewPane
    const handleSelectElement = useCallback((path, elementData) => {
        console.log('Element selected:', path, elementData); // DEBUG
        setSelectedElementPath(path);
    }, []);

    // Callback untuk mengupdate data elemen dari ElementEditor secara live
    const handleUpdateElement = useCallback((newValues) => {
        if (!selectedElementPath || selectedElementPath.length < 2) return;

        console.log('Updating element:', selectedElementPath, newValues); // DEBUG

        setThemeData(prevTheme => {
            const newTheme = JSON.parse(JSON.stringify(prevTheme)); // Deep copy
            const [sectionIndex, ...elementPath] = selectedElementPath;
            
            // Ambil sections
            const sections = newTheme.sections || JSON.parse(newTheme.sections_json || '[]');
            
            if (!sections[sectionIndex]) return prevTheme;
            
            // Navigate ke parent dari elemen yang dituju
            let current = sections[sectionIndex];
            elementPath.slice(0, -1).forEach(key => {
                if (current[key]) current = current[key];
            });
            
            // Update elemen
            const finalKey = elementPath[elementPath.length - 1];
            if (current[finalKey]) {
                current[finalKey] = { ...current[finalKey], ...newValues };
            }

            // Update theme data
            if (newTheme.sections) {
                newTheme.sections = sections;
            } else {
                newTheme.sections_json = JSON.stringify(sections);
            }

            return newTheme;
        });
    }, [selectedElementPath]);

    // Fungsi untuk menyimpan perubahan ke backend
    const handleSave = () => {
        if (!selectedElementPath || !selectedElementData || selectedElementPath.length < 2) return;

        const [sectionIndex, ...elementPath] = selectedElementPath;
        const fieldName = elementPath.join('.'); // e.g., heroTextWrapper.title
        const dataToSave = selectedElementData;

        console.log('Saving:', { sectionIndex, fieldName, dataToSave }); // DEBUG

        router.put(
            `/themes/${themeData.id}/sections/${sectionIndex}`,
            {
                fieldName: fieldName,
                data: dataToSave,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Berhasil disimpan!');
                },
                onError: (errors) => {
                    console.error('Gagal menyimpan:', errors);
                }
            }
        );
    };

    return (
        <div className="flex h-screen w-full bg-gray-200">
            {/* Panel Kiri: Daftar Section */}
            <div className="w-1/5 bg-white shadow-md overflow-y-auto relative z-20">
                <SectionList
                    sections={themeData.sections || JSON.parse(themeData.sections_json || '[]')}
                    onSelectSection={(index) => {
                        const element = document.getElementById(`section-${index}`);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}
                />
            </div>

            {/* Panel Tengah: Preview Undangan */}
            <div className="w-3/5 relative z-10">
                 <PreviewPane
                    theme={themeData}
                    onSelectElement={handleSelectElement}
                    selectedElementPath={selectedElementPath}
                 />
            </div>

            {/* Panel Kanan: Editor Properti Elemen */}
            <div className="w-1/5 bg-white shadow-md overflow-y-auto relative z-20">
                <ElementEditor
                    key={selectedElementPath ? selectedElementPath.join('.') : 'no-selection'}
                    elementData={selectedElementData}
                    onUpdate={handleUpdateElement}
                    onSave={handleSave}
                />
                
                {/* DEBUG INFO */}
                {selectedElementPath && (
                    <div className="p-4 bg-gray-100 text-xs">
                        <strong>DEBUG:</strong><br/>
                        Path: {selectedElementPath.join(' > ')}<br/>
                        Data: {selectedElementData ? 'Found' : 'Not Found'}
                    </div>
                )}
            </div>
        </div>
    );
}