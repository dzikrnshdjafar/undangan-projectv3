import React from 'react';
import { Link, router, usePage } from '@inertiajs/react'; // Impor router dan usePage

export default function Index({ themes }) {
    const { auth } = usePage().props; // Dapatkan info user

    const handleUseTemplate = (themeId) => {
        // Cek jika user belum login
        if (!auth.user) {
            if (confirm('Anda harus login terlebih dahulu untuk menggunakan tema. Lanjutkan ke halaman login?')) {
                router.visit(route('login'));
            }
            return;
        }

        if (confirm('Apakah Anda yakin ingin membuat undangan dengan tema ini?')) {
            router.post(route('invitations.store'), {
                theme_id: themeId
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    // Redirect akan ditangani oleh controller
                },
                onError: (errors) => {
                    alert('Gagal membuat undangan. Silakan coba lagi.');
                    console.error(errors);
                }
            });
        }
    };

    return (
        <div className="max-w-[430px] mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Daftar Tema Undangan</h1>
            <div className="grid grid-cols-1 gap-6">
                {themes.map(theme => (
                    <div key={theme.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform hover:scale-105">
                        <img src={`storage${theme.preview_image_path}`} alt={theme.name} className="w-full h-48 object-cover rounded-md mb-4" />
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">{theme.name}</h2>
                        <p className="text-gray-600 mb-4 text-center text-sm">{theme.description}</p>
                        <div className="flex gap-2 mt-auto">
                            <a
                                href={route('themes.show', { slug: theme.slug })}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                                target='_blank'
                                rel="noopener noreferrer"
                            >
                                Preview
                            </a>
                            <button
                                onClick={() => handleUseTemplate(theme.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                            >
                                Gunakan Template Ini
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}