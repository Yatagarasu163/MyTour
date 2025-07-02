import 'bootstrap/dist/css/bootstrap.min.css';
import EditActivityButton from './EditActivityButton';
import DeleteActivityButton from './DeleteActivityButton';
import { useState, useEffect } from 'react';


export default function TripPlanDetails({ tripPlan , isEditable }) {
    const [activities, setActivities] = useState([]);

    // Sort activities by day and start time when tripPlan.activities changes
    useEffect(() => {
        const sorted = [...(tripPlan.activities || [])].sort((a, b) => {
            if (a.activity_day_number !== b.activity_day_number) {
                return a.activity_day_number - b.activity_day_number;
            }
            return a.activity_start_time.localeCompare(b.activity_start_time);
        });
        setActivities(sorted);
    }, [tripPlan.activities]);

    // Group activities by day number
    const groupedByDay = activities.reduce((acc, activity) => {
        const day = activity.activity_day_number;
        if (!acc[day]) acc[day] = [];
        acc[day].push(activity);
        return acc;
    }, {});

    return (
        <div className="container my-4">
            {/* Trip General Info Section */}
            <div className="mb-4">
                <h2 className="mb-4 fw-bold text-center">{tripPlan.plan_name}</h2>
                <p className="text-center mb-2"><strong>Days:</strong> {tripPlan.plan_day}</p>
                <p className="text-center mb-4"><strong>State:</strong> {tripPlan.plan_state}</p>
            </div>

            {/* Loop through grouped activities by day */}
            {Object.entries(groupedByDay).map(([day, activities]) => (
                <div key={day} className="mb-5">
                    <h4 className="fw-bold mb-3">Day {day}</h4>

                    {/* List of activities for this day */}
                    <div className="d-flex flex-column gap-4">
                        {activities.map((activity) => (
                            <div key={activity.activity_id} className="card shadow-sm">
                                <div className="card-header fw-semibold">
                                    {activity.activity_place}
                                </div>

                                {/* Activity Details */}
                                <div className="card-body">
                                    <p><strong>Time:</strong> {activity.activity_start_time} – {activity.activity_end_time}</p>
                                    <p><strong>Description:</strong> {activity.activity_description}</p>
                                    
                                     {/* Optional: display tags only if available */}
                                    {activity.activity_tags?.length > 0 && (
                                    <p><strong>Tags:</strong> {activity.activity_tags.join(", ")}</p>
                                    )}

                                    <p><strong>Estimated Cost:</strong> RM {activity.activity_estimated_cost}</p>
                                    <p><strong>Estimated Distance:</strong> {activity.activity_estimated_distance} KM</p>
                                    <p><strong>Booking Required:</strong> {activity.activity_booking_required ? "Yes" : "No"}</p>
                                    <p><strong>Accessible:</strong> {activity.activity_accessible ? "Yes" : "No"}</p>
                                    <p><strong>Tip:</strong> {activity.activity_local_tip}</p>

                                    {/* Optional: only show note if it exists */}
                                    {activity.activity_note && (
                                        <p><strong>Note:</strong> {activity.activity_note}</p>
                                    )}
                                </div>

                                {/* Edit/Delete Buttons only shown if isEditable = true */}
                                {isEditable && (
                                <div className="card-footer bg-transparent d-flex justify-content-end gap-2">
                                    <EditActivityButton activity_id={activity.activity_id} />
                                    <DeleteActivityButton
                                    activity_id={activity.activity_id}
                                    onDelete={(deletedId) =>
                                        setActivities((prev) => prev.filter((a) => a.activity_id !== deletedId))
                                    }
                                    />
                                </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
