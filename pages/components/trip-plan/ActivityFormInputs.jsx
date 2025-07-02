export default function ActivityFormInputs({
    placeUrl,
    startTime,
    endTime,
    onPlaceUrlChange,
    onStartTimeChange,
    onEndTimeChange,
    onGenerateDetails
}) {
     // Validate that the provided URL is a valid Google Maps link
    const isValidGoogleMapsUrl = (url) => {
        try {
            const parsed = new URL(url);
            return (
                (parsed.protocol === "http:" || parsed.protocol === "https:") &&
                parsed.hostname.includes("google.com") &&
                parsed.pathname.includes("/maps")
            );
        } catch {
            return false;
        }
    };

    return (
        <>
            {/* Input for Place URL */}
            <div className="mb-3">
                <label className="form-label fw-medium">Place URL (Google Map)</label>
                <input
                    type="url"
                    value={placeUrl}
                    onChange={(e) => onPlaceUrlChange(e.target.value)}
                    className="form-control"
                    placeholder="https://maps.google.com/..."
                    required
                />

                {placeUrl && !isValidGoogleMapsUrl(placeUrl) && (
                    <div className="form-text text-danger">
                        Please enter a valid Google Maps URL.
                    </div>
                )}
            </div>

            {/* Input for Start and End Time */}
            <div className="row">
                {/* Start Time Field */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">Start Time</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => onStartTimeChange(e.target.value)}
                        className="form-control"
                    />
                </div>

                {/* End Time Field */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">End Time</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => onEndTimeChange(e.target.value)}
                        className="form-control"
                    />
                </div>
            </div>

            {/* Generate Details Button */}
            <div className="text-end">
                <button
                    onClick={onGenerateDetails}
                    className="btn btn-success"
                    disabled={!isValidGoogleMapsUrl(placeUrl)} // Button disabled until valid URL
                >
                    Generate Details
                </button>
            </div>
        </>
    );
}
