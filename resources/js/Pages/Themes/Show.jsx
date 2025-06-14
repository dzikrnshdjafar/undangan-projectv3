import React from 'react';
import { usePage } from '@inertiajs/react';
import SectionWrapper from './Sections/SectionWrapper';
// 1. Impor komponen baru kita
import DesktopPreview from './Partials/DesktopPreview'; 

export default function Show() {
    const { theme } = usePage().props;

    return (
        // 2. Buat container flex utama untuk layout dua kolom di desktop
       <div className="relative w-full bg-gray-100 md:flex">

            {/* Kolom Kiri: Hanya tampil di desktop (md dan lebih besar) */}
            <div className="hidden md:block md:w-1/2 lg:w-6/12 xl:w-11/12 ">
                <DesktopPreview backgroundImageUrl={theme.background_image_url} />
            </div>

            {/* Kolom Kanan: Tampil di semua ukuran layar */}
            <div className="w-full md:w-3/4 lg:w-6/12 xl:w-1/2">
                {/* Container ini sekarang menjadi "ponsel" Anda.
                  Semua konten utama berada di sini.
                */}
                <div className="relative w-full mx-auto shadow-lg overflow-hidden">
                    {/* Background & Overlay SEKARANG diterapkan di sini, bukan fixed lagi.
                      Ini penting agar background hanya ada di kolom kanan ini.
                    */}
                    <div className="fixed top-0 w-fit h-screen">
                        <img
                          src={theme.background_image_url}
                          className="w-screen h-full object-cover"
                          style={{ imageRendering: 'optimizeQuality' }}
                          alt="Background"
                        />
                        {/* Overlay untuk efek gelap */}
                        <div className="absolute inset-0 bg-red-100 bg-opacity-50 backdrop-saturate-50"></div>
                    </div>
                    
                    {/* Konten utama (Sections) */}
                    {theme.sections && theme.sections.map((section, idx) => (
                        <SectionWrapper
                            key={idx}
                            section={section}
                            themeId={theme.id}
                            sectionIndex={idx}
                            isEditing={true}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}