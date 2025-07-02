'use client';
import { useEffect, useState } from 'react';
import TripSummaryCard from '../../../pages/components/trip-plan/TripSummaryCard';
import TabSwitcher from '../../../pages/components/trip-plan/TabSwitcher';
import ViewTripButton from '../../../pages/components/trip-plan/ViewTripButton';
import MarkCompletedButton from '../../../pages/components/trip-plan/MarkCompletedButton';
import PostTripButton from '../../../pages/components/trip-plan/PostTripButton'
import DeleteTripButton from '../../../pages/components/trip-plan/DeleteTripButton';
import SessionChecking from '../../component/SessionChecking';

export default function SavedTrips() {
    const [trips, setTrips] = useState([]);
    // Map to store post status by trip plan_id (for completed trips)
    const [postStatusMap, setPostStatusMap] = useState({});
    const [activeTab, setActiveTab] = useState("incompleted");

    useEffect(() => {
        // Fetch all trip plans and posts
        const fetchData = async () => {
            try {
                const tripRes = await fetch('/api/trip-plan/fetchAllTripPlan');
                const tripsData = await tripRes.json();

                const postRes = await fetch('/api/trip-plan/fetchAllPost');
                const postData = await postRes.json();

                 // Create a map of plan_id to post_status for quick lookup
                const postMap = {};
                postData.forEach(post => {
                    postMap[post.plan_id] = post.post_status;
                });

                // Update state with fetched data
                setTrips(Array.isArray(tripsData) ? tripsData : []);
                setPostStatusMap(postMap);
            } catch (err) {
                console.error("Failed to fetch trip or post data", err);
            }
        };

        fetchData();
    }, []);

    // Filter trips based on active tab: incompleted or completed
    const filteredTrips = trips.filter(trip =>
        activeTab === "incompleted" ? trip.plan_status !== 1 : trip.plan_status === 1
    );

    return (
        <div className="container my-5">
            <SessionChecking />
            <h2 className="mb-4 fw-bold text-center">My Trip Plan</h2>

            <TabSwitcher
                tabs={[
                    { key: "incompleted", label: "Incompleted" },
                    { key: "completed", label: "Completed" }
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="row g-4">
                {filteredTrips.length > 0 ? (
                    filteredTrips.map((trip) => (
                        <div key={trip.plan_id} className="col-md-6">
                            <div className="card h-100 shadow-sm p-3">
                                {/* Display trip summary */}
                                <TripSummaryCard trip={trip} />

                                <div className="mt-3 d-flex justify-content-between flex-wrap gap-2">
                                    {/* Left side: View + Delete */}
                                    <div className="d-flex gap-2">
                                        <ViewTripButton plan_id={trip.plan_id} />
                                        {activeTab === "incompleted" && (
                                        <DeleteTripButton
                                            plan_id={trip.plan_id}
                                            onDelete={(deletedId) =>
                                            setTrips((prev) => prev.filter((t) => t.plan_id !== deletedId))
                                            }
                                        />
                                        )}
                                    </div>

                                    {/* Right side: Mark Completed or Post */}
                                    <div>
                                        {activeTab === "incompleted" ? (
                                        <MarkCompletedButton
                                            plan_id={trip.plan_id}
                                            onCompleted={() => location.reload()}
                                        />
                                        ) : (
                                        <PostTripButton
                                            plan_id={trip.plan_id}
                                            isPosted={postStatusMap[trip.plan_id] === 1}
                                        />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center text-muted">
                        No {activeTab === "completed" ? "completed" : "incompleted"} trips found.
                    </div>
                )}
            </div>
        </div>
    );
}
