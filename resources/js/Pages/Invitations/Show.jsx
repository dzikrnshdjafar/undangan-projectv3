import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Show() {
    const { invitation } = usePage().props;
    console.log(invitation)
    return (
        <div className='w-full max-w-[550px] mx-auto bg-white shadow-lg min-h-screen'>
            
        </div>
    );
}