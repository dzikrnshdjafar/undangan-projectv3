import React from 'react';
// 1. Impor motion dan varian animasi Anda
import { motion } from 'framer-motion';
import { animationVariants } from '../Utils/animations';

export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            {/* 2. Ubah div menjadi motion.div */}
            <motion.div
                // 3. Hapus kelas 'animate-spin' dari Tailwind
                className="w-16 h-16 border-4 border-dashed rounded-full border-pink-500"
                // 4. Terapkan animasi dari file utilitas Anda
                animate={animationVariants.bounce} // <-- Anda bisa ganti ke animasi lain, misal: .spin
            >
            </motion.div>
        </div>
    );
}