'use client';

import {useEffect, useState} from "react";
import { useSession } from "next-auth/react";
import ReportsTable from "../../../pages/components/admin/ReportsTable";
import SessionChecking from "../../component/SessionChecking";

export default function AdminReports() {
    // hold all reports fetched from backend
    const [reports, setReports] = useState([]);
    // merge loading state while fetching reports
    const [loading, setLoading] = useState(true);
    const { status } = useSession();

    //fetch reports when the user is authenticated 
    useEffect(() => {
        if (status !== "authenticated") return;
        fetch("/api/admin/reports")
            .then(res => res.json())
            .then(data => {
                setReports(data.reports || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load reports:", err);
                setLoading(false);
            });
    }, [status]);

    // delete only report not content 
    const handleDeleteReport = async (report_id) => {
        try {
            const res = await fetch(`/api/admin/reports/${report_id}/deleteReport`, { method: "DELETE", });

            if (!res.ok) throw new Error("Failed to delete report");

            setReports(prev => prev.filter(r => r.report_id !== report_id));
            alert("Report has been deleted.");
        } catch (err) {
            console.error(err);
            alert("Something went wrong while deleting the report.");
        }
    }

    //delete both reported content and report
    const handleDeleteContent = async (report_id, report_type) => {
        const confirmed = window.confirm(`Are you sure you want to delete this reported ${report_type}? This will also remove the report.`);

        if (!confirmed) return;

        try {
            const res = await fetch(`/api/admin/reports/${report_id}/deleteContent`, {method: "DELETE",});

            if (!res.ok) throw new Error("Failed to delete content/report");

            alert(`${report_type} and its report have been deleted.`);
            setReports(prev => prev.filter(r => r.report_id !== report_id));
        } catch (err) {
            console.error(err);
            alert("Something went wrong while detecting the content.")
        }
    }

    //mark report as resolved
    const handleResolve = async (report_id, report_type) => {
        const confirmResolve = window.confirm(`Mark this ${report_type} report as resolved?`);
        if (!confirmResolve) return;

        try {
            const res = await fetch(`/api/admin/reports/${report_id}/resolve`, {
                method: "PATCH", 
                headers: {"Content-Type" : "application/json", }, 
                credentials: "include",
                body: JSON.stringify({ report_type}),
            });

            if (!res.ok) throw new Error("Failed to resolve report");
            alert("Report marked as resolved.");

            //optionally remove resolved report from UI
            const alsoDelete = window.confirm("Do you also want to remove this report from the table?");
            if (alsoDelete) {
                handleDeleteReport(report_id);
            }else {
                //just updates status visually 
                setReports(prev =>
                    prev.map(r =>
                        r.report_id === report_id ? { ...r, status: "Resolved" } : r
                    )
                );

            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong while resolving the report.");
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            {/* Title and session check for protected route */}
            <h1>Admin: Report Management</h1>
            <SessionChecking />
            {/* Table component with all report management functions passed as props */}
            <ReportsTable
                reports={reports}
                loading={loading}
                onResolve={handleResolve}
                onDeleteReport={handleDeleteReport}
                onDeleteContent={handleDeleteContent}
            />
        </div>
    );
}