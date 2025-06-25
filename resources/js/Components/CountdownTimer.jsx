import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate, className = '' }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate) - new Date();
            
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
                setIsExpired(false);
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsExpired(true);
            }
        };

        // Calculate immediately
        calculateTimeLeft();

        // Update every second
        const timer = setInterval(calculateTimeLeft, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, [targetDate]);

    if (isExpired) {
        return (
            <div className={`countdown-expired ${className}`}>
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-red-500">🎉 Acara Telah Dimulai! 🎉</h3>
                </div>
            </div>
        );
    }

    return (
        <div className={`countdown-timer ${className}`}>
            <div className="flex justify-center items-center space-x-4">
                <div className="countdown-item text-center">
                    <div className="countdown-value bg-pink-500 text-white rounded-lg p-3 min-w-[60px]">
                        <span className="text-2xl font-bold">{timeLeft.days}</span>
                    </div>
                    <div className="countdown-label text-sm mt-1 text-gray-600">Hari</div>
                </div>
                <div className="countdown-separator text-pink-500 text-2xl font-bold">:</div>
                <div className="countdown-item text-center">
                    <div className="countdown-value bg-pink-500 text-white rounded-lg p-3 min-w-[60px]">
                        <span className="text-2xl font-bold">{timeLeft.hours}</span>
                    </div>
                    <div className="countdown-label text-sm mt-1 text-gray-600">Jam</div>
                </div>
                <div className="countdown-separator text-pink-500 text-2xl font-bold">:</div>
                <div className="countdown-item text-center">
                    <div className="countdown-value bg-pink-500 text-white rounded-lg p-3 min-w-[60px]">
                        <span className="text-2xl font-bold">{timeLeft.minutes}</span>
                    </div>
                    <div className="countdown-label text-sm mt-1 text-gray-600">Menit</div>
                </div>
                <div className="countdown-separator text-pink-500 text-2xl font-bold">:</div>
                <div className="countdown-item text-center">
                    <div className="countdown-value bg-pink-500 text-white rounded-lg p-3 min-w-[60px]">
                        <span className="text-2xl font-bold">{timeLeft.seconds}</span>
                    </div>
                    <div className="countdown-label text-sm mt-1 text-gray-600">Detik</div>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;