import React, { useState, useCallback, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';

import SectionList from './Partials/Editor/SectionList';
import PreviewPane from './Partials/Editor/PreviewPane';
import ElementEditor from './Partials/Editor/ElementEditor.jsx';

export default function Editor() {
    const { theme: initialTheme } = usePage().props;

    const editorContext = initialTheme.editor_context || 'theme';

    // State utama untuk seluruh data tema yang sedang diedit
    const [themeData, setThemeData] = useState(initialTheme);
    // State untuk mengetahui elemen mana yang sedang dipilih
    const [selectedElementPath, setSelectedElementPath] = useState(null);

    const [hiddenElements, setHiddenElements] = useState({});

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
        const fieldName = elementPath.join('.');
        const dataToSave = selectedElementData;

        // Tentukan URL berdasarkan konteks
        const url = editorContext === 'invitation'
            ? `/invitations/${themeData.slug}/sections/${sectionIndex}`
            : `/themes/${themeData.id}/sections/${sectionIndex}`;

        router.put(
            url,
            { fieldName: fieldName, data: dataToSave },
            {
                preserveScroll: true,
                onSuccess: () => console.log('Berhasil disimpan!'),
                onError: (errors) => console.error('Gagal menyimpan:', errors),
            }
        );
    };

    const handleToggleElementVisibility = useCallback((pathKey) => {
        setHiddenElements(prev => ({
            ...prev,
            [pathKey]: !prev[pathKey]
        }));
    }, []);

     React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedElementPath(null);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleAddSection = useCallback((sectionData) => {
        // Optimistic update - update state dulu
        setThemeData(prevTheme => {
            const newTheme = { ...prevTheme };
            const sections = newTheme.sections || JSON.parse(newTheme.sections_json || '[]');
            
            sections.push(sectionData);
            
            if (newTheme.sections) {
                newTheme.sections = sections;
            } else {
                newTheme.sections_json = JSON.stringify(sections);
            }
            
            return newTheme;
        });

        // Kirim ke server
        router.post(`/themes/${themeData.id}/sections`, sectionData, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Section added successfully!');
            },
            onError: (errors) => {
                console.error('Failed to add section:', errors);
                // Rollback state jika gagal
                setThemeData(initialTheme);
                alert('Failed to add section. Please try again.');
            }
        });
    }, [themeData.id, initialTheme]);

    // Handler untuk menambah element baru - UPDATE DENGAN API CALL
    const handleAddElement = useCallback((sectionIndex, parentPath, elementData) => {
        // Optimistic update - update state dulu
        setThemeData(prevTheme => {
            const newTheme = { ...prevTheme };
            const sections = newTheme.sections || JSON.parse(newTheme.sections_json || '[]');
            
            if (!sections[sectionIndex]) return prevTheme;
            
            // Navigate to parent
            let current = sections[sectionIndex];
            for (const key of parentPath) {
                if (!current[key]) current[key] = {};
                current = current[key];
            }
            
            // Add new element
            current[elementData.key] = elementData.data;
            
            if (newTheme.sections) {
                newTheme.sections = sections;
            } else {
                newTheme.sections_json = JSON.stringify(sections);
            }
            
            return newTheme;
        });

        // Kirim ke server
        const requestData = {
            parentPath: parentPath.length > 0 ? parentPath.join('.') : null,
            elementKey: elementData.key,
            elementData: elementData.data
        };

        router.post(`/themes/${themeData.id}/sections/${sectionIndex}/elements`, requestData, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Element added successfully!');
            },
            onError: (errors) => {
                console.error('Failed to add element:', errors);
                // Rollback state jika gagal
                setThemeData(initialTheme);
                alert('Failed to add element. Please try again.');
            }
        });
    }, [themeData.id, initialTheme]);

    // Handler untuk menghapus section - NEW
    const handleDeleteSection = useCallback((sectionIndex) => {
        if (!confirm('Are you sure you want to delete this section?')) {
            return;
        }

        // Optimistic update
        setThemeData(prevTheme => {
            const newTheme = { ...prevTheme };
            const sections = newTheme.sections || JSON.parse(newTheme.sections_json || '[]');
            
            sections.splice(sectionIndex, 1);
            
            if (newTheme.sections) {
                newTheme.sections = sections;
            } else {
                newTheme.sections_json = JSON.stringify(sections);
            }
            
            return newTheme;
        });

        // Clear selection if affected
        if (selectedElementPath && selectedElementPath[0] === sectionIndex) {
            setSelectedElementPath(null);
        }

        // Kirim ke server
        router.delete(`/themes/${themeData.id}/sections/${sectionIndex}`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Section deleted successfully!');
            },
            onError: (errors) => {
                console.error('Failed to delete section:', errors);
                // Rollback state jika gagal
                setThemeData(initialTheme);
                alert('Failed to delete section. Please try again.');
            }
        });
    }, [themeData.id, initialTheme, selectedElementPath]);

    const handleDeleteElement = useCallback((sectionIndex, parentPath, elementKey) => {
    // Optimistic update
    setThemeData(prevTheme => {
        const newTheme = { ...prevTheme };
        const sections = newTheme.sections || JSON.parse(newTheme.sections_json || '[]');
        
        if (!sections[sectionIndex]) return prevTheme;
        
        // Navigate to parent
        let current = sections[sectionIndex];
        for (const key of parentPath) {
            if (!current[key]) return prevTheme;
            current = current[key];
        }
        
        // Delete element (ini akan otomatis menghapus semua children juga)
        delete current[elementKey];
        
        if (newTheme.sections) {
            newTheme.sections = sections;
        } else {
            newTheme.sections_json = JSON.stringify(sections);
        }
        
        return newTheme;
    });

    // Clear selection jika element yang dipilih atau parent-nya dihapus
    if (selectedElementPath) {
        const selectedPath = selectedElementPath.slice();
        const deletedPath = [sectionIndex, ...parentPath, elementKey];
        
        // Check if selected element is the deleted element or its child
        if (selectedPath.length >= deletedPath.length) {
            let isAffected = true;
            for (let i = 0; i < deletedPath.length; i++) {
                if (selectedPath[i] !== deletedPath[i]) {
                    isAffected = false;
                    break;
                }
            }
            if (isAffected) {
                setSelectedElementPath(null);
            }
        }
    }

    // Kirim ke server
    const requestData = {
        parentPath: parentPath.length > 0 ? parentPath.join('.') : null,
        elementKey: elementKey
    };

    router.delete(`/themes/${themeData.id}/sections/${sectionIndex}/elements`, {
        data: requestData,
        preserveScroll: true,
        onSuccess: () => {
            console.log('Element deleted successfully!');
        },
        onError: (errors) => {
            console.error('Failed to delete element:', errors);
            // Rollback state jika gagal
            setThemeData(initialTheme);
            alert('Failed to delete element. Please try again.');
        }
    });
}, [themeData.id, initialTheme, selectedElementPath]);


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
    onSelectElement={handleSelectElement}
    selectedElementPath={selectedElementPath}
    onAddSection={handleAddSection}
    onAddElement={handleAddElement}
    onDeleteSection={handleDeleteSection}
    onDeleteElement={handleDeleteElement} // NEW PROP
    onToggleElementVisibility={handleToggleElementVisibility}
    hiddenElements={hiddenElements}
/>
            </div>

            {/* Panel Tengah: Preview Undangan */}
            <div className="w-3/5 relative z-10">
                 <PreviewPane
                    theme={themeData}
                    onSelectElement={handleSelectElement}
                    selectedElementPath={selectedElementPath}
                    hiddenElements={hiddenElements}
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
                        <br/>
                        Hidden Elements: {Object.keys(hiddenElements).filter(key => hiddenElements[key]).join(', ') || 'None'}
                    </div>
                )}
            </div>
        </div>
    );
}