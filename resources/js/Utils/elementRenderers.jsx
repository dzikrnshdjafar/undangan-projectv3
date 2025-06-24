import React from 'react';
import { motion } from 'framer-motion';

// Utility function untuk membersihkan properti undefined
export const cleanStyle = (style) => {
    const cleanedStyle = { ...style };
    Object.keys(cleanedStyle).forEach(key => {
        if (cleanedStyle[key] === undefined) {
            delete cleanedStyle[key];
        }
    });
    return cleanedStyle;
};

// Utility function untuk mendeteksi tipe element
export const detectElementType = (data, hasChildren) => {
    if ('path' in data) return 'image';
    if ('text' in data && !hasChildren) return 'text';
    if ('href' in data) return 'button';
    if ('src' in data) return 'video';
    if ('placeholder' in data) return 'input';
    if ('options' in data) return 'select';
    return 'wrapper';
};

// Check if key is element key
export const isElementKey = (key) => !['type', 'order', 'minHeight', 'wrapperStyle', 'textStyle', 'imageStyle', 'buttonStyle', 'videoStyle', 'formStyle', 'text', 'path', 'animation', 'src', 'href', 'onClick', 'placeholder', 'required', 'options'].includes(key);

// Render image element
export const renderImage = (data, animateProps, storage_path, themeSlug, additionalProps = {}) => {
    const imageStyle = cleanStyle({
        ...data.imageStyle,
        width: data.imageStyle?.width || '100%',
        height: data.imageStyle?.height || '100%',
        objectFit: data.imageStyle?.objectFit || 'cover',
        display: 'block',
    });

    return (
        <div style={imageStyle}>
            <motion.img 
                src={`${storage_path}${data.path.replace('{$slug}', themeSlug || '')}`} 
                animate={animateProps}
                alt={data.alt || ""} 
                style={{borderRadius: 'inherit'}}
                loading="lazy"
                {...additionalProps}
            />
        </div>
    );
};

// Render text element
export const renderText = (data, animateProps, additionalProps = {}) => {
    const textStyle = cleanStyle({
        ...data.textStyle,
        width: '100%',
        background: 'transparent',
        wordBreak: 'break-word',
    });

    return (
        <div style={textStyle}>
            <motion.div 
                animate={animateProps}
                dangerouslySetInnerHTML={{ __html: data.text }} 
                {...additionalProps}
            />
        </div>
    );
};

// Render button element
export const renderButton = (data, animateProps, additionalProps = {}) => {
    const buttonStyle = cleanStyle({
        ...data.buttonStyle,
        cursor: 'pointer',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: 'white',
    });

    const handleClick = () => {
        if (data.onClick) {
            eval(data.onClick);
        } else if (data.href) {
            window.open(data.href, data.target || '_self');
        }
    };

    return (
        <motion.button
            style={buttonStyle}
            animate={animateProps}
            onClick={handleClick}
            {...additionalProps}
        >
            {data.text || 'Button'}
        </motion.button>
    );
};

// Render video element
export const renderVideo = (data, animateProps, additionalProps = {}) => {
    const videoStyle = cleanStyle({
        ...data.videoStyle,
        width: '100%',
        height: 'auto',
    });

    return (
        <motion.video
            style={videoStyle}
            animate={animateProps}
            controls={data.controls !== false}
            autoPlay={data.autoPlay || false}
            muted={data.muted || false}
            loop={data.loop || false}
            {...additionalProps}
        >
            <source src={data.src} type={data.type || 'video/mp4'} />
            Your browser does not support the video tag.
        </motion.video>
    );
};

// Render iframe element
export const renderIframe = (data, animateProps, additionalProps = {}) => {
    const iframeStyle = cleanStyle({
        ...data.iframeStyle,
        width: '100%',
        height: '400px',
        border: 'none',
    });

    return (
        <motion.iframe
            style={iframeStyle}
            animate={animateProps}
            src={data.src}
            title={data.title || 'Iframe'}
            allowFullScreen={data.allowFullScreen || false}
            {...additionalProps}
        />
    );
};

// Render input element
export const renderInput = (data, animateProps, additionalProps = {}) => {
    const inputStyle = cleanStyle({
        ...data.inputStyle,
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    });

    return (
        <motion.input
            style={inputStyle}
            animate={animateProps}
            type={data.inputType || 'text'}
            placeholder={data.placeholder}
            required={data.required || false}
            name={data.name}
            id={data.id}
            {...additionalProps}
        />
    );
};

// Render select element
export const renderSelect = (data, animateProps, additionalProps = {}) => {
    const selectStyle = cleanStyle({
        ...data.selectStyle,
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    });

    return (
        <motion.select
            style={selectStyle}
            animate={animateProps}
            name={data.name}
            id={data.id}
            required={data.required || false}
            {...additionalProps}
        >
            {data.options && data.options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </motion.select>
    );
};

// Render textarea element
export const renderTextarea = (data, animateProps, additionalProps = {}) => {
    const textareaStyle = cleanStyle({
        ...data.textareaStyle,
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        minHeight: '100px',
    });

    return (
        <motion.textarea
            style={textareaStyle}
            animate={animateProps}
            placeholder={data.placeholder}
            required={data.required || false}
            name={data.name}
            id={data.id}
            rows={data.rows || 4}
            {...additionalProps}
        />
    );
};

// Render list element
export const renderList = (data, animateProps, additionalProps = {}) => {
    const listStyle = cleanStyle({
        ...data.listStyle,
        listStyle: 'none',
        padding: 0,
        margin: 0,
    });

    const ListTag = data.ordered ? 'ol' : 'ul';

    return (
        <motion.div animate={animateProps} {...additionalProps}>
            <ListTag style={listStyle}>
                {data.items && data.items.map((item, index) => (
                    <li key={index} style={data.itemStyle}>
                        {typeof item === 'string' ? item : item.text}
                    </li>
                ))}
            </ListTag>
        </motion.div>
    );
};

export const renderForm = (data, animateProps, renderChildrenFn, additionalProps = {}) => {
    const formStyle = cleanStyle({
        ...data.formStyle,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    });

    return (
        <motion.form
            style={formStyle}
            animate={animateProps}
            action={data.action}
            method={data.method || 'POST'}
            {...additionalProps}
        >
            {renderChildrenFn()}
        </motion.form>
    );
};

// Render wrapper element
export const renderWrapper = (data, animateProps, elementType, storage_path, themeSlug, renderChildrenFn, additionalProps = {}) => {
    const wrapperStyle = cleanStyle({
        ...data.wrapperStyle,
    });

    return (
        <motion.div 
            style={wrapperStyle}
            animate={animateProps}
            {...additionalProps}
        >
            {/* Render Image di dalam wrapper jika ada */}
            {elementType === 'image' && data.path && (
                <img 
                    src={`${storage_path}${data.path.replace('{$slug}', themeSlug || '')}`} 
                    alt={data.alt || ""} 
                    style={cleanStyle({
                        ...data.imageStyle,
                        width: data.imageStyle?.width || '100%',
                        height: data.imageStyle?.height || '100%',
                        objectFit: data.imageStyle?.objectFit || 'cover',
                        display: 'block',
                    })}
                    loading="lazy"
                />
            )}

            {/* Render Text di dalam wrapper jika ada */}
            {elementType === 'text' && data.text && (
                <div 
                    style={cleanStyle({
                        ...data.textStyle,
                        width: '100%',
                        background: 'transparent',
                        wordBreak: 'break-word'
                    })} 
                    dangerouslySetInnerHTML={{ __html: data.text }} 
                />
            )}

            {/* Render Child Elements */}
            {renderChildrenFn()}
        </motion.div>
    );
};