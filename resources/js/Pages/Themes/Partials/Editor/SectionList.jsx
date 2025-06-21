import React from 'react';

export default function SectionList({ sections, onSelectSection }) {
    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Sections</h2>
            <ul>
                {sections.map((section, index) => (
                    <li key={index} className="mb-2">
                        <button
                            onClick={() => onSelectSection(index)}
                            className="w-full text-left p-2 rounded hover:bg-gray-100 focus:outline-none focus:bg-blue-100 transition"
                        >
                            {`Section ${index + 1}: ${section.type.charAt(0).toUpperCase() + section.type.slice(1)}`}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}