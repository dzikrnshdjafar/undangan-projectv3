import React from 'react';
import { motion } from 'framer-motion';
import Countdown from '../Components/Countdown';
import Rsvp from '../Components/Rsvp';
import Gift from '../Components/Gift';
import { getImageUrl } from '@/Utils/imageHelper';

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
    return 'wrapper';
};

// Check if key is element key
export const isElementKey = (key) => !['type', 'order', 'minHeight', 'wrapperStyle', 'textStyle', 'imageStyle', 'buttonStyle', 'videoStyle', 'text', 'path', 'animation', 'src', 'href', 'onClick', 'placeholder', 'required', 'options'].includes(key);

// Render image element
export const renderImage = (data, animateProps, themeSlug, additionalProps = {}) => {
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
                src={getImageUrl(data.path.replace('{$slug}', themeSlug || ''))}
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

// Render wrapper element
export const renderWrapper = (data, animateProps, renderChildrenFn, additionalProps = {}) => {
    const wrapperStyle = cleanStyle({
        ...data.wrapperStyle,
    });

    return (
        <motion.div 
            style={wrapperStyle}
            animate={animateProps}
            {...additionalProps}
        >
           
            {/* Render Child Elements */}
            {renderChildrenFn()}
        </motion.div>
    );
};

export const renderCountdown = (data, animateProps, additionalProps = {}) => {
    // Gunakan countdownStyle, bukan wrapperStyle
    const countdownStyle = cleanStyle({ ...data.countdownStyle });

    return (
        <motion.div style={countdownStyle} animate={animateProps} {...additionalProps}>
            <Countdown
                datetime={data.datetime}
                titleStyle={cleanStyle({ ...data.titleStyle })}
                timerStyle={cleanStyle({ ...data.timerStyle })}
                unitStyle={cleanStyle({ ...data.unitStyle })}
            />
        </motion.div>
    );
};

export const renderRsvp = (data, animateProps, additionalProps = {}) => {
    const rsvpStyle = cleanStyle({ ...data.rsvpStyle });

    return (
        <motion.div style={rsvpStyle} animate={animateProps} {...additionalProps}>
            <Rsvp
                // Teruskan semua properti dengan nama yang sudah diubah
                rsvpTitleStyle={cleanStyle({ ...data.rsvpTitleStyle })}
                rsvpDescriptionStyle={cleanStyle({ ...data.rsvpDescriptionStyle })}
                rsvpFormStyle={cleanStyle({ ...data.rsvpFormStyle })}
                rsvpInputStyle={cleanStyle({ ...data.rsvpInputStyle })}
                rsvpButtonStyle={cleanStyle({ ...data.rsvpButtonStyle })}
                title={data.title}
                description={data.description}
                buttonText={data.buttonText}
            />
        </motion.div>
    );
};

export const renderGift = (data, animateProps, additionalProps = {}) => {
    // giftStyle diterapkan pada div pembungkus utama
    const giftContainerStyle = cleanStyle({ ...data.giftStyle });

    return (
        <motion.div style={giftContainerStyle} animate={animateProps} {...additionalProps}>
            <Gift
                giftBoxStyle={cleanStyle({ ...data.giftBoxStyle })}
                giftBankNameStyle={cleanStyle({ ...data.giftBankNameStyle })}
                giftAccountNameStyle={cleanStyle({ ...data.giftAccountNameStyle })}
                giftAccountNumberStyle={cleanStyle({ ...data.giftAccountNumberStyle })}
                giftButtonStyle={cleanStyle({ ...data.giftButtonStyle })}
                buttonText={data.buttonText}
                bankName={data.bankName}
                accountNumber={data.accountNumber}
                accountName={data.accountName}
            />
        </motion.div>
    );
};