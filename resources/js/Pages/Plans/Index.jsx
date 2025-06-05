import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Index() {
    const { plans, currentPlan, activePlanDetails } = usePage().props;

    return (
        <div>
            <h1>Daftar Paket</h1>
            <ul>
                {plans.map(plan => (
                    <li key={plan.id}>
                        <strong>{plan.name}</strong> - {plan.description} <br />
                        Harga: Rp{plan.price} <br />
                        Durasi: {plan.duration_days} hari <br />
                        Rank: {plan.rank}
                        {activePlanDetails && activePlanDetails[plan.id] && (
                            <span style={{ color: 'green', marginLeft: 10 }}>
                                (Aktif sampai: {activePlanDetails[plan.id].ends_at ?? 'Tanpa batas'})
                            </span>
                        )}
                    </li>
                ))}
            </ul>
            {currentPlan && (
                <div style={{ marginTop: 20 }}>
                    <h2>Paket Aktif Tertinggi:</h2>
                    <p>
                        <strong>{currentPlan.name}</strong> (Rank: {currentPlan.rank})
                    </p>
                </div>
            )}
        </div>
    );
}