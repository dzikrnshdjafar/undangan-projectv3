import React, { useState } from 'react';

// Helper function yang sama seperti di DynamicSection - ditambahkan style properties
const isElementKey = (key) => !['type', 'order', 'minHeight', 'wrapperStyle', 'imageStyle', 'textStyle', 'text', 'path', 'animation'].includes(key);

export default function SectionList({ sections, onSelectSection, onSelectElement, selectedElementPath }) {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (sectionIndex) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex]
        }));
    };

    const handleElementClick = (sectionIndex, elementKey) => {
        const path = [sectionIndex, elementKey];
        const section = sections[sectionIndex];
        const elementData = section[elementKey];
        onSelectElement(path, elementData);
    };

    const renderElements = (section, sectionIndex, parentPath = []) => {
        const elementKeys = Object.keys(section)
            .filter(key => isElementKey(key) && typeof section[key] === 'object');

        const sortedElementKeys = elementKeys.sort((a, b) => {
            const orderA = section[a]?.order || 0;
            const orderB = section[b]?.order || 0;
            return orderA - orderB;
        });

        return sortedElementKeys.map(elementKey => {
            const element = section[elementKey];
            const currentPath = [...parentPath, elementKey];
            const fullPath = [sectionIndex, ...currentPath];
            const isSelected = selectedElementPath && 
                selectedElementPath.join('.') === fullPath.join('.');

            // Deteksi tipe element
            const isImage = 'path' in element;
            const isText = 'text' in element;
            const hasChildren = Object.keys(element).some(key => 
                isElementKey(key) && typeof element[key] === 'object'
            );

            let elementType = 'Wrapper';
            if (isImage && !hasChildren) elementType = 'Image';
            else if (isText && !hasChildren) elementType = 'Text';
            else if (isImage || isText) elementType = `${isImage ? 'Image' : 'Text'} + Children`;

            return (
                <div key={elementKey} className="ml-4">
                    <button
                        onClick={() => handleElementClick(sectionIndex, ...currentPath)}
                        className={`w-full text-left p-2 rounded text-sm transition ${
                            isSelected 
                                ? 'bg-blue-500 text-white' 
                                : 'hover:bg-gray-100 focus:outline-none focus:bg-blue-100'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span>
                                {elementKey} 
                                <span className="text-xs opacity-70 ml-1">({elementType})</span>
                            </span>
                            {element.order && (
                                <span className="text-xs bg-gray-200 px-1 rounded">
                                    #{element.order}
                                </span>
                            )}
                        </div>
                        {/* Preview teks atau path jika ada */}
                        {element.text && (
                            <div className="text-xs opacity-60 truncate mt-1">
                                {element.text.replace(/<[^>]*>/g, '').substring(0, 50)}...
                            </div>
                        )}
                        {element.path && (
                            <div className="text-xs opacity-60 truncate mt-1">
                                {element.path}
                            </div>
                        )}
                    </button>

                    {/* Render children elements recursively */}
                    {hasChildren && (
                        <div className="ml-2 border-l border-gray-200">
                            {renderChildElements(element, sectionIndex, currentPath)}
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderChildElements = (parentElement, sectionIndex, parentPath) => {
        const childKeys = Object.keys(parentElement)
            .filter(key => isElementKey(key) && typeof parentElement[key] === 'object');

        const sortedChildKeys = childKeys.sort((a, b) => {
            const orderA = parentElement[a]?.order || 0;
            const orderB = parentElement[b]?.order || 0;
            return orderA - orderB;
        });

        return sortedChildKeys.map(childKey => {
            const child = parentElement[childKey];
            const currentPath = [...parentPath, childKey];
            const fullPath = [sectionIndex, ...currentPath];
            const isSelected = selectedElementPath && 
                selectedElementPath.join('.') === fullPath.join('.');

            // Deteksi tipe child element
            const isImage = 'path' in child;
            const isText = 'text' in child;
            const hasChildren = Object.keys(child).some(key => 
                isElementKey(key) && typeof child[key] === 'object'
            );

            let elementType = 'Wrapper';
            if (isImage && !hasChildren) elementType = 'Image';
            else if (isText && !hasChildren) elementType = 'Text';
            else if (isImage || isText) elementType = `${isImage ? 'Image' : 'Text'} + Children`;

            return (
                <div key={childKey} className="ml-2">
                    <button
                        onClick={() => {
                            const path = [sectionIndex, ...currentPath];
                            onSelectElement(path, child);
                        }}
                        className={`w-full text-left p-1 rounded text-xs transition ${
                            isSelected 
                                ? 'bg-blue-500 text-white' 
                                : 'hover:bg-gray-100 focus:outline-none focus:bg-blue-100'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span>
                                {childKey}
                                <span className="text-xs opacity-70 ml-1">({elementType})</span>
                            </span>
                            {child.order && (
                                <span className="text-xs bg-gray-200 px-1 rounded">
                                    #{child.order}
                                </span>
                            )}
                        </div>
                        {/* Preview teks atau path jika ada */}
                        {child.text && (
                            <div className="text-xs opacity-60 truncate mt-1">
                                {child.text.replace(/<[^>]*>/g, '').substring(0, 30)}...
                            </div>
                        )}
                        {child.path && (
                            <div className="text-xs opacity-60 truncate mt-1">
                                {child.path}
                            </div>
                        )}
                    </button>

                    {/* Recursive rendering untuk nested children */}
                    {hasChildren && (
                        <div className="ml-2 border-l border-gray-200">
                            {renderChildElements(child, sectionIndex, currentPath)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Sections & Elements</h2>
            <ul className="space-y-2">
                {sections.map((section, index) => (
                    <li key={index} className="border rounded">
                        {/* Section Header */}
                        <div className="flex items-center">
                            <button
                                onClick={() => toggleSection(index)}
                                className="flex-1 text-left p-3 font-medium hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition flex items-center justify-between"
                            >
                                <span>
                                    Section {index + 1}: {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                                </span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${
                                        expandedSections[index] ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onSelectSection(index)}
                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition mr-2"
                                title="Scroll to section"
                            >
                                Go
                            </button>
                        </div>

                        {/* Elements List */}
                        {expandedSections[index] && (
                            <div className="border-t bg-gray-50 p-2">
                                {renderElements(section, index)}
                                {Object.keys(section).filter(key => 
                                    isElementKey(key) && typeof section[key] === 'object'
                                ).length === 0 && (
                                    <div className="text-xs text-gray-500 italic p-2">
                                        No elements found in this section
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}