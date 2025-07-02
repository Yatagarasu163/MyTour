'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatusBadge from './StatusBadge';

export default function PreviewAdmins() {
    const [admins, setAdmins] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchAdmins = async () => {
            const res = await fetch('/api/admin/admins');
            const data = await res.json();

            const sorted = data.admins
                .sort((a, b) => b.admin_id - a.admin_id)
                .slice(0, 5);

            setAdmins(sorted);
        };

        fetchAdmins();
    }, []);

    const goToAdmin = (id) => router.push(`/admin/admins?highlight=${id}`);

    return (
        <div style={{ marginTop: '2rem' }}>
            <h2>Recent Admins</h2>
            <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '0.5rem' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.length === 0 ? (
                        <tr><td colSpan="4">No recent admins</td></tr>
                    ) : (
                        admins.map((a) => (
                            <tr
                                key={a.admin_id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => goToAdmin(a.admin_id)}
                            >
                                <td>{a.admin_id}</td>
                                <td>{a.admin_name}</td>
                                <td>{a.admin_email}</td>
                                <td><StatusBadge status={a.admin_status === 1 ? "active" : "suspended"} /></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
