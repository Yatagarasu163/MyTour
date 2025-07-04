'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation"; // used to read ?highlight param
import StatusBadge from "../admin/StatusBadge";
import ActionButtons from "../admin/ActionButtons";

export default function UserTable({ users, loading, onSuspendRestore, onDelete }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortColumn, setSortColumn] = useState("user_id"); // default sort by ID
    const [sortDirection, setSortDirection] = useState("asc"); // asc or desc
    const [hoveredColumn, setHoveredColumn] = useState(null); //arrows when hovered
    const [activeHighlight, setActiveHighlight] = useState(null); // for fade effect

    const searchParams = useSearchParams();
    const highlightId = searchParams.get("highlight") //get ?highlight from URL
    const highlightRef = useRef(null); //ref to scroll into view

    useEffect(() => {
        if (highlightId) {
            setActiveHighlight(highlightId); //highlight row
            setTimeout(() => setActiveHighlight(null), 2000) //fade after 2s
            if (highlightRef.current) {
                highlightRef.current.scrollIntoView({behavior: "smooth" , block: {center}});
            }
        }
    }, [highlightId]);

    //handling sort
    const handleSort = (column) => {
        if (sortColumn === column) {
        // toggle sort direction
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
        // change column and reset to ascending
        setSortColumn(column);
        setSortDirection("asc");
        }
    };

    const filteredUsers = useMemo(() => {
        let result = users?.filter((user) => {
            const matchesSearch =
                user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.user_email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || user.status === statusFilter;
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
    }, [users, searchQuery, statusFilter, sortColumn, sortDirection]);

    if (loading) return <p>Loading users...</p>;
    if (!Array.isArray(users) || users.length === 0) return <p>No users found.</p>;

    return (
        <div>
        {/* search and filter controls */}
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
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* user table */}
            <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th
                            onClick={() => handleSort("user_id")}
                            onMouseEnter={() => setHoveredColumn("user_id")}
                            onMouseLeave={() => setHoveredColumn(null)}
                            style={{ cursor: "pointer" }}
                        >
                            ID{" "}
                            {(hoveredColumn === "user_id" || sortColumn === "user_id") &&
                                (sortColumn === "user_id"
                                ? sortDirection === "asc" ? "▲" : "▼"
                                : "⇅")}
                        </th>

                        <th
                            onClick={() => handleSort("user_name")}
                            onMouseEnter={() => setHoveredColumn("user_name")}
                            onMouseLeave={() => setHoveredColumn(null)}
                            style={{ cursor: "pointer" }}
                        >
                            Name{" "}
                            {(hoveredColumn === "user_name" || sortColumn === "user_name") &&
                                (sortColumn === "user_name"
                                ? sortDirection === "asc" ? "▲" : "▼"
                                : "⇅")}
                        </th>

                        <th
                            onClick={() => handleSort("user_email")}
                            onMouseEnter={() => setHoveredColumn("user_email")}
                            onMouseLeave={() => setHoveredColumn(null)}
                            style={{ cursor: "pointer" }}
                        >
                            Email{" "}
                            {(hoveredColumn === "user_email" || sortColumn === "user_email") &&
                                (sortColumn === "user_email"
                                ? sortDirection === "asc" ? "▲" : "▼"
                                : "⇅")}
                        </th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr><td colSpan="6">No matching users found.</td></tr>
                    ) : (
                        filteredUsers.map((user) => {
                            const isHighlighted = highlightId == user.user_id;
                            return (
                                <tr 
                                    key={user.user_id}
                                    ref={isHighlighted ? highlightRef : null} // assign ref if matched
                                    style={{
                                        backgroundColor: activeHighlight == user.user_id ? "#fff8c6" : "white", // highlight effect
                                        transition: "background-color 0.3s ease"
                                    }}
                                >
                                    <td>{user.user_id}</td>
                                    <td>{user.user_name}</td>
                                    <td>{user.user_email}</td>
                                    <td><StatusBadge status={user.status} /></td>
                                    <td>
                                        <ActionButtons
                                            type="user"
                                            status={user.status}
                                            onSuspendRestore={() => onSuspendRestore(user)}
                                            onDeleteUser={() => onDelete(user.user_id)}
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
