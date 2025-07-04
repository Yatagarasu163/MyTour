'use client';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { useRouter } from 'next/navigation';

export default function GenerateForm({
    tripName,
    setTripName,
    days,
    setDays,
    selectedStates,
    handleCheckboxChange,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    loading,
    handleSubmit,
    itinerary,
    handleSave
}) {
    const router = useRouter();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const availableStates = [
        "Selangor", "Pulau Pinang", "Johor", "Sabah", "Sarawak", "Melaka",
        "Perak", "Pahang", "Terengganu", "Perlis", "Negeri Sembilan",
        "Kelantan", "Kedah", "Kuala Lumpur (Federal Territory)",
        "Putrajaya (Federal Territory)", "Labuan (Federal Territory)"
    ];

    const handleConfirmSave = async () => {
        setShowConfirmModal(false);
        const success = await handleSave();

        if (success) {
            setShowSuccessModal(true);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="mb-5">
                <h2 className="mb-4 fw-bold text-center">Trip Plan Generator</h2>

                {/* Trip Name Field */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Trip Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Family Road Trip"
                        value={tripName}
                        onChange={(e) => setTripName(e.target.value)}
                        minLength={5}
                        maxLength={100}
                        required
                    />
                    
                    {/* Validation messages */}
                    {tripName?.trim()?.length === 0 && (
                        <div className="form-text text-danger">
                            Trip name is required.
                        </div>
                    )}
                    {tripName?.length > 0 && tripName.length < 5 && (
                        <div className="form-text text-danger">
                            Trip name must be at least 5 characters.
                        </div>
                    )}
                    {tripName?.length > 100 && (
                        <div className="form-text text-danger">
                            Trip name must not exceed 100 characters.
                        </div>
                    )}
                </div>

                {/* Number of Days Field */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Number of Days</label>
                    <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        required
                    />
                </div>
                
                {/* States Multi-Checkbox Field */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Select State(s)</label>
                    <div className="row">
                        {availableStates.map((stateName) => (
                            <div className="col-6" key={stateName}>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={stateName}
                                        checked={selectedStates?.includes(stateName)}
                                        onChange={() => handleCheckboxChange(stateName)}
                                    />
                                    <label className="form-check-label" htmlFor={stateName}>
                                        {stateName}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Start Time Field */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Start Time</label>
                    <input
                        type="time"
                        className="form-control"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>

                {/* End Time Field */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">End Time</label>
                    <input
                        type="time"
                        className="form-control"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>

                {/* Buttons: Generate & Save */}
                <div className="d-flex gap-3">
                    {/* Generate Button */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Trip Plan"}
                    </button>

                    {/* Save Button (only appears if itinerary is generated) */}
                    {itinerary && (
                        <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setShowConfirmModal(true)}
                        disabled={
                            !tripName?.trim() || tripName?.length < 5 || tripName?.length > 100
                        }
                        >
                            Save Trip Plan
                        </button>

                    )}
                </div>
            </form>

            {/* Confirm Save Modal */}
            <ConfirmModal
                show={showConfirmModal}
                title="Confirm Save"
                message="Are you sure you want to save this trip plan?"
                confirmText="Yes, Save"
                cancelText="Cancel"
                onConfirm={handleConfirmSave}
                onCancel={() => setShowConfirmModal(false)}
            />

            {/* Success Modal */}
            <ConfirmModal
                show={showSuccessModal}
                title="Trip Plan Saved"
                message="Your trip plan has been successfully saved."
                confirmText="Close"
                cancelText="Cancel"
                onConfirm={() => router.push("/trip-plan/my-trip-plan")}
                onCancel={() => setShowSuccessModal(false)}
            />
        </>
    );
}
