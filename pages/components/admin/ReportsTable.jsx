'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation'; // useSearchParams used to read ?highlight param
import StatusBadge from "../admin/StatusBadge";
import ActionButtons from "../admin/ActionButtons";

export default function ReportsTable({ reports, loading, onResolve, onDeleteReport, onDeleteContent }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [activeHighlight, setActiveHighlight] = useState(null); // for animation fade-out

    const router = useRouter();
    const searchParams = useSearchParams();
    const highlightId = searchParams.get('highlight'); //get ?highlight from URL
    const highlightRef = useRef(null); //ref to scroll into view

    useEffect(() => {
        if (highlightId) {
            setActiveHighlight(highlightId); // start highlight
            setTimeout(() => setActiveHighlight(null), 2000); // remove highlight after 2s

        // scroll to the row smoothly
        if (highlightRef.current) {
            highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        }
    }, [highlightId]);

    const filteredReports = useMemo(() => {
        return reports?.filter((report) => {
            const matchesSearch = report.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.reported_user_name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = typeFilter === "All" || report.report_type.toLowerCase() === typeFilter.toLowerCase();
            const matchesStatus = statusFilter === "All" || report.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesType && matchesStatus;
        }) || [];
    }, [reports, searchQuery, typeFilter, statusFilter]);

    if (loading) return <p>Loading reports...</p>;
    if (!Array.isArray(reports) || reports.length === 0) return <p>No reports found.</p>;

    const goToReport = (id) => router.push(`/admin/reports?highlight=${id}`);

    return (
        <div>
        {/* filters */}
        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "0.5rem", width: "250px" }}
            />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: "0.5rem" }}>
                <option value="All">All Types</option>
                <option value="post">Post</option>
                <option value="comment">Comment</option>
                <option value="user">User</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem" }}>
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
            </select>
        </div>

        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Content</th>
                    <th>Reported By</th>
                    <th>Reported User</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredReports.length === 0 ? (
                    <tr><td colSpan="8">No matching reports found.</td></tr>
                ) : (
                    filteredReports.map((report) => {
                    const isHighlighted = highlightId == report.report_id;

                    return (
                        <tr
                            key={report.report_id}
                            ref={isHighlighted ? highlightRef : null}
                            onClick={() => goToReport(report.report_id)}
                            style={{
                                cursor: "pointer",
                                backgroundColor: activeHighlight == report.report_id ? "#fff8c6" : "white",
                                transition: "background-color 0.3s ease"
                            }}
                        >
                            <td>{report.report_id}</td>
                            <td>{report.report_type}</td>
                            <td>{report.reason}</td>
                            <td><StatusBadge status={report.status} /></td>
                            <td>
                                {report.report_type === "user" ? (
                                report.content
                                ) : (
                                    <a
                                        href={
                                        report.report_type === "post"
                                            ? `/community/posts/${report.post_id}`
                                            : `/community/comments/${report.comment_id}`
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {report.content}
                                    </a>
                                )}
                            </td>
                            <td>
                                {report.reporter_id ? (
                                    <a
                                        href={`/admin/users?highlight=${report.reporter_id}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {report.reporter_name}
                                    </a>
                                ) : "-"}
                            </td>
                            <td>
                                {report.reported_user_id ? (
                                    <a
                                        href={`/admin/users?highlight=${report.reported_user_id}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {report.reported_user_name}
                                    </a>
                                ) : "-"}
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <ActionButtons
                                    type="report"
                                    status={report.status}
                                    report_type={report.report_type}
                                    onResolve={() => onResolve(report.report_id, report.report_type)}
                                    onDeleteReport={() => onDeleteReport(report.report_id)}
                                    onDeleteContent={
                                        report.report_type !== "user"
                                        ? () => onDeleteContent(report.report_id, report.report_type)
                                        : undefined
                                    }
                                />
                            </td>
                        </tr>
                    );
                    })
                )}
            </tbody>
        </table>
        </div>
    );
}
