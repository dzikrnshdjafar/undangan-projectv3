import React from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '../../../../Utils/animations';
import { usePage } from '@inertiajs/react';
import {
    detectElementType,
    isElementKey,
    cleanStyle,
    renderImage,
    renderText,
    renderButton,
    renderVideo,
    renderIframe,
    renderInput,
    renderSelect,
    renderTextarea,
    renderList,
    renderWrapper,
    renderCountdown,
    renderRsvp,
    renderGift
} from '../../../../Utils/elementRenderers';

export default function PreviewElement({ data, path }) {
    const { storage_path, theme } = usePage().props;

    if (!data || typeof data !== 'object') {
        return null;
    }

    // Deteksi tipe element berdasarkan properti yang ada
    const hasChildren = Object.keys(data).some(key => isElementKey(key) && typeof data[key] === 'object');
    const elementType = data.type || detectElementType(data, hasChildren);

    // Setup animasi
    const animation = data.animation;
    const hasAnimation = animation && animationVariants[animation];
    const animateProps = hasAnimation ? animationVariants[animation] : {};

    // Function untuk render children
    const renderChildren = () => {
        const childKeys = Object.keys(data).filter(key => isElementKey(key) && typeof data[key] === 'object');
        
        return childKeys.length > 0 && childKeys
            .sort((a, b) => (data[a].order || 0) - (data[b].order || 0))
            .map(key => (
                <PreviewElement
                    key={key}
                    data={data[key]}
                    path={[...path, key]}
                />
            ));
    };

    // Render berdasarkan tipe element
    const renderElement = () => {
        switch (elementType) {
            case 'image':
                return hasChildren ? null : renderImage(data, animateProps, storage_path, theme?.slug);
            case 'text':
                return hasChildren ? null : renderText(data, animateProps);
            case 'button':
                return renderButton(data, animateProps);
            case 'video':
                return renderVideo(data, animateProps);
            case 'iframe':
                return renderIframe(data, animateProps);
            case 'input':
                return renderInput(data, animateProps);
            case 'select':
                return renderSelect(data, animateProps);
            case 'textarea':
                return renderTextarea(data, animateProps);
            case 'list':
                return renderList(data, animateProps);
                case 'countdown':
                return renderCountdown(data, animateProps);
                case 'rsvp':
                    return renderRsvp(data, animateProps);
                    case 'gift':
    return renderGift(data, animateProps);
            default:
                return renderWrapper(data, animateProps, elementType, storage_path, theme?.slug, renderChildren);
        }
    };

    return renderElement();
}