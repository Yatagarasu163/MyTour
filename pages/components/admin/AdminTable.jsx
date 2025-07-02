'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import StatusBadge from "../admin/StatusBadge";
import ActionButtons from "../admin/ActionButtons";

export default function AdminTable({ admins, loading, onSuspendRestore, onDelete }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortColumn, setSortColumn] = useState("admin_id");
    const [sortDirection, setSortDirection] = useState("asc");
    const [hoveredColumn, setHoveredColumn] = useState(null);
    const [activeHighlight, setActiveHighlight] = useState(null);

    const searchParams = useSearchParams();
    const highlightId = searchParams.get("highlight");
    const highlightRef = useRef(null);

    useEffect(() => {
        if (highlightId) {
            setActiveHighlight(highlightId);
            setTimeout(() => setActiveHighlight(null), 2000);
            if (highlightRef.current) {
                highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [highlightId]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const filteredAdmins = useMemo(() => {
        let result = admins.filter((admin) => {
            const matchesSearch =
                admin.admin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                admin.admin_email.toLowerCase().includes(searchQuery.toLowerCase());

            const status = admin.admin_status === 1 ? "Active" : "Suspended";
            const matchesStatus = statusFilter === "All" || status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        result.sort((a, b) => {
            const valA = a[sortColumn];
            const valB = b[sortColumn];

            if (typeof valA === "string") {
                return sortDirection === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            } else {
                return sortDirection === "asc" ? valA - valB : valB - valA;
            }
        });

        return result;
    }, [admins, searchQuery, statusFilter, sortColumn, sortDirection]);

    if (loading) return <p>Loading admins...</p>;
    if (!Array.isArray(admins) || admins.length === 0) return <p>No admins found.</p>;

    return (
        <div>
            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: "0.5rem", width: "250px" }}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: "0.5rem" }}
                >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                </select>
            </div>

            <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                    <tr>
                        {["admin_id", "admin_name", "admin_email"].map((col) => (
                            <th
                                key={col}
                                onClick={() => handleSort(col)}
                                onMouseEnter={() => setHoveredColumn(col)}
                                onMouseLeave={() => setHoveredColumn(null)}
                                style={{ cursor: "pointer" }}
                            >
                                {col.replace("admin_", "").replace("_", " ").toUpperCase()}{" "}
                                {(hoveredColumn === col || sortColumn === col) &&
                                    (sortColumn === col
                                        ? sortDirection === "asc"
                                            ? "▲"
                                            : "▼"
                                        : "⇅")}
                            </th>
                        ))}
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAdmins.length === 0 ? (
                        <tr>
                            <td colSpan="5">No matching admins found.</td>
                        </tr>
                    ) : (
                        filteredAdmins.map((admin) => {
                            const isHighlighted = highlightId == admin.admin_id;
                            return (
                                <tr
                                    key={admin.admin_id}
                                    ref={isHighlighted ? highlightRef : null}
                                    style={{
                                        backgroundColor: activeHighlight == admin.admin_id ? "#fff8c6" : "white",
                                        transition: "background-color 0.3s ease"
                                    }}
                                >
                                    <td>{admin.admin_id}</td>
                                    <td>{admin.admin_name}</td>
                                    <td>{admin.admin_email}</td>
                                    <td>
                                        <StatusBadge
                                            status={admin.admin_status === 1 ? "Active" : "Suspended"}
                                        />
                                    </td>
                                    <td>
                                        <ActionButtons
                                            type="admin"
                                            status={admin.admin_status === 1 ? "Active" : "Suspended"}
                                            onSuspendRestore={() =>
                                                onSuspendRestore(admin.admin_id, admin.admin_status)
                                            }
                                            onDeleteAdmin={() => onDelete(admin.admin_id)}
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
