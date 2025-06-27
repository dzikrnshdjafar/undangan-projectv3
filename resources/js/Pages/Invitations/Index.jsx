import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ invitations }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Undangan Saya
                </h2>
            }
        >
            <Head title="Undangan Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {invitations.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {invitations.map((invitation) => (
                                        <div key={invitation.id} className="flex flex-col overflow-hidden rounded-lg border border-gray-200">
                                            <div className="flex-shrink-0">
                                                <img 
                                                    className="h-48 w-full object-cover" 
                                                    src={invitation.preview_image_url || 'https://via.placeholder.com/400x240'} 
                                                    alt={`Preview of ${invitation.title}`}
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between bg-white p-6">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-indigo-600">
                                                        {invitation.theme.name}
                                                    </p>
                                                    <a href={route('invitations.show', invitation.slug)} target="_blank" className="mt-2 block">
                                                        <p className="text-xl font-semibold text-gray-900">{invitation.title}</p>
                                                        <p className="mt-3 text-sm text-gray-500 truncate">/{invitation.slug}</p>
                                                    </a>
                                                </div>
                                                <div className="mt-6 flex items-center gap-x-4">
                                                    <Link
    // Ganti invitation.id menjadi invitation.slug
    href={route('invitations.edit', invitation.slug)}
    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
>
    Edit Undangan
</Link>
                                                     <a
                                                        href={route('invitations.show', invitation.slug)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-semibold leading-6 text-gray-900"
                                                    >
                                                        Lihat <span aria-hidden="true">&rarr;</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Anda belum memiliki undangan. Silakan buat undangan baru dari halaman tema.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}