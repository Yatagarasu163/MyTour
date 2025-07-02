'use client';
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import TripPlanDetails from "../../../../pages/components/trip-plan/TripPlanDetails";
import PostTripForm from "../../../../pages/components/trip-plan/PostTripForm";
import ConfirmModal from "../../../../pages/components/trip-plan/ConfirmModal";
import SessionChecking from '../../../../pages/components/SessionChecking';

export default function PostTrip({ params }) {
    const router = useRouter();
    const { plan_id } = use(params)

    const [tripPlan, setTripPlan] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (!plan_id) return;

        // Fetch selected trip plan based on plan_id
        const fetchTrip = async () => {
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

        fetchTrip();
    }, [plan_id]);

    // Handle form submission
    const handleSubmit = () => {
        if (!title || !description) {
            setError("Title and description are required.");
            return;
        }
        setShowConfirmModal(true); // Open confirm modal before final submission
    };

    // Confirm and perform actual post
    const confirmPost = async () => {
        setShowConfirmModal(false);
        try {
            const res = await fetch("/api/trip-plan/createPost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, plan_id })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to post trip");

            setShowSuccessModal(true); // Show success modal on success
        } catch (err) {
            setError(err.message);
        }
    };

    // Loading or no data states
    if (loading) return <p className="text-center my-5">Loading trip plan...</p>;
    if (!tripPlan) return <p className="text-center">No trip plan found.</p>;

    return (
        <div className="container my-5">
            <SessionChecking />
            <h2 className="text-center mb-4 fw-bold">Post Your Trip Plan to the Community Page</h2>

            <div className="row">
                {/* Left column: Post form */}
                <div className="col-md-5">
                    <PostTripForm
                        title={title}
                        description={description}
                        setTitle={setTitle}
                        setDescription={setDescription}
                        handleSubmit={handleSubmit}
                        error={error}
                    />
                </div>

                {/* Right column: Preview of the trip */}
                <div className="col-md-7">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-3 fw-semibold">Trip Plan Preview</h5>
                            <TripPlanDetails tripPlan={tripPlan} isEditable={tripPlan.plan_status !== 1} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Post Modal */}
            <ConfirmModal
                show={showConfirmModal}
                title="Confirm Post"
                message="Are you sure you want to share this trip plan with the community?"
                confirmText="Yes, Post"
                cancelText="Cancel"
                onConfirm={confirmPost}
                onCancel={() => setShowConfirmModal(false)}
            />

            {/* Success Modal */}
            <ConfirmModal
                show={showSuccessModal}
                title="Trip Plan Posted!"
                message="Your trip plan has been successfully posted."
                confirmText="Go to Community"
                cancelText="Back to My Trip Plan"
                onConfirm={() => router.push("/community-page")} //temp
                onCancel={() => router.push("/trip-plan/my-trip-plan")}
            />
        </div>
    );
}
