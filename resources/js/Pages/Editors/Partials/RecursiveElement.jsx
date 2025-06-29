import React from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '@/Utils/animations';
import { usePage } from '@inertiajs/react';
import {
    detectElementType,
    isElementKey,
    renderImage,
    renderText,
    renderButton,
    renderVideo,
    renderIframe,
    renderWrapper,
    renderCountdown,
    renderRsvp,
    renderGift
} from '@/Utils/elementRenderers';

export default function RecursiveElement({ data, path, onSelectElement, selectedElementPath, isEditing = false }) {
    const { theme } = usePage().props;

    if (!data || typeof data !== 'object') {
        return null;
    }
    
    const isSelected = selectedElementPath && selectedElementPath.join('.') === path.join('.');

    // Deteksi tipe element
    const hasChildren = Object.keys(data).some(key => isElementKey(key) && typeof data[key] === 'object');
    const elementType = data.type || detectElementType(data, hasChildren);

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

    // Function untuk render children
    const renderChildren = () => {
        const childKeys = Object.keys(data).filter(key => isElementKey(key) && typeof data[key] === 'object');
        
        return childKeys.length > 0 && childKeys
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
            ));
    };

    // Render berdasarkan tipe element
    const renderElement = () => {
        switch (elementType) {
            case 'image':
                return renderImage(data, animateProps, theme?.slug, clickableProps);
            case 'text':
                return renderText(data, animateProps, clickableProps);
            case 'button':
                return renderButton(data, animateProps, clickableProps);
            case 'video':
                return renderVideo(data, animateProps, clickableProps);
            case 'iframe':
                return renderIframe(data, animateProps, clickableProps);
            case 'countdown':
                 return renderCountdown(data, animateProps, clickableProps);
                case 'rsvp':
    return renderRsvp(data, animateProps, clickableProps);
    case 'gift':
        return renderGift(data, animateProps, clickableProps);
            default:
                return renderWrapper(data, animateProps, renderChildren, clickableProps);
        }
    };

    return renderElement();
}