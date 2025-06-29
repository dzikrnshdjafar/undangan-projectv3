// resources/js/Pages/Editors/MyThemes.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MyThemes({ themes }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tema Saya
                </h2>
            }
        >
            <Head title="Tema Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {themes.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {themes.map((theme) => (
                                        <div key={theme.id} className="flex flex-col overflow-hidden rounded-lg border border-gray-200">
                                            <div className="flex-shrink-0">
                                                <img 
                                                    className="h-48 w-full object-cover" 
                                                    src={theme.preview_image_url || 'https://via.placeholder.com/400x240'} 
                                                    alt={`Preview of ${theme.name}`}
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between bg-white p-6">
                                                <div className="flex-1">
                                                    <p className="text-xl font-semibold text-gray-900">{theme.name}</p>
                                                    <p className="mt-3 text-sm text-gray-500 truncate">{theme.description}</p>
                                                </div>
                                                <div className="mt-6 flex items-center gap-x-4">
                                                    <Link
                                                        href={route('themes.edit', theme.slug)}
                                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    >
                                                        Edit Tema
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Anda belum membuat tema. Silakan hubungi admin untuk dibuatkan tema baru.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}