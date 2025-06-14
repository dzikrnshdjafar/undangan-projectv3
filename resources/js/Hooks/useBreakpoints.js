import { useState, useEffect } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigFile from '../../../../tailwind.config.js';

const tailwindConfig = resolveConfig(tailwindConfigFile);

const getBreakpointValue = (key) => {
    if (typeof tailwindConfig.theme.screens[key] === 'string') {
        return parseInt(tailwindConfig.theme.screens[key].replace('px', ''), 10);
    }
    return 0;
};

const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState('base');

    useEffect(() => {
        const calculateBreakpoint = () => {
            const width = window.innerWidth;
            const screens = tailwindConfig.theme.screens;
            
            if (width >= getBreakpointValue('xl')) {
                setBreakpoint('xl');
            } else if (width >= getBreakpointValue('lg')) {
                setBreakpoint('lg');
            } else if (width >= getBreakpointValue('md')) {
                setBreakpoint('md');
            } else if (width >= getBreakpointValue('sm')) {
                setBreakpoint('sm');
            } else {
                setBreakpoint('base');
            }
        };

        calculateBreakpoint();
        window.addEventListener('resize', calculateBreakpoint);
        return () => window.removeEventListener('resize', calculateBreakpoint);
    }, []);

    return breakpoint;
};

export default useBreakpoint;