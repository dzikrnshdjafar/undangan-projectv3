export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return '';
    }
    // Jika path sudah URL lengkap atau sudah memiliki /storage/, gunakan langsung
    if (imagePath.startsWith('http') || imagePath.startsWith('/storage')) {
        return imagePath;
    }
    // Jika path adalah data mentah, tambahkan prefix /storage/
    return `/storage/${imagePath}`;
};