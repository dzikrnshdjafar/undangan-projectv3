import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextareaInput({ className = '', isFocused = false, ...props }, ref) {
    const localRef = useRef(null);

    // Ini memungkinkan parent component untuk fokus pada input ini
    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={localRef}
        />
    );
});