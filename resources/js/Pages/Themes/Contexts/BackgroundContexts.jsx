// contexts/BackgroundContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children, backgroundUrl }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!backgroundUrl) return;

        const img = new Image();
        img.onload = () => setIsLoaded(true);
        img.src = backgroundUrl;

        // Set CSS custom property globally
        document.documentElement.style.setProperty(
            '--theme-bg-url', 
            `url(${backgroundUrl})`
        );
    }, [backgroundUrl]);

    return (
        <BackgroundContext.Provider value={{ isLoaded, backgroundUrl }}>
            {children}
        </BackgroundContext.Provider>
    );
};

export const useBackground = () => {
    const context = useContext(BackgroundContext);
    if (!context) {
        throw new Error('useBackground must be used within BackgroundProvider');
    }
    return context;
};