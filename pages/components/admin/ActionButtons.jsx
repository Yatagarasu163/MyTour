// type = "report", "user", or "admin"
// status = "active","suspended", "pending","resolved"
// styles here are temp
export default function ActionButtons({
    type = "",
    status = "",
    report_type = "",
    onResolve,
    onSuspendRestore,
    onDeleteContent,
    onDeleteReport,
    onDeleteUser,
    onDeleteAdmin
}) {
    const lowerStatus = status.toLowerCase();

    // report actions
    if (type === "report") {
        if (report_type === "user") {
            // User reports only: no delete content
            return status === "Resolved" ? (
            <>
                {onDeleteReport && <button onClick={onDeleteReport}>Delete Report</button>}
            </>
            ) : (
            <>
                {onResolve && <button onClick={onResolve}>Resolve</button>}
                {onDeleteReport && (
                <button onClick={onDeleteReport} style={{ marginLeft: "0.5rem" }}>
                    Delete Report
                </button>
                )}
            </>
            );
        } else {
            // Post/Comment reports
            return status === "Resolved" ? (
            <>
                {onDeleteReport && <button onClick={onDeleteReport}>Delete Report</button>}
                {onDeleteContent && (
                <button onClick={onDeleteContent} style={{ marginLeft: "0.5rem" }}>
                    Delete Content
                </button>
                )}
            </>
            ) : (
            <>
                {onResolve && <button onClick={onResolve}>Resolve</button>}
                {onDeleteContent && (
                <button onClick={onDeleteContent} style={{ marginLeft: "0.5rem" }}>
                    Delete Content
                </button>
                )}
            </>
            );
        }
    }

    //user actions
    if (type === "user") {
        return (
        <>
            {onSuspendRestore && (
            <button onClick={onSuspendRestore}>
                {lowerStatus === "active" ? "Suspend" : "Restore"}
            </button>
            )}
            {onDeleteUser && (
            <button onClick={onDeleteUser} style={{ marginLeft: "0.5rem" }}>
                Delete
            </button>
            )}
        </>
        );
    }

    // admin actions
    if (type === "admin") {
        return (
        <>
            {onSuspendRestore && (
            <button onClick={onSuspendRestore}>
                {lowerStatus === "active" ? "Suspend" : "Restore"}
            </button>
            )}
            {onDeleteAdmin && (
            <button onClick={onDeleteAdmin} style={{ marginLeft: "0.5rem" }}>
                Delete
            </button>
            )}
        </>
        );
    }

  return null; // fallback
}
