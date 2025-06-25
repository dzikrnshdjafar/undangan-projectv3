import React from 'react';
import { usePage } from '@inertiajs/react';

const Gift = ({ 
    giftBoxStyle, 
    giftBankNameStyle, 
    giftAccountNameStyle, 
    giftAccountNumberStyle, 
    giftButtonStyle, 
    buttonText, 
    bankName, 
    accountNumber, 
    accountName 
}) => {

    const copyToClipboard = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(accountNumber)
            .then(() => alert(`Nomor ${bankName} (${accountNumber}) berhasil disalin!`))
            .catch(err => alert('Gagal menyalin nomor.'));
    };

    return (
        <div style={giftBoxStyle}>
            <div style={giftBankNameStyle}>{bankName}</div>
            <div style={giftAccountNumberStyle}>{accountNumber}</div>
            <div style={giftAccountNameStyle}>{accountName}</div>
            <button 
                style={giftButtonStyle} 
                onClick={copyToClipboard}
            >
                {buttonText || 'Salin Nomor'}
            </button>
        </div>
    );
};

export default Gift;