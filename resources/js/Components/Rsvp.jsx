import React, { useState } from 'react';
import { router } from '@inertiajs/react';

// Menggunakan nama prop yang baru: rsvpTitleStyle, rsvpDescriptionStyle, dll.
const Rsvp = ({ rsvpStyle, rsvpTitleStyle, rsvpDescriptionStyle, rsvpFormStyle, rsvpInputStyle, rsvpButtonStyle, title, description, buttonText }) => {
    const [values, setValues] = useState({
        name: '',
        status: 'Hadir',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(values => ({
            ...values,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/rsvp/submit', values, {
            onSuccess: () => {
                alert('Terima kasih atas konfirmasinya!');
                setValues({ name: '', status: 'Hadir', message: '' });
            },
            onError: (errors) => {
                alert('Terjadi kesalahan: ' + Object.values(errors).join('\n'));
            }
        });
    };

    return (
        <div style={rsvpStyle}>
            {/* Menggunakan style dari prop yang baru */}
            <h3 style={rsvpTitleStyle}>{title}</h3>
            <p style={rsvpDescriptionStyle}>{description}</p>
            <form onSubmit={handleSubmit} style={rsvpFormStyle}>
                <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Nama Anda"
                    required
                    style={rsvpInputStyle} // Style baru
                />
                <select name="status" value={values.status} onChange={handleChange} style={rsvpInputStyle}> {/* Style baru */}
                    <option value="Hadir">Akan Hadir</option>
                    <option value="Tidak Hadir">Berhalangan Hadir</option>
                </select>
                <textarea
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    placeholder="Pesan (opsional)"
                    rows="4"
                    style={rsvpInputStyle} // Style baru
                ></textarea>
                <button type="submit" style={rsvpButtonStyle}>{buttonText}</button> {/* Style baru */}
            </form>
        </div>
    );
};

export default Rsvp;