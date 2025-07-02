export default function StatCard({ title, value}){ 
    return (
        <div style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                width: "180px",
                textAlign: "center",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
                background: "#f9f9f9"
            }}>
            <h3 style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>{title}</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
        </div>
    );
}