import React, { useState, useEffect } from 'react';

const Countdown = ({ datetime, titleStyle, timerStyle, unitStyle }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(datetime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return;
        }

        timerComponents.push(
            <div key={interval}>
                <div style={timerStyle}>{timeLeft[interval]}</div>
                <div style={unitStyle}>{interval.toUpperCase()}</div>
            </div>
        );
    });

    return (
        <div>
            <h3 style={titleStyle}>Menuju Hari Bahagia</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', }}>
                {timerComponents.length ? timerComponents : <span>Waktu Telah Tiba!</span>}
            </div>
        </div>
    );
};

export default Countdown;