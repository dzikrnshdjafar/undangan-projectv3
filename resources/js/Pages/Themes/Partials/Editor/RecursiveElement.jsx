import React from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '../../../../Utils/animations';
import { usePage } from '@inertiajs/react';

const isElementKey = (key) => !['type', 'order', 'minHeight', 'wrapperStyle', 'textStyle', 'imageStyle', 'text', 'path', 'animation'].includes(key);

export default function RecursiveElement({ data, path, onSelectElement, selectedElementPath, isEditing = false }) {
    const { storage_path } = usePage().props;

    if (!data || typeof data !== 'object') {
        return null;
    }
    
    const isSelected = selectedElementPath && selectedElementPath.join('.') === path.join('.');

    // Deteksi tipe element
    const isImage = 'path' in data;
    const isText = 'text' in data;
    const hasChildren = Object.keys(data).some(key => isElementKey(key) && typeof data[key] === 'object');

    // Setup animasi
    const animation = data.animation;
    const hasAnimation = animation && animationVariants[animation];
    const animateProps = hasAnimation ? animationVariants[animation] : {};

    // Props untuk editing mode
    const clickableProps = isEditing ? {
        onClick: (e) => {
            e.stopPropagation();
            onSelectElement(path, data);
        },
        className: `cursor-pointer border-2 border-dashed ${isSelected ? 'border-red-500' : 'border-transparent'} hover:border-blue-400 transition-all duration-200`
    } : {};

    // UNTUK IMAGE ELEMENT
    if (isImage && !hasChildren) {
        const imageStyle = {
            ...data.imageStyle,
            width: data.imageStyle?.width || '100%',
            height: data.imageStyle?.height || '100%',
            objectFit: data.imageStyle?.objectFit || 'cover',
            display: 'block',
        };

        // Hapus properti undefined
        for (const key in imageStyle) {
            if (imageStyle[key] === undefined) {
                delete imageStyle[key];
            }
        }

        return (
            <div style={imageStyle}>
                
            <motion.img 
                src={`${storage_path}${data.path.replace('{$slug}', usePage().props.theme?.slug || '')}`} 
                alt="" 
                animate={animateProps}
            style={{borderRadius: 'inherit'}}

                {...clickableProps}
                />
                </div>
        );
    }

    // UNTUK TEXT ELEMENT
    if (isText && !hasChildren) {
        const textStyle = {
            ...data.textStyle,
            width: '100%',
            background: 'transparent',
            wordBreak: 'break-word',
        };

        // Hapus properti undefined
        for (const key in textStyle) {
            if (textStyle[key] === undefined) {
                delete textStyle[key];
            }
        }

        return (
            <div style={textStyle}>

            <motion.div 
                animate={animateProps}
                dangerouslySetInnerHTML={{ __html: data.text }}
                {...clickableProps}
                />
                </div>
        );
    }

    // UNTUK WRAPPER ELEMENT
    const wrapperStyle = {
        ...data.wrapperStyle,
    };

    // Hapus properti undefined
    for (const key in wrapperStyle) {
        if (wrapperStyle[key] === undefined) {
            delete wrapperStyle[key];
        }
    }

    const childKeys = Object.keys(data).filter(key => isElementKey(key) && typeof data[key] === 'object');

    return (
        <motion.div 
            style={wrapperStyle}
            animate={animateProps}
            {...clickableProps}
            className='p-2 border-2 border-dashed border-transparent hover:border-green-400 transition-all duration-200'
        >
            {/* Render Image di dalam wrapper */}
            {isImage && (
                <img 
                    src={`${storage_path}${data.path.replace('{$slug}', usePage().props.theme?.slug || '')}`} 
                    alt="" 
                    style={{
                        ...data.imageStyle,
                        width: data.imageStyle?.width || '100%',
                        height: data.imageStyle?.height || '100%',
                        objectFit: data.imageStyle?.objectFit || 'cover',
                        display: 'block',
                    }}
                    loading="lazy"
                />
            )}

            {/* Render Text di dalam wrapper */}
            {isText && (
                <div 
                    style={{
                        ...data.textStyle,
                        width: '100%',
                        background: 'transparent',
                        wordBreak: 'break-word'
                    }} 
                    dangerouslySetInnerHTML={{ __html: data.text }} 
                />
            )}

            {/* Render Child Elements */}
            {childKeys.length > 0 && childKeys
                .sort((a, b) => (data[a].order || 0) - (data[b].order || 0))
                .map(key => (
                    <RecursiveElement
                        key={key}
                        data={data[key]}
                        path={[...path, key]}
                        onSelectElement={onSelectElement}
                        selectedElementPath={selectedElementPath}
                        isEditing={isEditing}
                    />
            ))}
        </motion.div>
    );
}