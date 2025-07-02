'use client';

import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import { useRouter } from 'next/navigation';

export default function PreviewReports() {
    const [reports, setReports] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchReports = async () => {
        const res = await fetch('/api/admin/reports');
        const data = await res.json();
        const sorted = data.reports
            .sort((a, b) => b.report_id - a.report_id)
            .slice(0, 5);
        setReports(sorted);
        };
        fetchReports();
    }, []);

    const goToReport = (id) => router.push(`/admin/reports?highlight=${id}`);

    return (
        <div style={{ marginTop: '2rem' }}>
        <h2>Recent Reports</h2>
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '0.5rem' }}>
            <thead>
            <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {reports.length === 0 ? (
                <tr><td colSpan="4">No pending reports</td></tr>
            ) : (
                reports.map((r) => (
                <tr
                    key={r.report_id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => goToReport(r.report_id)}
                >
                    <td>{r.report_id}</td>
                    <td>{r.report_type}</td>
                    <td>{r.reason}</td>
                    <td><StatusBadge status={r.status} /></td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
}
