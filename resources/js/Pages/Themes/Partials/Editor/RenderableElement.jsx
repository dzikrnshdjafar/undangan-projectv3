import React from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '../../../../Utils/animations';
import { usePage } from '@inertiajs/react';

// Fungsi untuk mendapatkan URL gambar yang benar
const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/storage')) {
        return path;
    }
    const { asset_url } = usePage().props;
    return `${asset_url}storage/${path}`;
};

export default function RenderableElement({ data, path, onSelect, isEditing, selectedPath }) {
    if (!data || typeof data !== 'object') {
        return null;
    }

    const { text, type = 'wrapper', ...styles } = data;
    const isSelected = isEditing && selectedPath && selectedPath.join('.') === path.join('.');

    // Tentukan style dari properti yang ada di data
    const elementStyle = {
        position: styles.position || 'absolute',
        top: styles.top,
        left: styles.left,
        right: styles.right,
        bottom: styles.bottom,
        width: styles.width,
        height: styles.height,
        color: styles.color,
        fontSize: styles.size,
        textAlign: styles.textAlign,
        zIndex: styles.zIndex,
        paddingTop: styles.padding?.top,
        paddingBottom: styles.padding?.bottom,
        paddingLeft: styles.padding?.left,
        paddingRight: styles.padding?.right,
        transform: `scaleX(${styles.flipX ? -1 : 1})`,
        ...styles.wrapperStyle, // Gabungkan style kustom jika ada
    };

    const animation = styles.animation || 'none';
    const motionProps = animation !== 'none' && animationVariants[animation]
        ? {
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, amount: 0.3 },
              variants: animationVariants[animation],
          }
        : {};

    // Properti yang akan ditambahkan jika dalam mode edit
    const clickableProps = isEditing ? {
        onClick: (e) => {
            e.stopPropagation();
            onSelect(path);
        },
        className: `cursor-pointer border-2 border-dashed transition-all duration-200 ${isSelected ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-transparent hover:border-blue-300'}`,
    } : {};

    // Render berdasarkan tipe (wrapper, text, image)
    const renderContent = () => {
        // Jika ini adalah wrapper, render anak-anaknya secara rekursif
        if (type === 'wrapper') {
            // Urutkan anak berdasarkan properti 'order'
            const childKeys = Object.keys(data).filter(key => typeof data[key] === 'object' && data[key] !== null);
            childKeys.sort((a, b) => (data[a]?.order || 0) - (data[b]?.order || 0));

            return childKeys.map(key => (
                <RenderableElement
                    key={key}
                    data={data[key]}
                    path={[...path, key]}
                    onSelect={onSelect}
                    isEditing={isEditing}
                    selectedPath={selectedPath}
                />
            ));
        }

        // Jika ini adalah gambar
        if (type === 'image' && styles.path) {
            return (
                <img
                    src={getImageUrl(styles.path)}
                    alt={styles.alt || 'Invitation Image'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            );
        }

        // Jika ini adalah teks
        if (type === 'text' && text) {
            // Ganti \n dengan <br />
            const textWithBreaks = text.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ));
            return <>{textWithBreaks}</>;
        }
        
        return null;
    };

    return (
        <motion.div style={elementStyle} {...motionProps} {...clickableProps}>
            {renderContent()}
        </motion.div>
    );
}