"use client";
import { useState } from "react";
import GenerateForm from "../../../pages/components/trip-plan/GenerateForm";
import GeneratedItinerary from "../../../pages/components/trip-plan/GeneratedItinerary";
import 'bootstrap/dist/css/bootstrap.min.css';
import SessionChecking from '../../component/SessionChecking';

export default function TripGenerator() {
    const [tripName, setTripName] = useState("");
    const [days, setDays] = useState(1);
    const [selectedStates, setSelectedStates] = useState([]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("18:00");
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState("");

    // Toggle selected states on checkbox change
    const handleCheckboxChange = (stateName) => {
        setSelectedStates((prev) =>
            prev.includes(stateName)
                ? prev.filter((s) => s !== stateName)
                : [...prev, stateName]
        );
    };

    // Submit handler to generate itinerary using backend API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setItinerary(null);

        try {
            const res = await fetch("/api/trip-plan/generateTripPlan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    days,
                    state: selectedStates,
                    startTime,
                    endTime,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to generate");
            setItinerary(data.itinerary);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Save handler to insert the trip plan to the database
    const handleSave = async () => {
        const trimmedName = tripName.trim();

        if (!itinerary || !tripName.trim()) {
            alert("Please enter a trip name before saving.");
            return;
        }

        if (!itinerary || trimmedName.length < 5 || trimmedName.length > 100) {
            alert("Trip name must be between 5 and 100 characters.");
            return;
        }

        try {
            const res = await fetch("/api/trip-plan/saveTripPlan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: tripName,
                    days,
                    state: selectedStates,
                    itinerary,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save");

            return true;
        } catch (err) {
            alert(`Error saving itinerary: ${err.message}`);
        }
    };

    return (
        <div className="container my-5">
            <SessionChecking />
            <GenerateForm
                tripName={tripName}
                setTripName={setTripName}
                days={days}
                setDays={setDays}
                selectedStates={selectedStates}
                handleCheckboxChange={handleCheckboxChange}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                loading={loading}
                handleSubmit={handleSubmit}
                itinerary={itinerary}
                handleSave={handleSave}
            />

            {error && <p className="text-danger">{error}</p>}

            {itinerary && <GeneratedItinerary itinerary={itinerary} />}
        </div>
    );
}
