import 'bootstrap/dist/css/bootstrap.min.css';

export default function ActivityDetails({ activity }) {
    if (!activity) return null;

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-header fw-semibold">
                {activity.activity_place}
            </div>
            <div className="card-body">
                <p><strong>Description:</strong> {activity.activity_description}</p>
                <p><strong>Tags:</strong> {Array.isArray(activity.activity_tags) ? activity.activity_tags.join(", ") : activity.activity_tags}</p>
                <p><strong>Estimated Distance:</strong> {activity.activity_estimated_distance} KM</p>
                <p><strong>Estimated Cost:</strong> RM {activity.activity_estimated_cost}</p>
                <p><strong>Booking Required:</strong> {activity.activity_booking_required ? "Yes" : "No"}</p>
                <p><strong>Accessible:</strong> {activity.activity_accessible ? "Yes" : "No"}</p>
                <p><strong>Local Tip:</strong> {activity.activity_local_tip}</p>
                {activity.activity_note && (
                    <p><strong>Note:</strong> {activity.activity_note}</p>
                )}
            </div>
        </div>
    );
}
