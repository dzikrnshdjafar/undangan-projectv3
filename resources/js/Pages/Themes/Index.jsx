import React from 'react';
import { Link } from '@inertiajs/react';
export default function Index({ themes }) {
    return (
        
        <div className="max-w-[430px] mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Daftar Tema Undangan</h1>
                <div className="grid grid-cols-1 gap-6">
                    {themes.map(theme => (
                        <div key={theme.id} className="bg-white rounded shadow p-4 flex flex-col items-center">
                            <img src={`storage${theme.preview_image_path}`} alt={theme.name} className="w-40 h-40 object-cover rounded mb-4" />
                            <h2 className="text-xl font-semibold mb-2">{theme.name}</h2>
                            <p className="text-gray-600 mb-4 text-center">{theme.description}</p>
                            <a
                                href={`/themes/${theme.slug}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                target='_blank'
                            >
                                Preview
                            </a>
                        </div>
                    ))}
                </div>
            </div>
    );
}