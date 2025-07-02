import 'bootstrap/dist/css/bootstrap.min.css';

export default function TripSummaryCard({ trip }) {
    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body">
                <h5 className="card-title fw-bold">{trip.plan_name}</h5>
                <p className="card-text mb-1"><strong>Days:</strong> {trip.plan_day}</p>
                <p className="card-text mb-2"><strong>State:</strong> {trip.plan_state}</p>
            </div>
        </div>
    );
}
