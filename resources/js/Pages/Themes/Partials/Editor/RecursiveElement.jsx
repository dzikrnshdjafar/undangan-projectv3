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
    renderForm,
    renderWrapper
} from '../../../../Utils/elementRenderers';

export default function RecursiveElement({ data, path, onSelectElement, selectedElementPath, isEditing = false }) {
    const { storage_path, theme } = usePage().props;

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
                return hasChildren ? renderWrapper(data, animateProps, elementType, storage_path, theme?.slug, renderChildren, clickableProps) : renderImage(data, animateProps, storage_path, theme?.slug, clickableProps);
            case 'text':
                return hasChildren ? renderWrapper(data, animateProps, elementType, storage_path, theme?.slug, renderChildren, clickableProps) : renderText(data, animateProps, clickableProps);
            case 'button':
                return renderButton(data, animateProps, clickableProps);
            case 'video':
                return renderVideo(data, animateProps, clickableProps);
            case 'iframe':
                return renderIframe(data, animateProps, clickableProps);
            case 'input':
                return renderInput(data, animateProps, clickableProps);
            case 'select':
                return renderSelect(data, animateProps, clickableProps);
            case 'textarea':
                return renderTextarea(data, animateProps, clickableProps);
            case 'list':
                return renderList(data, animateProps, clickableProps);
            case 'form':
                return renderForm(data, animateProps, renderChildren, clickableProps);
            default:
                return renderWrapper(data, animateProps, elementType, storage_path, theme?.slug, renderChildren, clickableProps);
        }
    };

    return renderElement();
}