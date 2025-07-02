//colour for status (active, suspended, resolved, pending)
// styling here is temp 

export default function StatusBadge ({status}) {
    let bgColor = "gray";
    let label = status;

    switch (status?.toLowerCase()) {
        case "active":
            bgColor = "green";
            break;
        case "suspended":
            bgColor = "red";
            break;
        case "resolved":
            bgColor = "blue";
            break;
        case "pending":
            bgColor = "orange";
            break;
        default: 
        bgColor = "gray";
    }

    return ( 
        <span
            style={{
                backgroundColor: bgColor,
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.8rem",
                textTransform: "capitalize"
            }}
        >
            {label}
        </span>
    );
}