import React from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '../../../../Utils/animations';
import { usePage } from '@inertiajs/react';

const isElementKey = (key) => !['type', 'order', 'minHeight', 'wrapperStyle', 'textStyle', 'imageStyle', 'text', 'path', 'animation'].includes(key);

export default function PreviewElement({ data, path }) {
    const { storage_path } = usePage().props;

    if (!data || typeof data !== 'object') {
        return null;
    }

    // Deteksi tipe element
    const isImage = 'path' in data;
    const isText = 'text' in data;
    const hasChildren = Object.keys(data).some(key => isElementKey(key) && typeof data[key] === 'object');

    // Setup animasi
    const animation = data.animation;
    const hasAnimation = animation && animationVariants[animation];
    const animateProps = hasAnimation ? animationVariants[animation] : {};
   

    // UNTUK IMAGE ELEMENT
    if (isImage && !hasChildren) {
    const imageStyle = {
       
        ...data.imageStyle,
        
        width: data.imageStyle?.width || '100%',
        height: data.imageStyle?.height || '100%',
        objectFit: data.imageStyle?.objectFit || 'cover',
        display: 'block',
        
    };

    console.log('Image Style:', imageStyle);

    // Hapus properti undefined
    for (const key in imageStyle) {
        if (imageStyle[key] === undefined) {
            delete imageStyle[key];
        }
    }

    return (
        <div
        style={imageStyle}
        >

        <motion.img 
            src={`${storage_path}${data.path.replace('{$slug}', usePage().props.theme?.slug || '')}`} 
            animate={animateProps}
            alt="" 
            style={{borderRadius: 'inherit'}}
            loading="lazy"
           
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
                />
                </div>
        );
    }

    // UNTUK WRAPPER ELEMENT (yang punya children)
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
        >
            {/* Render Image di dalam wrapper jika ada */}
            {isImage && (
                <div style={imageStyle}>
                    
                <img.motion 
                src={`${storage_path}${data.path.replace('{$slug}', usePage().props.theme?.slug || '')}`} 
                alt="" 
                animate={animateProps}
                loading="lazy"
                />
                </div>
            )}

            {/* Render Text di dalam wrapper jika ada */}
            {isText && (
                <div 
                    style={textStyle} 
                    dangerouslySetInnerHTML={{ __html: data.text }} 
                />
            )}

            {/* Render Child Elements */}
            {childKeys.length > 0 && childKeys
                .sort((a, b) => (data[a].order || 0) - (data[b].order || 0))
                .map(key => (
                    <PreviewElement
                        key={key}
                        data={data[key]}
                        path={[...path, key]}
                    />
            ))}
        </motion.div>
    );
}