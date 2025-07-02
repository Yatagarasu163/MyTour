'use client';
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ActivityDetails from "../../../../pages/components/trip-plan/ActivityDetails";
import ActivityFormInputs from "../../../../pages/components/trip-plan/ActivityFormInputs";
import SaveButton from "../../../../pages/components/trip-plan/SaveButton";
import ConfirmModal from "../../../../pages/components/trip-plan/ConfirmModal";
import SessionChecking from '../../../component/SessionChecking';

export default function EditActivity({ params: paramsPromise }) {
    const { activity_id } = use(paramsPromise);

    const router = useRouter();

    const [activity, setActivity] = useState(null);
    const [nextActivity, setNextActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [placeUrl, setPlaceUrl] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Fetch selected activity and the next activity (for distance calculation)
    useEffect(() => {
        if (!activity_id) return;

        const fetchData = async () => {
            try {
                // Fetch current activity details
                const res = await fetch(`/api/trip-plan/fetchSelectedActivity?activity_id=${activity_id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch activity");

                setActivity(data);
                setStartTime(data.activity_start_time || "");
                setEndTime(data.activity_end_time || "");
                setPlaceUrl(data.activity_place || "");

                // Fetch next activity for distance update
                const nextRes = await fetch(`/api/trip-plan/fetchNextActivity?plan_id=${data.plan_id}&day=${data.activity_day_number}&current_id=${data.activity_id}`);
                if (nextRes.ok) {
                    const nextData = await nextRes.json();
                    setNextActivity(nextData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activity_id]);

    // Regenerate activity details using Gemini (based on place URL and timing)
    const regenerateActivity = async () => {
        try {
            const res = await fetch("/api/trip-plan/generateNewActivityDetail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    placeUrl,
                    previousPlace: activity.previousPlace,
                    nextPlace: nextActivity?.activity_place,
                    start_time: startTime,
                    end_time: endTime
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            const gemini = data.activity;

            // Update the current activity with Gemini's new data
            const updated = {
                ...activity,
                activity_place: gemini.place,
                activity_start_time: gemini.start_time,
                activity_end_time: gemini.end_time,
                activity_description: gemini.description,
                activity_tags: gemini.tags,
                activity_estimated_distance: gemini.estimated_distance,
                activity_estimated_cost: gemini.estimated_cost,
                activity_booking_required: gemini.booking_required,
                activity_accessible: gemini.accessible,
                activity_local_tip: gemini.local_tip,
                activity_note: gemini.note
            };

            setActivity(updated);
            setPlaceUrl(gemini.place);

            // Update next activity distance if available
            if (nextActivity && gemini.next_estimated_distance) {
                setNextActivity({
                    ...nextActivity,
                    activity_estimated_distance: gemini.next_estimated_distance
                });
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // Save the updated activity (and the next activity if its distance changed)
    const saveActivity = async () => {
        try {
            const res1 = await fetch("/api/trip-plan/updateActivity", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(activity)
            });

            if (!res1.ok) {
                const data = await res1.json();
                throw new Error(data.error);
            }

            if (nextActivity) {
                const res2 = await fetch("/api/trip-plan/updateActivity", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(nextActivity)
                });

                if (!res2.ok) {
                    const data = await res2.json();
                    throw new Error(`Next activity update failed: ${data.error}`);
                }
            }

            setShowSuccessModal(true);
        } catch (err) {
            alert(err.message);
        }
    };

    // Handle loading and error states
    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (error) return <div className="alert alert-danger text-center my-5">{error}</div>;

    return (
        <div className="container my-5">
            <SessionChecking />
            <h2 className="text-center mb-4 fw-bold">Edit Activity</h2>

            <div className="card p-4 shadow-sm mb-4">
                <ActivityFormInputs
                    placeUrl={placeUrl}
                    startTime={startTime}
                    endTime={endTime}
                    onPlaceUrlChange={setPlaceUrl}
                    onStartTimeChange={setStartTime}
                    onEndTimeChange={setEndTime}
                    onGenerateDetails={regenerateActivity}
                />

                <ActivityDetails activity={activity} />

                <SaveButton onClick={saveActivity} />

            </div>

            {/* Success Modal */}
            <ConfirmModal
                show={showSuccessModal}
                title="Activity Saved"
                message="Your activity was successfully updated."
                confirmText="Close"
                cancelText="Cancel"
                onConfirm={() => {
                    setShowSuccessModal(false);
                    router.push(`/trip-plan/view-trip/${activity.plan_id}`);
                }}
                onCancel={() =>{
                    setShowSuccessModal(false);
                    router.push(`/trip-plan/view-trip/${activity.plan_id}`);
                }}
            />
        </div>
    );
}
