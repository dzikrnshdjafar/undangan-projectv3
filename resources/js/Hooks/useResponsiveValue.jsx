// resources/js/hooks/useResponsiveValue.js
import { useState, useEffect } from 'react';

// Hook ini akan menerima objek seperti { base: '1rem', md: '2rem' }
// dan mengembalikan nilai yang sesuai berdasarkan ukuran layar saat ini.
export function useResponsiveValue(responsiveProperty) {
    
    // Cek apakah properti ini adalah objek responsif atau nilai biasa (string/number)
    const isResponsive = typeof responsiveProperty === 'object' && responsiveProperty !== null && responsiveProperty.base;

    // Fungsi untuk mendapatkan nilai yang benar berdasarkan breakpoint
    const getValue = () => {
        if (!isResponsive) {
            return responsiveProperty; // Jika bukan objek responsif, kembalikan nilai aslinya
        }
        
        // Tailwind's md breakpoint is 768px
        if (window.innerWidth >= 768 && responsiveProperty.md) {
            return responsiveProperty.md;
        }
        return responsiveProperty.base;
    };

    const [value, setValue] = useState(getValue);

    useEffect(() => {
        const handleResize = () => {
            setValue(getValue());
        };

        window.addEventListener('resize', handleResize);
        // Panggil sekali saat mount untuk memastikan nilai awal benar
        handleResize(); 

        return () => window.removeEventListener('resize', handleResize);
    }, [responsiveProperty]); // Jalankan ulang efek jika properti berubah

    return value;
}

// Hook helper untuk objek posisi
export function useResponsivePosition(positionObject) {
    const top = useResponsiveValue(positionObject?.top);
    const bottom = useResponsiveValue(positionObject?.bottom);
    const left = useResponsiveValue(positionObject?.left);
    const right = useResponsiveValue(positionObject?.right);
    const transform = useResponsiveValue(positionObject?.transform);

    // Filter properti yang tidak undefined untuk membersihkan objek style
    return Object.fromEntries(
        Object.entries({ top, bottom, left, right, transform }).filter(([_, v]) => v !== undefined)
    );
}