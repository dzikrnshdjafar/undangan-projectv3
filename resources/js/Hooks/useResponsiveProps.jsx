import { useState, useEffect } from 'react';

// Mendefinisikan breakpoint yang sesuai dengan Tailwind CSS
const breakpoints = {
    md: 768,
    lg: 1024,
};

/**
 * Custom hook untuk mendapatkan nilai properti yang responsif.
 * @param {object | string} props - Objek properti responsif (cth: { base: '50%', md: '40%' }) atau nilai tunggal.
 * @returns Nilai yang sesuai untuk ukuran layar saat ini.
 */
export function useResponsiveProps(props) {
    // Fungsi untuk mendapatkan nilai berdasarkan lebar jendela
    const getValue = () => {
        if (typeof props !== 'object' || props === null) {
            return props; // Jika bukan objek, kembalikan nilai aslinya
        }

        const width = window.innerWidth;
        if (width >= breakpoints.lg && props.lg !== undefined) {
            return props.lg;
        }
        if (width >= breakpoints.md && props.md !== undefined) {
            return props.md;
        }
        return props.base; // Fallback ke nilai base (mobile)
    };

    const [value, setValue] = useState(getValue);

    useEffect(() => {
        const handleResize = () => {
            setValue(getValue());
        };

        window.addEventListener('resize', handleResize);
        // Panggil sekali saat mount untuk memastikan nilai awal benar
        handleResize(); 

        // Cleanup listener saat komponen di-unmount
        return () => window.removeEventListener('resize', handleResize);
    }, [props]); // Jalankan ulang efek jika objek props berubah

    return value;
}