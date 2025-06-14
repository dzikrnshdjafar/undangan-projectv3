import React from 'react';
import { usePage } from '@inertiajs/react';

// Helper to generate style from possible style props
function getTextStyle(field) {
    if (typeof field !== 'object' || !field) return {};
    const style = {};
    if (field.size) style.fontSize = typeof field.size === 'number' ? `${field.size}px` : field.size;
    if (field.color) style.color = field.color;
    
    // Handle positioning jika ada
    if (field.position) {
        style.position = 'absolute';
        Object.entries(field.position).forEach(([key, value]) => {
            style[key] = value;
        });
    }
    
    return style;
}


// Dynamic renderer for a section
function DynamicSection({ section }) {
    const { theme } = usePage().props;
    
    return (
        <div
            style={{ backgroundImage: `url(${theme.background_image_url})` }}
            className={`section-gallery text-center h-screen bg-cover bg-center py-8 ${
                section.type === 'opening' ? 'relative' : ''
            }`}
        >
            {Object.entries(section).map(([key, value]) => {
                if (key === 'type') return null;

                if (typeof value === 'object' && value !== null && 'text' in value) {
                    return (
                        <div 
                            key={key} 
                            className="mb-2"
                            style={section.type === 'opening' ? { width: '100%' } : {}}
                        >
                            <span style={getTextStyle(value)}>{value.text}</span>
                        </div>
                    );
                }

                // If value is array (e.g., images)
                if (Array.isArray(value)) {
                    return (
                        <div key={key} className="mb-2">
                            <strong>{key}:</strong>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {value.map((item, idx) =>
                                    typeof item === 'string' && item.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                                        <img
                                            key={idx}
                                            src={item.startsWith('/') ? item : `/storage${item}`}
                                            alt={key + idx}
                                            className="object-cover w-full h-32 rounded"
                                        />
                                    ) : (
                                        <div key={idx}>{JSON.stringify(item)}</div>
                                    )
                                )}
                            </div>
                        </div>
                    );
                }

                // If value is object (but not with 'text'), render object
                if (typeof value === 'object' && value !== null) {
                    return (
                        <div key={key} className="mb-2">
                            <strong>{key}:</strong>
                            <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(value, null, 2)}</pre>
                        </div>
                    );
                }

                // If value is primitive
                return (
                    <div key={key} className="mb-2">
                        <strong>{key}:</strong> {value}
                    </div>
                );
            })}
        </div>
    );
}

export default function Show({ theme }) {
    if (!theme) {
        return <div>Tema tidak ditemukan.</div>;
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundImage: `url(${theme.background_image_url})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
            className="w-full max-w-[550px] mx-auto bg-white shadow-lg min-h-screen"
        >
            <div className="max-w-3xl mx-auto bg-white bg-opacity-80 shadow-lg rounded-lg overflow-hidden">
                {/* Preview Image */}
                
                    {/* Render all sections dynamically */}
                    {theme.sections && theme.sections.map((section, idx) => (
                        <DynamicSection section={section} key={idx} />
                    ))}
                </div>
            </div>
    );
}
