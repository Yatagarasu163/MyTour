export default function DayCard({ day }) {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header">
                <h5 className="mb-0">Day {day.days} – {day.states}</h5>
            </div>
            <ul className="list-group list-group-flush">
                {day.activities.map((act, idx) => (
                    <li key={idx} className="list-group-item">
                        <p className="fw-bold mb-1">{act.place}</p>
                        <p className="mb-1"><strong>Time:</strong> {act.start_time} – {act.end_time}</p>
                        <p className="mb-1"><strong>Description:</strong> {act.description}</p>
                        <p className="mb-1"><strong>Tags:</strong> {act.tags.join(", ")}</p>
                        <p className="mb-1"><strong>Estimated Cost:</strong> RM {act.estimated_cost}</p>
                        <p className="mb-1"><strong>Estimated Distance:</strong> {act.estimated_distance} KM</p>
                        <p className="mb-1"><strong>Booking Required:</strong> {act.booking_required ? "Yes" : "No"}</p>
                        <p className="mb-1"><strong>Accessible:</strong> {act.accessible ? "Yes" : "No"}</p>
                        <p className="mb-1"><strong>Tip:</strong> {act.local_tip}</p>
                        {act.note && <p className="mb-0"><strong>Note:</strong> {act.note}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
