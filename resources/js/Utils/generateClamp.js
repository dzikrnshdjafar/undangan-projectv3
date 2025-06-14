/**
 * Menerima nilai ukuran ideal (cth: '2vw', '3rem') dan menghasilkan string clamp()
 * @param {string} idealSize - Ukuran ideal yang diinginkan.
 * @returns {string} - String CSS clamp() atau nilai asli.
 */
export function generateClamp(idealSize) {
    // Jika nilai tidak valid atau sudah clamp, kembalikan apa adanya.
    if (typeof idealSize !== 'string' || idealSize.includes('clamp')) {
        return idealSize;
    }

    const value = parseFloat(idealSize);
    if (isNaN(value)) {
        return idealSize; // Kembalikan jika tidak bisa mendapatkan angka (cth: 'auto')
    }

    const unit = idealSize.match(/[^0-9.-]+$/)?.[0] || 'px';

    let min, max;

    switch (unit) {
        case 'vw':
        case '%': // Perlakukan '%' seperti 'vw' untuk ukuran font/elemen
            // Untuk satuan viewport, batas min/max sebaiknya dalam pixel agar tidak terlalu kecil/besar
            min = `${Math.max(12, value * 0.8)}px`; // Minimal 12px
            max = `${Math.max(24, value * 2)}px`; // Maksimal bisa disesuaikan
            return `clamp(${min}, ${idealSize}, ${max})`;

        case 'vh':
            min = `${Math.max(12, value * 0.8)}px`;
            max = `${Math.max(40, value * 2)}px`;
            return `clamp(${min}, ${idealSize}, ${max})`;
        
        case 'rem':
            // Untuk rem, kita bisa skala berdasarkan nilai rem itu sendiri
            min = `${value * 0.75}rem`;
            max = `${value * 1.5}rem`;
            return `clamp(${min}, ${idealSize}, ${max})`;

        case 'px':
            // Untuk pixel, clamp tidak terlalu berguna, tapi kita bisa beri sedikit rentang
            min = `${value * 0.9}px`;
            max = `${value * 1.1}px`;
            return `clamp(${min}, ${idealSize}, ${max})`;

        default:
            // Jika satuan tidak dikenali, kembalikan nilai asli
            return idealSize;
    }
}