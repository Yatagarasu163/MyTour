'use client';

export default function PostTripForm({ title, description, setTitle, setDescription, handleSubmit, error }) {
    // Determine if the title input is invalid (used to disable button and show validation)
    const isTitleInvalid = title?.trim().length < 5 || title?.length > 100;

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="card-title mb-3 fw-semibold">Share Your Experience</h5>

                {/* Post Title Field */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Post Title</label>
                    <input
                        className="form-control"
                        placeholder="e.g. My Sabah Adventure!"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        minLength={5}
                        maxLength={100}
                        required
                    />

                    {/* Validation Feedback for Title */}
                    {title?.length > 0 && title.length < 5 && (
                        <div className="form-text text-danger">
                            Title must be at least 5 characters.
                        </div>
                    )}
                    {title?.length > 100 && (
                        <div className="form-text text-danger">
                            Title must not exceed 100 characters.
                        </div>
                    )}
                </div>

                {/* Description Textarea */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Write about your trip highlights, tips, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Display error message from submission attempt */}
                {error && (
                <p className="text-danger small mb-3">
                    <i className="bi bi-exclamation-circle-fill me-1"></i>{error}
                </p>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="btn btn-primary w-100"
                    disabled={isTitleInvalid}
                >
                    Post to Community
                </button>
            </div>
        </div>
    );
}
