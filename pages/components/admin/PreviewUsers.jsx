'use client';

import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import { useRouter } from 'next/navigation';

export default function PreviewUsers() {
    const [users, setUsers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        const sorted = data.users
            .sort((a, b) => b.user_id - a.user_id)
            .slice(0, 5);
        setUsers(sorted);
        };
        fetchUsers();
    }, []);

    const goToUser = (id) => router.push(`/admin/users?highlight=${id}`);

    return (
        <div style={{ marginTop: '2rem' }}>
        <h2>Recent Users</h2>
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
            {users.length === 0 ? (
                <tr><td colSpan="4">No recent users</td></tr>
            ) : (
                users.map((u) => (
                <tr
                    key={u.user_id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => goToUser(u.user_id)}
                >
                    <td>{u.user_id}</td>
                    <td>{u.user_name}</td>
                    <td>{u.user_email}</td>
                    <td><StatusBadge status={u.status} /></td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
}
