// resources/js/utils/layout.js

/**
 * Menerjemahkan data layout menjadi properti style CSS
 * @param {object} layoutData - Objek layout dari seeder
 * @returns {object} - Objek style untuk React
 */
export function getStyleFromLayout(layoutData = {}) {
    const { 
        anchor = 'middle-center', 
        pivot = 'middle-center', 
        offsetX = 0, 
        offsetY = 0,
        flipX = false
    } = layoutData;

    const style = { zIndex: layoutData.zIndex || 'auto', width: layoutData.size || 'auto' };
    
    // 1. Tentukan posisi top & left berdasarkan anchor
    const [anchorY, anchorX] = anchor.split('-');
    
    style.top = { top: '0%', middle: '50%', bottom: '100%' }[anchorY];
    style.left = { left: '0%', center: '50%', right: '100%' }[anchorX];

    // 2. Tentukan transform berdasarkan pivot dan offset
    const [pivotY, pivotX] = pivot.split('-');

    const pivotTranslateX = { left: '0%', center: '-50%', right: '-100%' }[pivotX];
    const pivotTranslateY = { top: '0%', middle: '-50%', bottom: '-100%' }[pivotY];

    // Gabungkan semua transform
    let transformParts = [
        `translateX(calc(${pivotTranslateX} + ${offsetX}px))`,
        `translateY(calc(${pivotTranslateY} + ${offsetY}px))`
    ];

    if (flipX) {
        transformParts.push('scaleX(-1)');
    }

    style.transform = transformParts.join(' ');
    
    return style;
}