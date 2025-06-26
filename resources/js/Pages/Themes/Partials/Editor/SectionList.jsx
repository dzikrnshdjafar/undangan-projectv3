import React, { useState } from 'react';

// Helper function yang sama seperti di DynamicSection - ditambahkan style properties
const isElementKey = (key) => !['type', 'order', 'minHeight', 'wrapperStyle', 'buttonStyle', 'videoStyle', 'formStyle', 'inputStyle', 'selectStyle', 'textareaStyle', 'listStyle', 'itemStyle', 'imageStyle', 'textStyle', 'text', 'path', 'animation', 'src', 'href', 'action', 'method', 'placeholder', 'required', 'options', 'controls', 'autoPlay', 'muted', 'loop', 'allowFullScreen', 'ordered', 'items'].includes(key);

// Helper function untuk menentukan apakah element bisa memiliki children
const canHaveChildren = (elementType) => {
    return elementType === 'wrapper' || elementType === 'form';
};

export default function SectionList({ sections, onSelectSection, onSelectElement, selectedElementPath, onAddSection, onAddElement, onDeleteSection, onDeleteElement }) {
    const [expandedSections, setExpandedSections] = useState({});
    const [showAddSectionModal, setShowAddSectionModal] = useState(false);
    const [showAddElementModal, setShowAddElementModal] = useState(false);
    const [addElementTarget, setAddElementTarget] = useState(null); // { sectionIndex, parentPath }

    const toggleSection = (sectionIndex) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex]
        }));
    };

    const handleElementClick = (sectionIndex, ...elementPath) => {
        const path = [sectionIndex, ...elementPath];
        const section = sections[sectionIndex];
        
        // Navigate to element
        let elementData = section;
        for (const key of elementPath) {
            elementData = elementData[key];
        }
        
        onSelectElement(path, elementData);
    };

    // Handler untuk menambah section baru
    const handleAddSection = (sectionData) => {
        onAddSection(sectionData);
        setShowAddSectionModal(false);
    };

    // Handler untuk menambah element baru
    const handleAddElement = (elementData) => {
        if (addElementTarget) {
            onAddElement(addElementTarget.sectionIndex, addElementTarget.parentPath, elementData);
        }
        setShowAddElementModal(false);
        setAddElementTarget(null);
    };

    // Handler untuk menghapus element
    const handleDeleteElement = (sectionIndex, elementPath) => {
        const elementKey = elementPath[elementPath.length - 1];
        const parentPath = elementPath.slice(0, -1);
        
        // Get element data untuk konfirmasi
        let current = sections[sectionIndex];
        for (const key of elementPath) {
            current = current[key];
        }
        
        const elementType = current.type || 'wrapper';
        const hasChildren = Object.keys(current).some(key => 
            isElementKey(key) && typeof current[key] === 'object'
        );
        
        // Konfirmasi delete dengan warning untuk wrapper dengan children
        let confirmMessage = `Are you sure you want to delete element "${elementKey}"?`;
        if (hasChildren && canHaveChildren(elementType)) {
            confirmMessage += '\n\nThis element contains child elements that will also be deleted.';
        }
        
        if (confirm(confirmMessage)) {
            onDeleteElement(sectionIndex, parentPath, elementKey);
        }
    };

    const renderElements = (section, sectionIndex, parentPath = []) => {
        const elementKeys = Object.keys(section)
            .filter(key => isElementKey(key) && typeof section[key] === 'object');

        const sortedElementKeys = elementKeys.sort((a, b) => {
            const orderA = section[a]?.order || 0;
            const orderB = section[b]?.order || 0;
            return orderA - orderB;
        });

        return (
            <>
                {sortedElementKeys.map(elementKey => {
                    const element = section[elementKey];
                    const currentPath = [...parentPath, elementKey];
                    const fullPath = [sectionIndex, ...currentPath];
                    const isSelected = selectedElementPath && 
                        selectedElementPath.join('.') === fullPath.join('.');

                    // Deteksi tipe element berdasarkan struktur yang baru
                    let elementType = element.type || 'wrapper';
                    if (!element.type) {
                        if ('path' in element) elementType = 'image';
                        else if ('text' in element) elementType = 'text';
                        else if ('href' in element) elementType = 'button';
                        else if ('src' in element) elementType = 'video';
                        else if ('placeholder' in element) elementType = 'input';
                        else if ('options' in element) elementType = 'select';
                        else if ('action' in element) elementType = 'form';
                    }

                    const hasChildren = Object.keys(element).some(key => 
                        isElementKey(key) && typeof element[key] === 'object'
                    );

                    // Check if this element can have children
                    const elementCanHaveChildren = canHaveChildren(elementType);

                    return (
                        <div key={elementKey} className="ml-4">
                            <div className="flex items-center group">
                                <button
                                    onClick={() => handleElementClick(sectionIndex, ...currentPath)}
                                    className={`flex-1 text-left p-2 rounded text-sm transition ${
                                        isSelected 
                                            ? 'bg-blue-500 text-white' 
                                            : 'hover:bg-gray-100 focus:outline-none focus:bg-blue-100'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>
                                            {elementKey} 
                                            <span className="text-xs opacity-70 ml-1">({elementType})</span>
                                            {/* Visual indicator untuk wrapper yang bisa memiliki children */}
                                            {elementCanHaveChildren && (
                                                <span className="text-xs bg-green-200 px-1 rounded ml-1" title="Can have children">
                                                    📁
                                                </span>
                                            )}
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

                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Add Element Button - HANYA untuk wrapper dan form */}
                                    {elementCanHaveChildren && (
                                        <button
                                            onClick={() => {
                                                setAddElementTarget({ sectionIndex, parentPath: currentPath });
                                                setShowAddElementModal(true);
                                            }}
                                            className="ml-1 p-1 text-xs text-green-600 hover:bg-green-100 rounded"
                                            title="Add child element"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Delete Element Button */}
                                    <button
                                        onClick={() => handleDeleteElement(sectionIndex, currentPath)}
                                        className="ml-1 p-1 text-xs text-red-600 hover:bg-red-100 rounded"
                                        title={hasChildren && elementCanHaveChildren ? "Delete element and all children" : "Delete element"}
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Render children elements recursively - HANYA untuk wrapper dan form */}
                            {hasChildren && elementCanHaveChildren && (
                                <div className="ml-2 border-l border-gray-200">
                                    {renderChildElements(element, sectionIndex, currentPath)}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add Element to Section Root */}
                {parentPath.length === 0 && (
                    <div className="ml-4 mt-2">
                        <button
                            onClick={() => {
                                setAddElementTarget({ sectionIndex, parentPath: [] });
                                setShowAddElementModal(true);
                            }}
                            className="flex items-center p-2 text-sm text-green-600 hover:bg-green-50 rounded border-2 border-dashed border-green-300 w-full transition"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Element
                        </button>
                    </div>
                )}
            </>
        );
    };

    const renderChildElements = (parentElement, sectionIndex, parentPath) => {
        const childKeys = Object.keys(parentElement)
            .filter(key => isElementKey(key) && typeof parentElement[key] === 'object');

        const sortedChildKeys = childKeys.sort((a, b) => {
            const orderA = parentElement[a]?.order || 0;
            const orderB = parentElement[b]?.order || 0;
            return orderA - orderB;
        });

        return (
            <>
                {sortedChildKeys.map(childKey => {
                    const child = parentElement[childKey];
                    const currentPath = [...parentPath, childKey];
                    const fullPath = [sectionIndex, ...currentPath];
                    const isSelected = selectedElementPath && 
                        selectedElementPath.join('.') === fullPath.join('.');

                    // Deteksi tipe child element
                    let elementType = child.type || 'wrapper';
                    if (!child.type) {
                        if ('path' in child) elementType = 'image';
                        else if ('text' in child) elementType = 'text';
                        else if ('href' in child) elementType = 'button';
                        else if ('src' in child) elementType = 'video';
                        else if ('placeholder' in child) elementType = 'input';
                        else if ('options' in child) elementType = 'select';
                        else if ('action' in child) elementType = 'form';
                    }

                    const hasChildren = Object.keys(child).some(key => 
                        isElementKey(key) && typeof child[key] === 'object'
                    );

                    // Check if this child element can have children
                    const childCanHaveChildren = canHaveChildren(elementType);

                    return (
                        <div key={childKey} className="ml-2">
                            <div className="flex items-center group">
                                <button
                                    onClick={() => {
                                        const path = [sectionIndex, ...currentPath];
                                        onSelectElement(path, child);
                                    }}
                                    className={`flex-1 text-left p-1 rounded text-xs transition ${
                                        isSelected 
                                            ? 'bg-blue-500 text-white' 
                                            : 'hover:bg-gray-100 focus:outline-none focus:bg-blue-100'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>
                                            {childKey}
                                            <span className="text-xs opacity-70 ml-1">({elementType})</span>
                                            {/* Visual indicator untuk wrapper yang bisa memiliki children */}
                                            {childCanHaveChildren && (
                                                <span className="text-xs bg-green-200 px-1 rounded ml-1" title="Can have children">
                                                    📁
                                                </span>
                                            )}
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

                               {/* Action Buttons Container */}
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Add Child Element Button - HANYA untuk wrapper dan form */}
                                    {childCanHaveChildren && (
                                        <button
                                            onClick={() => {
                                                setAddElementTarget({ sectionIndex, parentPath: currentPath });
                                                setShowAddElementModal(true);
                                            }}
                                            className="ml-1 p-1 text-xs text-green-600 hover:bg-green-100 rounded"
                                            title="Add child element"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Delete Child Element Button */}
                                    <button
                                        onClick={() => handleDeleteElement(sectionIndex, currentPath)}
                                        className="ml-1 p-1 text-xs text-red-600 hover:bg-red-100 rounded"
                                        title={hasChildren && childCanHaveChildren ? "Delete element and all children" : "Delete element"}
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Recursive rendering untuk nested children - HANYA untuk wrapper dan form */}
                            {hasChildren && childCanHaveChildren && (
                                <div className="ml-2 border-l border-gray-200">
                                    {renderChildElements(child, sectionIndex, currentPath)}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add Child Element Button - Hanya tampil jika parent adalah wrapper atau form */}
                {(() => {
                    // Get parent element type
                    let current = sections[sectionIndex];
                    for (const key of parentPath.slice(0, -1)) {
                        current = current[key];
                    }
                    const parentKey = parentPath[parentPath.length - 1];
                    const parentElementType = current[parentKey]?.type || 'wrapper';
                    
                    return canHaveChildren(parentElementType) && (
                        <div className="ml-2 mt-1">
                            <button
                                onClick={() => {
                                    setAddElementTarget({ sectionIndex, parentPath });
                                    setShowAddElementModal(true);
                                }}
                                className="flex items-center p-1 text-xs text-green-600 hover:bg-green-50 rounded border border-dashed border-green-300 w-full transition"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Child
                            </button>
                        </div>
                    );
                })()}
            </>
        );
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-lg font-bold">Sections & Elements</h2>
                <button
                    onClick={() => setShowAddSectionModal(true)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                    title="Add new section"
                >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Section
                </button>
            </div>

            <ul className="space-y-2">
                {sections.map((section, index) => (
                    <li key={index} className="border rounded">
                        {/* Section Header */}
                        <div className="flex items-center">
                            <button
                                onClick={() => onSelectSection(index)}
                                className="flex-1 text-left p-3 font-medium hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition flex items-center justify-between"
                            >
                                <span>
                                    Section {index + 1}: {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                                </span>
                            </button>

                             <button
                                onClick={() => onDeleteSection(index)}
                                className="px-2 py-1 text-red-600 hover:bg-red-100 rounded text-xs mr-1"
                                title="Delete section"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                                
                            <button
                                onClick={() => toggleSection(index)}
                                className="px-3 py-1 text-xs transition mr-2"
                                title="Toggle section"
                            >
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

            {/* Add Section Modal */}
            {showAddSectionModal && (
                <AddSectionModal
                    onAdd={handleAddSection}
                    onCancel={() => setShowAddSectionModal(false)}
                />
            )}

            {/* Add Element Modal */}
            {showAddElementModal && (
                <AddElementModal
                    onAdd={handleAddElement}
                    onCancel={() => {
                        setShowAddElementModal(false);
                        setAddElementTarget(null);
                    }}
                />
            )}
        </div>
    );
}

// Modal untuk menambah Section baru
function AddSectionModal({ onAdd, onCancel }) {
    const [sectionType, setSectionType] = useState('opening');
    const [minHeight, setMinHeight] = useState('100vh');

    const handleSubmit = (e) => {
        e.preventDefault();
        const sectionData = {
            type: sectionType,
            minHeight: minHeight,
            wrapperStyle: {
                position: 'relative',
                overflow: 'hidden'
            }
        };
        onAdd(sectionData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-bold mb-4">Add New Section</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Section Type</label>
                        <select
                            value={sectionType}
                            onChange={(e) => setSectionType(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="opening">Opening</option>
                            <option value="couple">Couple</option>
                            <option value="event">Event</option>
                            <option value="gallery">Gallery</option>
                            <option value="contact">Contact</option>
                            <option value="closing">Closing</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Min Height</label>
                        <input
                            type="text"
                            value={minHeight}
                            onChange={(e) => setMinHeight(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="100vh"
                            required
                        />
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                        >
                            Add Section
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Modal untuk menambah Element baru
function AddElementModal({ onAdd, onCancel }) {
    const [elementKey, setElementKey] = useState('');
    const [elementType, setElementType] = useState('wrapper');
    const [elementOrder, setElementOrder] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Base element data
        let elementData = {
            type: elementType,
            order: elementOrder
        };

        // Add default properties based on element type
        switch (elementType) {
            case 'text':
                elementData.text = 'Sample Text';
                elementData.textStyle = {
                    fontSize: '1rem',
                    color: '#333',
                    textAlign: 'center'
                };
                break;
            case 'image':
                elementData.path = '/images/themes/sample.webp';
                elementData.imageStyle = {
                    width: '100%',
                    height: 'auto'
                };
                break;
            case 'button':
                elementData.text = 'Click Me';
                elementData.href = '#';
                elementData.buttonStyle = {
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px'
                };
                break;
            case 'video':
                elementData.src = '/videos/sample.mp4';
                elementData.controls = true;
                elementData.videoStyle = {
                    width: '100%',
                    height: 'auto'
                };
                break;
            case 'input':
                elementData.inputType = 'text';
                elementData.placeholder = 'Enter text...';
                elementData.inputStyle = {
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                };
                break;
            case 'form':
                elementData.action = '/submit';
                elementData.method = 'POST';
                elementData.formStyle = {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                };
                break;
                case 'gift':
                    elementData.giftStyle = {
                    width: "90%",
                    margin: "40px auto",
                    padding: "30px",
                    maxWidth: "700px",
                    position: "relative",
                    boxShadow: "0 8px 32px rgba(24, 20, 20, 0.1)",
                    textAlign: "center",
                    borderRadius: "15px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)"
                    };
                    elementData.giftBoxStyle = 
                        {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  backgroundColor: "#fafafa"
};
                    break;
                    case 'wrapper':
            default:
                elementData.wrapperStyle = {
                    position: 'relative',
                    width: '100%'
                };
                break;
        }

        onAdd({ key: elementKey, data: elementData });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-bold mb-4">Add New Element</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Element Key</label>
                        <input
                            type="text"
                            value={elementKey}
                            onChange={(e) => setElementKey(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="elementName"
                            required
                            pattern="[a-zA-Z_][a-zA-Z0-9_]*"
                            title="Element key must start with letter or underscore, followed by letters, numbers or underscores"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Element Type</label>
                        <select
                            value={elementType}
                            onChange={(e) => setElementType(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="wrapper">Wrapper (Can have children)</option>
                            <option value="form">Form (Can have children)</option>
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                            <option value="button">Button</option>
                            <option value="video">Video</option>
                            <option value="iframe">Iframe</option>
                            <option value="input">Input</option>
                            <option value="select">Select</option>
                            <option value="textarea">Textarea</option>
                            <option value="list">List</option>
                            <option value="countdown">Countdown</option>
                            <option value="rsvp">RSVP</option>
                            <option value="gift">Gift</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Order</label>
                        <input
                            type="number"
                            value={elementOrder}
                            onChange={(e) => setElementOrder(parseInt(e.target.value, 10))}
                            className="w-full p-2 border rounded"
                            min="1"
                            required
                        />
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                        >
                            Add Element
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}