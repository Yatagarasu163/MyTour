'use client';
import { use, useEffect, useState } from 'react';
import TripPlanDetails from '../../../../pages/components/trip-plan/TripPlanDetails';
import SessionChecking from '../../../../pages/components/SessionChecking';

export default function ViewTripPlan({ params: paramsPromise}) {
    const { plan_id } = use(paramsPromise);

    const [tripPlan, setTripPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!plan_id) return;

        // Fetch the selected trip plan from the API
        const fetchTripPlan = async () => {
            try {
                const res = await fetch(`/api/trip-plan/fetchSelectedTripPlan?plan_id=${plan_id}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch trip plan");

                setTripPlan(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTripPlan();
    }, [plan_id]);

    if (loading) return <p className="text-center my-5">Loading...</p>;
    if (error) return <p className="text-danger text-center my-5">{error}</p>;

    return (
        <div className="container my-5">
                <SessionChecking />
                 {/* isEditable is passed true only if plan is not marked as completed */}
                <TripPlanDetails tripPlan={tripPlan} isEditable={tripPlan.plan_status !== 1} />
        </div>
    );
}
